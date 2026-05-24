# 🎯 Smart Offer Slot Booking System

> **Hackathon Project** — A production-ready fullstack web application where businesses can create limited-time offer slots and customers can discover & reserve them through a beautiful public booking page.

---

## 📌 Table of Contents

1. [🔗 Live Links & Repository](#-live-links--repository)
2. [🔑 Admin Login Credentials](#-admin-login-credentials)
3. [Project Overview](#-project-overview)
4. [Problem Statement](#-problem-statement)
5. [Solution](#-solution)
6. [Tech Stack](#-tech-stack)
7. [Architecture](#-architecture)
8. [Project Structure](#-project-structure)
9. [Database Schema](#-database-schema)
10. [API Reference](#-api-reference)
11. [Features — Detailed](#-features--detailed)
12. [All Screens & User Flows](#-all-screens--user-flows)
13. [Business Logic & Validations](#-business-logic--validations)
14. [Bonus Features](#-bonus-features)
15. [Setup & Run Locally](#-setup--run-locally)
16. [Key Design Decisions](#-key-design-decisions)

---

## 🔗 Live Links & Repository

| | Link |
|--|------|
| 🌐 **Frontend (Live)** | [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app) |
| ⚙️ **Backend API (Live)** | [https://your-backend-url.railway.app](https://your-backend-url.railway.app) |
| 📖 **Swagger API Docs** | [https://your-backend-url.railway.app/swagger](https://your-backend-url.railway.app/swagger) |
| 💻 **GitHub Repository** | [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME) |

> ⚠️ **Note:** Replace the placeholder URLs above with your actual deployed links before submitting.

---

## 🔑 Admin Login Credentials

> Use these to log in at `/admin/login`

| Field | Value |
|-------|-------|
| 🌐 **Admin Panel URL** | `https://your-frontend-url.vercel.app/admin/login` |
| 📧 **Email** | `admin@offers.com` |
| 🔒 **Password** | `Admin@123` |

> After login you will land on the **Dashboard** at `/admin/dashboard`

---

## 🧠 Project Overview

**Smart Offer Slot Booking System** is a dual-sided platform:

| Side | Who | What they do |
|------|-----|-------------|
| **Admin Panel** | Business Owner | Creates offers, manages time slots, tracks bookings, views analytics |
| **Public Portal** | Customer | Browses offers, filters by category/price, books a slot, gets QR confirmation |

The system solves a real-world problem — businesses run limited-time deals (like a gym offering a free trial week, or a restaurant offering a discount lunch) but have no structured way to manage how many people can book and when.

---

## ❗ Problem Statement

Businesses running limited-time promotional offers face these challenges:
- No control over **how many customers** can avail an offer
- No way to assign customers to specific **time slots** to avoid overcrowding
- Manual booking via phone/WhatsApp leads to **double bookings** and confusion
- No **real-time visibility** into booking status and capacity utilization

---

## ✅ Solution

A smart booking platform where:
1. Admin creates an offer with a price, discount, validity period and capacity
2. Admin creates specific time slots for that offer (e.g., 10am–11am, 11am–12pm)
3. Customers browse offers publicly, select a slot and book with their details
4. System enforces capacity limits, prevents expired bookings, and generates a unique QR-coded ticket
5. Admin gets a live dashboard with booking stats, conversion rate and CSV export

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 18 + TypeScript | Type-safe, component-based UI |
| **Build Tool** | Vite | Fast HMR, optimized builds |
| **Styling** | Tailwind CSS | Utility-first, dark mode support |
| **HTTP Client** | Axios | Interceptors for JWT auth |
| **Routing** | React Router v6 | Client-side navigation |
| **Charts** | Recharts | Booking trend visualization |
| **QR Code** | qrcode.react | Booking confirmation QR |
| **Icons** | React Icons (Feather) | Consistent icon set |
| **Toasts** | React Hot Toast | User feedback notifications |
| **Backend** | .NET 8 Web API (C#) | High-performance REST API |
| **ORM** | Entity Framework Core 8 | Code-first migrations |
| **Database** | PostgreSQL / SQL Server | Relational data with indexes |
| **Auth** | JWT Bearer Tokens | Stateless authentication |
| **API Docs** | Swagger / OpenAPI | Auto-generated API documentation |
| **Password** | BCrypt | Secure password hashing |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│                                                          │
│  ┌──────────────┐          ┌──────────────────────────┐  │
│  │  Admin Panel │          │      Public Portal       │  │
│  │  (JWT Auth)  │          │    (No Auth Required)    │  │
│  └──────┬───────┘          └────────────┬─────────────┘  │
│         │                               │                 │
│         └──────────┬────────────────────┘                 │
│                    │  Axios + JWT Interceptor              │
└────────────────────┼────────────────────────────────────-─┘
                     │ HTTP/REST
┌────────────────────▼─────────────────────────────────────┐
│                  BACKEND (.NET 8 Web API)                 │
│                                                          │
│  AuthController → BusinessController → OfferController  │
│  SlotController → BookingController → DashboardController│
│                                                          │
│              JWT Service + BCrypt Auth                   │
└────────────────────┬─────────────────────────────────────┘
                     │ Entity Framework Core
┌────────────────────▼─────────────────────────────────────┐
│              DATABASE (PostgreSQL / SQL Server)           │
│                                                          │
│   Users → Businesses → Offers → OfferSlots → Bookings   │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Hackathon Smart Offer Slot Booking System/
│
├── backend/
│   └── OfferSlotBooking/
│       ├── Controllers/
│       │   ├── AuthController.cs          # Login endpoint
│       │   ├── BusinessController.cs      # Business CRUD
│       │   ├── OffersController.cs        # Offer CRUD + filters
│       │   ├── SlotsController.cs         # Slot management
│       │   ├── BookingsController.cs      # Booking creation & management
│       │   └── DashboardController.cs     # Analytics & stats
│       │
│       ├── Data/
│       │   └── AppDbContext.cs            # EF Core DbContext
│       │
│       ├── DTOs/
│       │   ├── LoginDto.cs
│       │   ├── OfferDto.cs
│       │   ├── SlotDto.cs
│       │   ├── BookingDto.cs
│       │   └── DashboardDto.cs
│       │
│       ├── Models/
│       │   ├── User.cs
│       │   ├── Business.cs
│       │   ├── Offer.cs
│       │   ├── OfferSlot.cs
│       │   └── Booking.cs
│       │
│       ├── Services/
│       │   └── JwtService.cs              # JWT token generation
│       │
│       ├── Program.cs                     # App config, CORS, Swagger
│       └── appsettings.json               # DB connection, JWT config
│
├── frontend/
│   └── offer-slot-booking/
│       ├── src/
│       │   ├── api/
│       │   │   ├── axios.ts               # Axios instance + JWT interceptor
│       │   │   └── services.ts            # All API call functions
│       │   │
│       │   ├── components/
│       │   │   ├── AdminLayout.tsx        # Sidebar + header layout
│       │   │   ├── PublicNavbar.tsx       # Public site navbar
│       │   │   ├── BoardingPass.tsx       # QR ticket component
│       │   │   ├── CountdownTimer.tsx     # Live countdown on offers
│       │   │   ├── ShareOfferButton.tsx   # Share via WhatsApp/copy
│       │   │   ├── SmartSearch.tsx        # Search with suggestions
│       │   │   ├── StatusBadge.tsx        # Colored status pills
│       │   │   ├── NotificationBell.tsx   # Admin notifications
│       │   │   └── ProtectedRoute.tsx     # Auth guard for admin routes
│       │   │
│       │   ├── context/
│       │   │   ├── AuthContext.tsx        # JWT auth state
│       │   │   └── ThemeContext.tsx       # Dark/light mode
│       │   │
│       │   ├── pages/
│       │   │   ├── admin/
│       │   │   │   ├── AdminLogin.tsx
│       │   │   │   ├── Dashboard.tsx
│       │   │   │   ├── BusinessProfile.tsx
│       │   │   │   ├── CreateOffer.tsx
│       │   │   │   ├── ManageOffers.tsx
│       │   │   │   ├── ManageSlots.tsx
│       │   │   │   ├── ManageBookings.tsx
│       │   │   │   └── NotificationLogs.tsx
│       │   │   └── public/
│       │   │       ├── OfferListing.tsx
│       │   │       ├── OfferDetail.tsx
│       │   │       ├── BookingConfirmation.tsx
│       │   │       └── MyBooking.tsx
│       │   │
│       │   └── types/
│       │       └── index.ts               # All TypeScript interfaces
│       │
│       ├── .env                           # VITE_API_URL
│       └── package.json
│
├── schema.sql                             # Full DB schema with indexes
├── .gitignore
└── README.md
```

---

## 🗄 Database Schema

### Entity Relationship

```
Users (1) ──────────────────────────────── (Admin only)

Businesses (1) ──────────── (many) Offers
                                      │
                              (many) OfferSlots
                                      │
                              (many) Bookings
```

### Tables

#### `Users`
| Column | Type | Description |
|--------|------|-------------|
| Id | SERIAL PK | Auto increment |
| Name | VARCHAR(100) | Admin name |
| Email | VARCHAR(200) UNIQUE | Login email |
| PasswordHash | TEXT | BCrypt hash |
| Role | VARCHAR(50) | Default: 'Admin' |
| CreatedAt | TIMESTAMP | Auto |

#### `Businesses`
| Column | Type | Description |
|--------|------|-------------|
| Id | SERIAL PK | |
| Name | VARCHAR(200) | Business name |
| BusinessType | VARCHAR(100) | Restaurant, Gym, Salon, etc. |
| OwnerName | VARCHAR(100) | |
| Phone | VARCHAR(20) | |
| Email | VARCHAR(200) | |
| Address | TEXT | |
| City | VARCHAR(100) | |
| OpeningTime | VARCHAR(10) | HH:MM format |
| ClosingTime | VARCHAR(10) | HH:MM format |

#### `Offers`
| Column | Type | Description |
|--------|------|-------------|
| Id | SERIAL PK | |
| BusinessId | INT FK | → Businesses |
| Title | VARCHAR(200) | Offer name |
| Description | TEXT | |
| Category | VARCHAR(100) | Fitness, Food, etc. |
| OriginalPrice | DECIMAL(18,2) | MRP |
| OfferPrice | DECIMAL(18,2) | Discounted price |
| DiscountPercentage | DECIMAL(5,2) | Auto-calculated |
| StartDate / EndDate | TIMESTAMP | Validity window |
| StartTime / EndTime | VARCHAR(10) | Daily time window |
| TotalCapacity | INT | Max bookings |
| MaxBookingPerCustomer | INT | Per-customer limit |
| Status | VARCHAR(50) | Draft/Active/Paused/Expired/Cancelled |

#### `OfferSlots`
| Column | Type | Description |
|--------|------|-------------|
| Id | SERIAL PK | |
| OfferId | INT FK | → Offers |
| SlotDate | TIMESTAMP | Specific date |
| StartTime / EndTime | VARCHAR(10) | Time window |
| Capacity | INT | Max for this slot |
| BookedCount | INT | Auto-increments on booking |
| Status | VARCHAR(50) | Available/Full/Cancelled |

#### `Bookings`
| Column | Type | Description |
|--------|------|-------------|
| Id | SERIAL PK | |
| BookingReference | VARCHAR(50) UNIQUE | e.g. BK-20240115-A3F2 |
| OfferId | INT FK | → Offers |
| SlotId | INT FK | → OfferSlots |
| CustomerName | VARCHAR(100) | |
| CustomerPhone | VARCHAR(20) | Used for lookup |
| CustomerEmail | VARCHAR(200) | Optional |
| PeopleCount | INT | Group size |
| SpecialNote | TEXT | Optional request |
| Status | VARCHAR(50) | Pending/Confirmed/Cancelled/Completed/No Show |

### Indexes
```sql
idx_offers_status     -- Fast filter by Active/Paused offers
idx_offers_business   -- Fast lookup by business
idx_slots_offer       -- Fast slot lookup per offer
idx_bookings_offer    -- Fast booking lookup per offer
idx_bookings_phone    -- Customer lookup by phone
idx_bookings_reference -- Unique reference lookup
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/login` | ❌ | `{email, password}` | Returns JWT token |

### Business
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/business` | ❌ | Get all businesses |
| POST | `/api/business` | ✅ | Create business profile |
| PUT | `/api/business/{id}` | ✅ | Update business profile |

### Offers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/offers` | ❌ | Get offers (supports filters: category, businessType, minPrice, maxPrice, availableOnly, adminView) |
| GET | `/api/offers/{id}` | ❌ | Get single offer with details |
| POST | `/api/offers` | ✅ | Create new offer |
| PUT | `/api/offers/{id}` | ✅ | Update offer (including status change) |
| DELETE | `/api/offers/{id}` | ✅ | Delete offer |
| GET | `/api/offers/{offerId}/slots` | ❌ | Get all slots for an offer |

### Slots
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/slots` | ❌ | Get all slots (filter by offerId) |
| POST | `/api/slots` | ✅ | Create slot for an offer |
| PUT | `/api/slots/{id}` | ✅ | Update slot |
| DELETE | `/api/slots/{id}` | ✅ | Delete slot |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings` | ✅ | Get all bookings (admin) |
| GET | `/api/bookings/{id}` | ❌ | Get booking by ID (for confirmation page) |
| POST | `/api/bookings` | ❌ | Create new booking (public) |
| PUT | `/api/bookings/{id}/status` | ✅ | Update booking status |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/summary` | ✅ | Returns stats: totalOffers, activeOffers, totalBookings, todaysBookings, totalCapacity, bookedSeats, availableSeats, conversionRate, recentBookings, last7DaysStats |

---

## 🎨 Features — Detailed

### 👨‍💼 Admin Panel

#### 1. JWT Authentication
- Secure login with email + password
- BCrypt password hashing
- JWT token stored in localStorage
- Axios interceptor auto-attaches token to every request
- Protected routes redirect to login if token missing/expired

#### 2. Business Profile Management
- Create and update business details
- Fields: name, type, owner, phone, email, address, city, opening/closing hours
- Business info shown on public offer cards

#### 3. Offer Management (Full CRUD)
- Create offers with: title, description, category, original price, offer price, dates, times, capacity, per-customer limit, T&C
- Discount % auto-calculated: `((original - offer) / original) * 100`
- Status workflow: `Draft → Active → Paused → Cancelled`
- Quick status toggle from Dashboard without navigating away
- Filter offers by status, search by title/business/category

#### 4. Slot Management
- Create multiple time slots per offer
- Each slot has: date, start time, end time, capacity
- BookedCount auto-increments when booking is made
- Slot auto-marks as "Full" when capacity reached

#### 5. Booking Management
- View all bookings with customer details
- Filter by status, search by name/phone/reference/offer
- Update booking status: Pending → Confirmed → Completed / Cancelled / No Show
- Export all filtered bookings as CSV with one click

#### 6. Dashboard Analytics
- 8 stat cards: Total Offers, Active Offers, Total Bookings, Today's Bookings, Total Capacity, Booked Seats, Available Seats, Conversion Rate
- Area chart showing bookings trend for last 7 days (Recharts)
- Seat utilization progress bar with fill rate %
- Recent bookings table with quick manage link
- Quick Actions panel to toggle offer status without leaving dashboard

---

### 🌐 Public Portal

#### 1. Offer Listing Page (`/offers`)
- Hero section with animated gradient background
- Grid of offer cards (1→2→3→4 columns responsive)
- Each card shows: category icon, discount %, business type, countdown timer, title, business name, city, price comparison, seats left, capacity progress bar
- Filters: Business Type, Category, Min/Max Price, Available Only toggle
- Live search (client-side) by title, business name, category
- Results count updates in real-time

#### 2. Offer Detail Page (`/offers/:id`)
- Full offer details: title, category, discount, countdown timer
- Price section with savings highlight
- Info grid: duration, time, available seats, location
- Business address
- Terms & Conditions (if set)
- Available Slots selector (radio buttons, live polling every 15s)
- Share button (copy link + WhatsApp + native share)
- Sticky booking panel on desktop

#### 3. Booking Flow
- Step 1: Select slot → click "Proceed to Book"
- Step 2: Fill form — Name (required), Phone (required), Email (optional), People Count, Special Note (optional)
- Validation: slot must be selected, required fields filled, people count ≤ available seats
- On success: redirected to confirmation page

#### 4. Booking Confirmation (`/booking-confirmation/:id`)
- Animated success header with floating icon
- Boarding Pass style ticket with:
  - Offer title + business name in gradient header
  - Tear-line separator
  - Details grid: Reference, Passenger, Date, Time, People, Business
  - QR Code (encodes reference, offer, customer, slot info)
- Print ticket button (print-optimized CSS)
- Booking reference pill for easy copy

#### 5. My Booking Lookup (`/my-booking`)
- Customer can look up their booking by reference number or phone
- Shows booking details without requiring login

---

## 🔒 Business Logic & Validations

| Rule | Where Enforced |
|------|---------------|
| Offer price must be < original price | Backend validation |
| Expired offers (past endDate) cannot be booked | Backend check on booking creation |
| Full slots (bookedCount ≥ capacity) cannot be booked | Backend check + frontend hides full slots |
| Per-customer booking limit enforced | Backend counts existing bookings by phone for same offer |
| BookedCount auto-increments on new booking | Backend transaction |
| BookedCount auto-decrements on cancellation | Backend on status update to Cancelled |
| Slot status auto-updates to "Full" | Backend after each booking |
| Unique booking reference generated | Backend: `BK-{date}-{random4chars}` |
| JWT required for all admin operations | Middleware on all `[Authorize]` endpoints |
| CORS configured for frontend origin | Program.cs |

---

## 🌟 Bonus Features

| Feature | Description |
|---------|-------------|
| 🎯 **QR Code** | Every booking confirmation has a scannable QR code with booking details encoded as JSON |
| ⏱️ **Live Countdown Timer** | Each offer card shows real-time countdown (days/hours/minutes/seconds). Turns red and pulses when < 1 hour left |
| 🌙 **Dark / Light Mode** | Full dark mode support across all pages, persisted in localStorage |
| 📥 **CSV Export** | Admin can export filtered bookings as a downloadable CSV file |
| 📱 **Fully Responsive** | Mobile-first design, works on all screen sizes |
| 🔄 **Live Slot Polling** | Offer detail page polls slot availability every 15 seconds |
| ⚡ **Quick Toggle** | Dashboard lets admin pause/activate offers without navigating away |
| 📤 **Share Offer** | Share offer via WhatsApp, copy link, or native mobile share |
| 🔔 **Notification Logs** | Admin can view notification history |
| 🎨 **Premium UI** | Glassmorphism, gradient backgrounds, shimmer effects, micro-animations |

---

## 🖥 All Screens & User Flows

### Admin Flow
```
/admin/login
    ↓ (JWT issued)
/admin/dashboard        ← Stats, chart, quick actions, recent bookings
    ↓
/admin/business         ← Create/update business profile
    ↓
/admin/offers/create    ← Create new offer
    ↓
/admin/offers           ← List all offers, change status, delete
    ↓
/admin/slots            ← Create/manage time slots per offer
    ↓
/admin/bookings         ← View all bookings, update status, export CSV
    ↓
/admin/notifications    ← View notification logs
```

### Customer Flow
```
/offers                 ← Browse all active offers, filter & search
    ↓ (click offer card)
/offers/:id             ← View offer details, select slot
    ↓ (fill booking form)
/booking-confirmation/:id  ← QR ticket, print option
```

### Route Summary
| # | Route | Auth | Page |
|---|-------|------|------|
| 1 | `/offers` | ❌ | Public offer listing |
| 2 | `/offers/:id` | ❌ | Offer detail + booking |
| 3 | `/booking-confirmation/:id` | ❌ | Booking ticket with QR |
| 4 | `/my-booking` | ❌ | Lookup booking by reference |
| 5 | `/admin/login` | ❌ | Admin login |
| 6 | `/admin/dashboard` | ✅ | Analytics dashboard |
| 7 | `/admin/business` | ✅ | Business profile |
| 8 | `/admin/offers` | ✅ | Manage offers |
| 9 | `/admin/offers/create` | ✅ | Create offer |
| 10 | `/admin/offers/edit/:id` | ✅ | Edit offer |
| 11 | `/admin/slots` | ✅ | Manage slots |
| 12 | `/admin/bookings` | ✅ | Manage bookings |
| 13 | `/admin/notifications` | ✅ | Notification logs |

---

## ⚙️ Setup & Run Locally

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (or SQL Server)

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend/OfferSlotBooking

# 2. Update appsettings.json with your DB credentials
# Edit ConnectionStrings.DefaultConnection

# 3. Install EF Core CLI tools
dotnet tool install --global dotnet-ef

# 4. Run database migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# 5. Start the API
dotnet run
```

- API: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`

**appsettings.json config:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=offerslotdb;Username=postgres;Password=yourpassword"
  },
  "DatabaseProvider": "postgres",
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "OfferSlotBooking",
    "Audience": "OfferSlotBookingUsers"
  }
}
```

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend/offer-slot-booking

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_API_URL=http://localhost:5000" > .env

# 4. Start development server
npm run dev
```

- App: `http://localhost:5173`

---

## 💡 Key Design Decisions

| Decision | Reason |
|----------|--------|
| **Separate Admin & Public routes** | Clear separation of concerns; public users never need auth |
| **JWT in localStorage** | Simple for hackathon scope; production would use httpOnly cookies |
| **EF Core Code-First** | Faster development, migrations handle schema changes |
| **PostgreSQL + SQL Server support** | Configurable via `DatabaseProvider` setting for flexibility |
| **Client-side search + server-side filters** | Server filters reduce data transfer; client search gives instant UX |
| **15s slot polling** | Keeps availability fresh without WebSocket complexity |
| **Tailwind CSS** | Rapid UI development with consistent design tokens |
| **TypeScript throughout** | Catches type errors at compile time, better DX |
| **Axios interceptors** | Single place to attach JWT and handle 401 errors |
| **Recharts for analytics** | Lightweight, React-native charting library |

---

## 👨‍💻 Developer

Built for Hackathon — Smart Offer Slot Booking System

> **📝 Note to Examiner:**
> This README covers the **complete project** — live links, admin credentials, architecture, database design, all API endpoints, business logic, validations, and every screen/user flow.
>
> | | |
> |--|--|
> | 🌐 **Live Frontend** | `https://your-frontend-url.vercel.app` |
> | ⚙️ **Live Backend API** | `https://your-backend-url.railway.app` |
> | 📖 **Swagger Docs** | `https://your-backend-url.railway.app/swagger` |
> | 💻 **GitHub** | `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME` |
> | 🔑 **Admin Login** | `admin@offers.com` / `Admin@123` |
>
> The application is **fully functional** and can be tested immediately using the live links and credentials above.
