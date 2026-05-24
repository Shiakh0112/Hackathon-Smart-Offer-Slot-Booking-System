namespace OfferSlotBooking.Models;

public class Booking
{
    public int Id { get; set; }
    public string BookingReference { get; set; } = string.Empty;
    public int OfferId { get; set; }
    public Offer Offer { get; set; } = null!;
    public int SlotId { get; set; }
    public OfferSlot Slot { get; set; } = null!;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public int PeopleCount { get; set; } = 1;
    public string? SpecialNote { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
