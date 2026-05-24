using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Data;
using OfferSlotBooking.DTOs;
using OfferSlotBooking.Models;

namespace OfferSlotBooking.Controllers;

[ApiController]
[Route("api/business")]
public class BusinessController : ControllerBase
{
    private readonly AppDbContext _db;
    public BusinessController(AppDbContext db) => _db = db;

    private static BusinessDto ToDto(Business b) => new(
        b.Id, b.Name, b.BusinessType, b.OwnerName, b.Phone, b.Email,
        b.Address, b.City, b.LogoUrl, b.OpeningTime, b.ClosingTime, b.CreatedAt);

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Businesses.Select(b => ToDto(b)).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var b = await _db.Businesses.FindAsync(id);
        return b == null ? NotFound() : Ok(ToDto(b));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBusinessRequest req)
    {
        var b = new Business
        {
            Name = req.Name, BusinessType = req.BusinessType, OwnerName = req.OwnerName,
            Phone = req.Phone, Email = req.Email, Address = req.Address, City = req.City,
            LogoUrl = req.LogoUrl, OpeningTime = req.OpeningTime, ClosingTime = req.ClosingTime
        };
        _db.Businesses.Add(b);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = b.Id }, ToDto(b));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateBusinessRequest req)
    {
        var b = await _db.Businesses.FindAsync(id);
        if (b == null) return NotFound();
        b.Name = req.Name; b.BusinessType = req.BusinessType; b.OwnerName = req.OwnerName;
        b.Phone = req.Phone; b.Email = req.Email; b.Address = req.Address;
        b.City = req.City; b.LogoUrl = req.LogoUrl;
        b.OpeningTime = req.OpeningTime; b.ClosingTime = req.ClosingTime;
        await _db.SaveChangesAsync();
        return Ok(ToDto(b));
    }
}
