using Microsoft.EntityFrameworkCore;
using OfferSlotBooking.Models;

namespace OfferSlotBooking.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<OfferSlot> OfferSlots => Set<OfferSlot>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Offer>()
            .Property(o => o.OriginalPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Offer>()
            .Property(o => o.OfferPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Offer>()
            .Property(o => o.DiscountPercentage).HasColumnType("decimal(5,2)");

        modelBuilder.Entity<OfferSlot>()
            .Ignore(s => s.AvailableCount);
    }
}
