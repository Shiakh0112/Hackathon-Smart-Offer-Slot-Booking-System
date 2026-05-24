namespace OfferSlotBooking.DTOs;

public record LoginRequest(string Email, string Password);
public record LoginResponse(string Token, string Name, string Email, string Role);

public record BusinessDto(
    int Id, string Name, string BusinessType, string OwnerName,
    string Phone, string Email, string Address, string City,
    string? LogoUrl, string OpeningTime, string ClosingTime, DateTime CreatedAt);

public record CreateBusinessRequest(
    string Name, string BusinessType, string OwnerName,
    string Phone, string Email, string Address, string City,
    string? LogoUrl, string OpeningTime, string ClosingTime);

public record OfferDto(
    int Id, int BusinessId, string BusinessName, string BusinessType,
    string Title, string Description, string Category,
    decimal OriginalPrice, decimal OfferPrice, decimal DiscountPercentage,
    DateTime StartDate, DateTime EndDate, string StartTime, string EndTime,
    int TotalCapacity, int MaxBookingPerCustomer,
    string? TermsAndConditions, string Status,
    DateTime CreatedAt, DateTime UpdatedAt,
    int AvailableSlots, string? BusinessCity, string? BusinessAddress);

public record CreateOfferRequest(
    int BusinessId, string Title, string Description, string Category,
    decimal OriginalPrice, decimal OfferPrice,
    DateTime StartDate, DateTime EndDate, string StartTime, string EndTime,
    int TotalCapacity, int MaxBookingPerCustomer,
    string? TermsAndConditions, string Status);

public record SlotDto(
    int Id, int OfferId, string OfferTitle,
    DateTime SlotDate, string StartTime, string EndTime,
    int Capacity, int BookedCount, int AvailableCount, string Status, DateTime CreatedAt);

public record CreateSlotRequest(
    int OfferId, DateTime SlotDate, string StartTime, string EndTime, int Capacity);

public record UpdateSlotRequest(
    DateTime SlotDate, string StartTime, string EndTime, int Capacity, string Status);

public record BookingDto(
    int Id, string BookingReference, int OfferId, string OfferTitle,
    string BusinessName, int SlotId, string SlotDate, string StartTime, string EndTime,
    string CustomerName, string CustomerPhone, string? CustomerEmail,
    int PeopleCount, string? SpecialNote, string Status, DateTime CreatedAt);

public record CreateBookingRequest(
    int OfferId, int SlotId, string CustomerName, string CustomerPhone,
    string? CustomerEmail, int PeopleCount, string? SpecialNote);

public record UpdateBookingStatusRequest(string Status);

public record DashboardSummary(
    int TotalOffers, int ActiveOffers, int TotalBookings, int TodaysBookings,
    int TotalCapacity, int BookedSeats, int AvailableSeats, double ConversionRate,
    IEnumerable<BookingDto> RecentBookings,
    IEnumerable<DailyBookingStat> Last7DaysStats);

public record DailyBookingStat(string Date, int Count);

public record BookingSearchRequest(string Reference);

public record NotificationLogDto(
    int Id, string Type, string Recipient, string Message,
    string Status, DateTime SentAt);

public record SlotAvailabilityDto(
    int SlotId, int OfferId, int Capacity, int BookedCount,
    int AvailableCount, string Status);
