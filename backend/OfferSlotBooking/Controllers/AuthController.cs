using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Data;
using OfferSlotBooking.DTOs;
using OfferSlotBooking.Services;

namespace OfferSlotBooking.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;

    public AuthController(AppDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials" });

        var token = _jwt.GenerateToken(user);
        return Ok(new LoginResponse(token, user.Name, user.Email, user.Role));
    }
}
