using OfferSlotBooking.Models;

namespace OfferSlotBooking.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        // Admin user
        if (!db.Users.Any())
        {
            db.Users.Add(new User
            {
                Name = "Admin",
                Email = "admin@offers.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin"
            });
            db.SaveChanges();
        }

        // Demo businesses
        if (!db.Businesses.Any())
        {
            db.Businesses.AddRange(
                new Business
                {
                    Name = "FitZone Gym",
                    BusinessType = "Gym",
                    OwnerName = "Rahul Sharma",
                    Phone = "9876543210",
                    Email = "fitzone@gym.com",
                    Address = "123 MG Road",
                    City = "Mumbai",
                    OpeningTime = "06:00",
                    ClosingTime = "22:00"
                },
                new Business
                {
                    Name = "Spice Garden Restaurant",
                    BusinessType = "Restaurant",
                    OwnerName = "Priya Patel",
                    Phone = "9876543211",
                    Email = "spice@garden.com",
                    Address = "45 FC Road",
                    City = "Pune",
                    OpeningTime = "11:00",
                    ClosingTime = "23:00"
                },
                new Business
                {
                    Name = "Glow Salon",
                    BusinessType = "Salon",
                    OwnerName = "Neha Singh",
                    Phone = "9876543212",
                    Email = "glow@salon.com",
                    Address = "78 Linking Road",
                    City = "Mumbai",
                    OpeningTime = "09:00",
                    ClosingTime = "20:00"
                },
                new Business
                {
                    Name = "Green Turf Sports",
                    BusinessType = "Turf",
                    OwnerName = "Amit Kumar",
                    Phone = "9876543213",
                    Email = "green@turf.com",
                    Address = "12 Sports Complex",
                    City = "Delhi",
                    OpeningTime = "05:00",
                    ClosingTime = "23:00"
                }
            );
            db.SaveChanges();
        }

        // Demo offers
        if (!db.Offers.Any())
        {
            var gym = db.Businesses.First(b => b.BusinessType == "Gym");
            var restaurant = db.Businesses.First(b => b.BusinessType == "Restaurant");
            var salon = db.Businesses.First(b => b.BusinessType == "Salon");
            var turf = db.Businesses.First(b => b.BusinessType == "Turf");

            var now = DateTime.UtcNow;

            db.Offers.AddRange(
                new Offer
                {
                    BusinessId = gym.Id,
                    Title = "Gym Trial Slot - Morning Batch",
                    Description = "Try our fully equipped gym for free! Experience world-class equipment, expert trainers, and a motivating environment. Perfect for beginners and fitness enthusiasts.",
                    Category = "Fitness",
                    OriginalPrice = 499,
                    OfferPrice = 99,
                    DiscountPercentage = 80,
                    StartDate = now,
                    EndDate = now.AddDays(30),
                    StartTime = "06:00",
                    EndTime = "08:00",
                    TotalCapacity = 20,
                    MaxBookingPerCustomer = 1,
                    TermsAndConditions = "Valid for first-time visitors only. Carry a valid ID. Booking is non-transferable.",
                    Status = "Active"
                },
                new Offer
                {
                    BusinessId = gym.Id,
                    Title = "Evening Fitness Session",
                    Description = "Join our power-packed evening fitness session with certified trainers. Includes cardio, strength training, and cool-down yoga.",
                    Category = "Fitness",
                    OriginalPrice = 699,
                    OfferPrice = 149,
                    DiscountPercentage = 79,
                    StartDate = now,
                    EndDate = now.AddDays(15),
                    StartTime = "17:00",
                    EndTime = "19:00",
                    TotalCapacity = 15,
                    MaxBookingPerCustomer = 2,
                    TermsAndConditions = "Wear comfortable workout clothes. Bring your own water bottle.",
                    Status = "Active"
                },
                new Offer
                {
                    BusinessId = restaurant.Id,
                    Title = "Lunch Hour Special Thali",
                    Description = "Enjoy our chef's special unlimited thali with 12 items including starters, main course, dessert, and beverages. A royal dining experience at an unbeatable price!",
                    Category = "Food & Dining",
                    OriginalPrice = 599,
                    OfferPrice = 199,
                    DiscountPercentage = 67,
                    StartDate = now,
                    EndDate = now.AddDays(7),
                    StartTime = "12:00",
                    EndTime = "15:00",
                    TotalCapacity = 30,
                    MaxBookingPerCustomer = 4,
                    TermsAndConditions = "Valid for dine-in only. Prior booking mandatory. No outside food allowed.",
                    Status = "Active"
                },
                new Offer
                {
                    BusinessId = salon.Id,
                    Title = "Salon Happy Hour - Hair + Facial",
                    Description = "Get a premium haircut, hair spa, and facial done by our expert stylists at a massive discount. Walk out looking your best!",
                    Category = "Beauty & Wellness",
                    OriginalPrice = 1499,
                    OfferPrice = 499,
                    DiscountPercentage = 67,
                    StartDate = now,
                    EndDate = now.AddDays(20),
                    StartTime = "10:00",
                    EndTime = "13:00",
                    TotalCapacity = 10,
                    MaxBookingPerCustomer = 1,
                    TermsAndConditions = "Appointment must be booked 24 hours in advance. Cancellation not allowed after confirmation.",
                    Status = "Active"
                },
                new Offer
                {
                    BusinessId = turf.Id,
                    Title = "Morning Turf Slot - Football",
                    Description = "Book our premium FIFA-standard turf for your football match. Includes changing rooms, floodlights, and referee on request.",
                    Category = "Sports",
                    OriginalPrice = 2000,
                    OfferPrice = 799,
                    DiscountPercentage = 60,
                    StartDate = now,
                    EndDate = now.AddDays(10),
                    StartTime = "06:00",
                    EndTime = "08:00",
                    TotalCapacity = 22,
                    MaxBookingPerCustomer = 11,
                    TermsAndConditions = "Minimum 10 players required. Bring your own football. Studs allowed.",
                    Status = "Active"
                },
                new Offer
                {
                    BusinessId = restaurant.Id,
                    Title = "Weekend Dinner Buffet",
                    Description = "Unlimited dinner buffet with 25+ dishes, live counter, and dessert station. Perfect for family and friends.",
                    Category = "Food & Dining",
                    OriginalPrice = 899,
                    OfferPrice = 399,
                    DiscountPercentage = 56,
                    StartDate = now,
                    EndDate = now.AddDays(60),
                    StartTime = "19:00",
                    EndTime = "22:00",
                    TotalCapacity = 50,
                    MaxBookingPerCustomer = 6,
                    TermsAndConditions = "Valid on weekends only (Sat & Sun). Children below 5 years free.",
                    Status = "Active"
                }
            );
            db.SaveChanges();
        }

        // Demo slots
        if (!db.OfferSlots.Any())
        {
            var offers = db.Offers.ToList();
            var now = DateTime.UtcNow;

            foreach (var offer in offers)
            {
                // Create 3 slots per offer for next 3 days
                for (int i = 1; i <= 3; i++)
                {
                    db.OfferSlots.Add(new OfferSlot
                    {
                        OfferId = offer.Id,
                        SlotDate = now.AddDays(i),
                        StartTime = offer.StartTime,
                        EndTime = offer.EndTime,
                        Capacity = offer.TotalCapacity,
                        BookedCount = 0,
                        Status = "Available"
                    });
                }
            }
            db.SaveChanges();
        }

        // Demo bookings
        if (!db.Bookings.Any())
        {
            var slots = db.OfferSlots.OrderBy(s => s.Id).Take(6).ToList();
            var statuses = new[] { "Confirmed", "Confirmed", "Pending", "Completed", "Confirmed", "Cancelled" };
            var names = new[] { "Arjun Mehta", "Sneha Joshi", "Vikram Rao", "Pooja Nair", "Rohit Gupta", "Ananya Das" };
            var phones = new[] { "9811111111", "9822222222", "9833333333", "9844444444", "9855555555", "9866666666" };

            for (int i = 0; i < slots.Count; i++)
            {
                var booking = new Booking
                {
                    BookingReference = $"BK{DateTime.UtcNow:yyyyMMdd}{1001 + i}",
                    OfferId = slots[i].OfferId,
                    SlotId = slots[i].Id,
                    CustomerName = names[i],
                    CustomerPhone = phones[i],
                    CustomerEmail = $"customer{i + 1}@email.com",
                    PeopleCount = 1,
                    Status = statuses[i],
                    CreatedAt = DateTime.UtcNow.AddHours(-i * 2)
                };
                db.Bookings.Add(booking);
                if (statuses[i] != "Cancelled")
                {
                    slots[i].BookedCount += 1;
                }
            }
            db.SaveChanges();
        }
    }
}
