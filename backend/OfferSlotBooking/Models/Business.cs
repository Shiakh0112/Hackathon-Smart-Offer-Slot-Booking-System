namespace OfferSlotBooking.Models;

public class Business
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string BusinessType { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string OpeningTime { get; set; } = string.Empty;
    public string ClosingTime { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}
