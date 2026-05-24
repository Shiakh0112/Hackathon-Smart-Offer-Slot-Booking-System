using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Data;
using OfferSlotBooking.DTOs;
using OfferSlotBooking.Models;

namespace OfferSlotBooking.Controllers;

[ApiController]
[Route("api/slots")]
public class SlotsController : ControllerBase
{
    private readonly AppDbContext _db;
    public SlotsController(AppDbContext db) => _db = db;

    private static SlotDto ToDto(OfferSlot s) => new(
        s.Id, s.OfferId, s.Offer?.Title ?? "", s.SlotDate, s.StartTime, s.EndTime,
        s.Capacity, s.BookedCount, s.AvailableCount, s.Status, s.CreatedAt);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var slots = await _db.OfferSlots.Include(s => s.Offer).ToListAsync();
        return Ok(slots.Select(ToDto));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSlotRequest req)
    {
        var offer = await _db.Offers.FindAsync(req.OfferId);
        if (offer == null) return BadRequest(new { message = "Offer not found" });

        var slot = new OfferSlot
        {
            OfferId = req.OfferId, SlotDate = req.SlotDate,
            StartTime = req.StartTime, EndTime = req.EndTime, Capacity = req.Capacity
        };
        _db.OfferSlots.Add(slot);
        await _db.SaveChangesAsync();
        await _db.Entry(slot).Reference(s => s.Offer).LoadAsync();
        return CreatedAtAction(nameof(GetAll), new { id = slot.Id }, ToDto(slot));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSlotRequest req)
    {
        var slot = await _db.OfferSlots.Include(s => s.Offer).FirstOrDefaultAsync(s => s.Id == id);
        if (slot == null) return NotFound();
        slot.SlotDate = req.SlotDate; slot.StartTime = req.StartTime;
        slot.EndTime = req.EndTime; slot.Capacity = req.Capacity; slot.Status = req.Status;
        await _db.SaveChangesAsync();
        return Ok(ToDto(slot));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var slot = await _db.OfferSlots.FindAsync(id);
        if (slot == null) return NotFound();
        _db.OfferSlots.Remove(slot);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
