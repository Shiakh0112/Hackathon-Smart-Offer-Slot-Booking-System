using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Data;
using OfferSlotBooking.DTOs;
using OfferSlotBooking.Models;

namespace OfferSlotBooking.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _db;
    public BookingsController(AppDbContext db) => _db = db;

    private static BookingDto ToDto(Booking b) => new(
        b.Id, b.BookingReference, b.OfferId, b.Offer?.Title ?? "",
        b.Offer?.Business?.Name ?? "", b.SlotId,
        b.Slot?.SlotDate.ToString("yyyy-MM-dd") ?? "",
        b.Slot?.StartTime ?? "", b.Slot?.EndTime ?? "",
        b.CustomerName, b.CustomerPhone, b.CustomerEmail,
        b.PeopleCount, b.SpecialNote, b.Status, b.CreatedAt);

    [HttpGet("search")]
    public async Task<IActionResult> SearchByReference([FromQuery] string reference)
    {
        if (string.IsNullOrWhiteSpace(reference))
            return BadRequest(new { message = "Reference is required" });

        var b = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o.Business)
            .Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.BookingReference == reference.Trim().ToUpper());

        return b == null ? NotFound(new { message = "Booking not found" }) : Ok(ToDto(b));
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var bookings = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o.Business)
            .Include(b => b.Slot)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
        return Ok(bookings.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var b = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o.Business)
            .Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.Id == id);
        return b == null ? NotFound() : Ok(ToDto(b));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest req)
    {
        var offer = await _db.Offers.FindAsync(req.OfferId);
        if (offer == null) return BadRequest(new { message = "Offer not found" });
        if (offer.Status != "Active") return BadRequest(new { message = "Offer is not active" });
        if (offer.EndDate < DateTime.UtcNow) return BadRequest(new { message = "Offer has expired" });

        var slot = await _db.OfferSlots.FindAsync(req.SlotId);
        if (slot == null) return BadRequest(new { message = "Slot not found" });
        if (slot.Status != "Available") return BadRequest(new { message = "Slot is not available" });
        if (slot.AvailableCount < req.PeopleCount)
            return BadRequest(new { message = $"Only {slot.AvailableCount} seats available" });

        var existingBookings = await _db.Bookings
            .Where(b => b.OfferId == req.OfferId && b.CustomerPhone == req.CustomerPhone
                && b.Status != "Cancelled")
            .SumAsync(b => b.PeopleCount);
        if (existingBookings + req.PeopleCount > offer.MaxBookingPerCustomer)
            return BadRequest(new { message = $"Booking limit of {offer.MaxBookingPerCustomer} per customer exceeded" });

        var booking = new Booking
        {
            BookingReference = $"BK{DateTime.UtcNow:yyyyMMddHHmmss}{Random.Shared.Next(1000, 9999)}",
            OfferId = req.OfferId, SlotId = req.SlotId,
            CustomerName = req.CustomerName, CustomerPhone = req.CustomerPhone,
            CustomerEmail = req.CustomerEmail, PeopleCount = req.PeopleCount,
            SpecialNote = req.SpecialNote, Status = "Confirmed"
        };

        slot.BookedCount += req.PeopleCount;
        if (slot.BookedCount >= slot.Capacity) slot.Status = "Full";

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        // Mock notification log
        _db.NotificationLogs.Add(new Models.NotificationLog
        {
            Type = "WhatsApp",
            Recipient = req.CustomerPhone,
            Message = $"Booking confirmed! Ref: {booking.BookingReference}. Thank you {req.CustomerName}.",
            Status = "Sent"
        });
        await _db.SaveChangesAsync();

        await _db.Entry(booking).Reference(b => b.Offer).LoadAsync();
        await _db.Entry(booking.Offer).Reference(o => o.Business).LoadAsync();
        await _db.Entry(booking).Reference(b => b.Slot).LoadAsync();

        return CreatedAtAction(nameof(Get), new { id = booking.Id }, ToDto(booking));
    }

    [Authorize]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusRequest req)
    {
        var booking = await _db.Bookings.Include(b => b.Slot).FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return NotFound();

        if (booking.Status != "Cancelled" && req.Status == "Cancelled" && booking.Slot != null)
        {
            booking.Slot.BookedCount = Math.Max(0, booking.Slot.BookedCount - booking.PeopleCount);
            if (booking.Slot.Status == "Full") booking.Slot.Status = "Available";
        }

        booking.Status = req.Status;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Status updated" });
    }
}
