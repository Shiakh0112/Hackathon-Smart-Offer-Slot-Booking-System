using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Data;
using OfferSlotBooking.DTOs;

namespace OfferSlotBooking.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<IActionResult> Summary()
    {
        var todayStart = DateTime.UtcNow.Date;
        var todayEnd = todayStart.AddDays(1);

        var totalOffers = await _db.Offers.CountAsync();
        var activeOffers = await _db.Offers.CountAsync(o => o.Status == "Active");
        var totalBookings = await _db.Bookings.CountAsync();
        var todaysBookings = await _db.Bookings.CountAsync(b => b.CreatedAt >= todayStart && b.CreatedAt < todayEnd);

        var slots = await _db.OfferSlots.ToListAsync();
        var totalCapacity = slots.Sum(s => s.Capacity);
        var bookedSeats = slots.Sum(s => s.BookedCount);
        var availableSeats = totalCapacity - bookedSeats;
        var conversionRate = totalCapacity > 0 ? Math.Round((double)bookedSeats / totalCapacity * 100, 2) : 0;

        var recentBookings = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o.Business)
            .Include(b => b.Slot)
            .OrderByDescending(b => b.CreatedAt)
            .Take(10)
            .ToListAsync();

        // Last 7 days booking stats
        var last7Days = await _db.Bookings
            .Where(b => b.CreatedAt >= DateTime.UtcNow.Date.AddDays(-6))
            .GroupBy(b => b.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync();

        var stats = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-6 + i))
            .Select(d => new DailyBookingStat(
                d.ToString("MMM dd"),
                last7Days.FirstOrDefault(x => x.Date == d)?.Count ?? 0))
            .ToList();

        var recentDtos = recentBookings.Select(b => new BookingDto(
            b.Id, b.BookingReference, b.OfferId, b.Offer?.Title ?? "",
            b.Offer?.Business?.Name ?? "", b.SlotId,
            b.Slot?.SlotDate.ToString("yyyy-MM-dd") ?? "",
            b.Slot?.StartTime ?? "", b.Slot?.EndTime ?? "",
            b.CustomerName, b.CustomerPhone, b.CustomerEmail,
            b.PeopleCount, b.SpecialNote, b.Status, b.CreatedAt));

        return Ok(new DashboardSummary(
            totalOffers, activeOffers, totalBookings, todaysBookings,
            totalCapacity, bookedSeats, availableSeats, conversionRate, recentDtos, stats));
    }
}
