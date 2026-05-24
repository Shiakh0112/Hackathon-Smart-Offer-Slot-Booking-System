using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Data;
using OfferSlotBooking.DTOs;
using OfferSlotBooking.Models;

namespace OfferSlotBooking.Controllers;

[ApiController]
[Route("api/offers")]
public class OffersController : ControllerBase
{
    private readonly AppDbContext _db;
    public OffersController(AppDbContext db) => _db = db;

    private static OfferDto ToDto(Offer o, int availableSlots) => new(
        o.Id, o.BusinessId, o.Business?.Name ?? "", o.Business?.BusinessType ?? "",
        o.Title, o.Description, o.Category, o.OriginalPrice, o.OfferPrice,
        o.DiscountPercentage, o.StartDate, o.EndDate, o.StartTime, o.EndTime,
        o.TotalCapacity, o.MaxBookingPerCustomer, o.TermsAndConditions, o.Status,
        o.CreatedAt, o.UpdatedAt, availableSlots,
        o.Business?.City, o.Business?.Address);

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? businessType, [FromQuery] string? category,
        [FromQuery] DateTime? date, [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice, [FromQuery] bool? availableOnly,
        [FromQuery] bool adminView = false)
    {
        var query = _db.Offers.Include(o => o.Business).Include(o => o.Slots).AsQueryable();

        if (!adminView)
            query = query.Where(o => o.Status == "Active" && o.EndDate >= DateTime.UtcNow);
        if (!string.IsNullOrEmpty(businessType))
            query = query.Where(o => o.Business!.BusinessType == businessType);
        if (!string.IsNullOrEmpty(category))
            query = query.Where(o => o.Category == category);
        if (date.HasValue)
            query = query.Where(o => o.StartDate.Date <= date.Value.Date && o.EndDate.Date >= date.Value.Date);
        if (minPrice.HasValue)
            query = query.Where(o => o.OfferPrice >= minPrice.Value);
        if (maxPrice.HasValue)
            query = query.Where(o => o.OfferPrice <= maxPrice.Value);

        var offers = await query.ToListAsync();

        if (availableOnly == true)
            offers = offers.Where(o => o.Slots.Any(s => s.Status == "Available" && s.AvailableCount > 0)).ToList();

        return Ok(offers.Select(o =>
        {
            var avail = o.Slots.Where(s => s.Status == "Available").Sum(s => s.AvailableCount);
            return ToDto(o, avail);
        }));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var o = await _db.Offers.Include(o => o.Business).Include(o => o.Slots).FirstOrDefaultAsync(o => o.Id == id);
        if (o == null) return NotFound();
        var avail = o.Slots.Where(s => s.Status == "Available").Sum(s => s.AvailableCount);
        return Ok(ToDto(o, avail));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOfferRequest req)
    {
        if (req.OfferPrice >= req.OriginalPrice)
            return BadRequest(new { message = "Offer price must be less than original price" });

        var discount = Math.Round((req.OriginalPrice - req.OfferPrice) / req.OriginalPrice * 100, 2);
        var offer = new Offer
        {
            BusinessId = req.BusinessId, Title = req.Title, Description = req.Description,
            Category = req.Category, OriginalPrice = req.OriginalPrice, OfferPrice = req.OfferPrice,
            DiscountPercentage = discount, StartDate = req.StartDate, EndDate = req.EndDate,
            StartTime = req.StartTime, EndTime = req.EndTime, TotalCapacity = req.TotalCapacity,
            MaxBookingPerCustomer = req.MaxBookingPerCustomer,
            TermsAndConditions = req.TermsAndConditions, Status = req.Status
        };
        _db.Offers.Add(offer);
        await _db.SaveChangesAsync();
        await _db.Entry(offer).Reference(o => o.Business).LoadAsync();
        return CreatedAtAction(nameof(Get), new { id = offer.Id }, ToDto(offer, 0));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateOfferRequest req)
    {
        var offer = await _db.Offers.Include(o => o.Business).Include(o => o.Slots).FirstOrDefaultAsync(o => o.Id == id);
        if (offer == null) return NotFound();
        if (req.OfferPrice >= req.OriginalPrice)
            return BadRequest(new { message = "Offer price must be less than original price" });

        offer.Title = req.Title; offer.Description = req.Description; offer.Category = req.Category;
        offer.OriginalPrice = req.OriginalPrice; offer.OfferPrice = req.OfferPrice;
        offer.DiscountPercentage = Math.Round((req.OriginalPrice - req.OfferPrice) / req.OriginalPrice * 100, 2);
        offer.StartDate = req.StartDate; offer.EndDate = req.EndDate;
        offer.StartTime = req.StartTime; offer.EndTime = req.EndTime;
        offer.TotalCapacity = req.TotalCapacity; offer.MaxBookingPerCustomer = req.MaxBookingPerCustomer;
        offer.TermsAndConditions = req.TermsAndConditions; offer.Status = req.Status;
        offer.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        var avail = offer.Slots.Where(s => s.Status == "Available").Sum(s => s.AvailableCount);
        return Ok(ToDto(offer, avail));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var offer = await _db.Offers.FindAsync(id);
        if (offer == null) return NotFound();
        _db.Offers.Remove(offer);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{offerId}/slots")]
    public async Task<IActionResult> GetSlots(int offerId)
    {
        var slots = await _db.OfferSlots
            .Include(s => s.Offer)
            .Where(s => s.OfferId == offerId)
            .ToListAsync();
        return Ok(slots.Select(s => new SlotDto(
            s.Id, s.OfferId, s.Offer?.Title ?? "", s.SlotDate, s.StartTime, s.EndTime,
            s.Capacity, s.BookedCount, s.AvailableCount, s.Status, s.CreatedAt)));
    }
}
