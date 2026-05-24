namespace OfferSlotBooking.Models;

public class OfferSlot
{
    public int Id { get; set; }
    public int OfferId { get; set; }
    public Offer Offer { get; set; } = null!;
    public DateTime SlotDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int BookedCount { get; set; } = 0;
    public int AvailableCount => Capacity - BookedCount;
    public string Status { get; set; } = "Available";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
