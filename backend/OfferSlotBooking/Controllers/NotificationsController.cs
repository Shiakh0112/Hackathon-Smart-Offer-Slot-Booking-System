using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Data;
using OfferSlotBooking.DTOs;

namespace OfferSlotBooking.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public NotificationsController(AppDbContext db) => _db = db;

    // GET /api/notifications — admin only
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs = await _db.NotificationLogs
            .OrderByDescending(n => n.SentAt)
            .Take(50)
            .Select(n => new NotificationLogDto(
                n.Id, n.Type, n.Recipient, n.Message, n.Status, n.SentAt))
            .ToListAsync();
        return Ok(logs);
    }
}
