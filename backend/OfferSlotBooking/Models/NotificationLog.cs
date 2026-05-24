namespace OfferSlotBooking.Models;

public class NotificationLog
{
    public int Id { get; set; }
    public string Type { get; set; } = "WhatsApp"; // WhatsApp | SMS | Email
    public string Recipient { get; set; } = "";
    public string Message { get; set; } = "";
    public string Status { get; set; } = "Sent"; // Sent | Failed
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
