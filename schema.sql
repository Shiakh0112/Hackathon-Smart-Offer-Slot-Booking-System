-- Smart Offer Slot Booking System - Database Schema
-- Compatible with PostgreSQL and SQL Server

-- Users Table
CREATE TABLE "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(200) NOT NULL UNIQUE,
    "PasswordHash" TEXT NOT NULL,
    "Role" VARCHAR(50) NOT NULL DEFAULT 'Admin',
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Businesses Table
CREATE TABLE "Businesses" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(200) NOT NULL,
    "BusinessType" VARCHAR(100) NOT NULL,
    "OwnerName" VARCHAR(100) NOT NULL,
    "Phone" VARCHAR(20) NOT NULL,
    "Email" VARCHAR(200) NOT NULL,
    "Address" TEXT NOT NULL,
    "City" VARCHAR(100) NOT NULL,
    "LogoUrl" TEXT,
    "OpeningTime" VARCHAR(10) NOT NULL,
    "ClosingTime" VARCHAR(10) NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Offers Table
CREATE TABLE "Offers" (
    "Id" SERIAL PRIMARY KEY,
    "BusinessId" INT NOT NULL REFERENCES "Businesses"("Id") ON DELETE CASCADE,
    "Title" VARCHAR(200) NOT NULL,
    "Description" TEXT NOT NULL,
    "Category" VARCHAR(100) NOT NULL,
    "OriginalPrice" DECIMAL(18,2) NOT NULL,
    "OfferPrice" DECIMAL(18,2) NOT NULL,
    "DiscountPercentage" DECIMAL(5,2) NOT NULL,
    "StartDate" TIMESTAMP NOT NULL,
    "EndDate" TIMESTAMP NOT NULL,
    "StartTime" VARCHAR(10) NOT NULL,
    "EndTime" VARCHAR(10) NOT NULL,
    "TotalCapacity" INT NOT NULL,
    "MaxBookingPerCustomer" INT NOT NULL DEFAULT 1,
    "TermsAndConditions" TEXT,
    "Status" VARCHAR(50) NOT NULL DEFAULT 'Draft',
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- OfferSlots Table
CREATE TABLE "OfferSlots" (
    "Id" SERIAL PRIMARY KEY,
    "OfferId" INT NOT NULL REFERENCES "Offers"("Id") ON DELETE CASCADE,
    "SlotDate" TIMESTAMP NOT NULL,
    "StartTime" VARCHAR(10) NOT NULL,
    "EndTime" VARCHAR(10) NOT NULL,
    "Capacity" INT NOT NULL,
    "BookedCount" INT NOT NULL DEFAULT 0,
    "Status" VARCHAR(50) NOT NULL DEFAULT 'Available',
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE "Bookings" (
    "Id" SERIAL PRIMARY KEY,
    "BookingReference" VARCHAR(50) NOT NULL UNIQUE,
    "OfferId" INT NOT NULL REFERENCES "Offers"("Id"),
    "SlotId" INT NOT NULL REFERENCES "OfferSlots"("Id"),
    "CustomerName" VARCHAR(100) NOT NULL,
    "CustomerPhone" VARCHAR(20) NOT NULL,
    "CustomerEmail" VARCHAR(200),
    "PeopleCount" INT NOT NULL DEFAULT 1,
    "SpecialNote" TEXT,
    "Status" VARCHAR(50) NOT NULL DEFAULT 'Pending',
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_offers_status ON "Offers"("Status");
CREATE INDEX idx_offers_business ON "Offers"("BusinessId");
CREATE INDEX idx_slots_offer ON "OfferSlots"("OfferId");
CREATE INDEX idx_bookings_offer ON "Bookings"("OfferId");
CREATE INDEX idx_bookings_phone ON "Bookings"("CustomerPhone");
CREATE INDEX idx_bookings_reference ON "Bookings"("BookingReference");

-- Default Admin User (password: Admin@123)
INSERT INTO "Users" ("Name", "Email", "PasswordHash", "Role")
VALUES ('Admin', 'admin@offers.com', '$2a$11$defaulthashwillbegeneratedbyapp', 'Admin');
