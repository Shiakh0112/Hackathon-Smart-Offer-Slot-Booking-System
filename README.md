# 🎯 Smart Offer Slot Booking System

A fullstack web application where businesses can create limited-time offer slots and customers can reserve them through a public booking page.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend | .NET 8 Web API |
| Database | PostgreSQL / SQL Server |
| Auth | JWT Bearer Tokens |
| API Docs | Swagger / OpenAPI |

---

## Project Structure

```
├── backend/
│   └── OfferSlotBooking/
│       ├── Controllers/       # API Controllers
│       ├── Data/              # EF Core DbContext
│       ├── DTOs/              # Request/Response DTOs
│       ├── Models/            # Entity Models
│       ├── Services/          # JWT Service
│       ├── Program.cs
│       └── appsettings.json
├── frontend/
│   └── offer-slot-booking/
│       ├── src/
│       │   ├── api/           # Axios + API services
│       │   ├── components/    # Shared components
│       │   ├── context/       # Auth + Theme context
│       │   ├── pages/
│       │   │   ├── admin/     # Admin pages
│       │   │   └── public/    # Public pages
│       │   └── types/         # TypeScript types
│       └── package.json
└── schema.sql                 # Database schema reference
```

---

## Setup Instructions

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) or SQL Server

---

### Backend Setup

1. Navigate to backend:
   ```bash
   cd backend/OfferSlotBooking
   ```

2. Copy env example and configure:
   ```bash
   copy .env.example appsettings.Development.json
   ```

3. Update `appsettings.json` with your database connection:
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

4. Install EF Core tools and run migrations:
   ```bash
   dotnet tool install --global dotnet-ef
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. Run the backend:
   ```bash
   dotnet run
   ```
   API runs at: `http://localhost:5000`
   Swagger UI: `http://localhost:5000/swagger`

---

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend/offer-slot-booking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   copy .env.example .env
   ```
   `.env` content:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Run the frontend:
   ```bash
   npm run dev
   ```
   App runs at: `http://localhost:5173`

---

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@offers.com |
| Password | Admin@123 |

---

## Screens

| # | Screen | Route |
|---|--------|-------|
| 1 | Admin Login | `/admin/login` |
| 2 | Admin Dashboard | `/admin/dashboard` |
| 3 | Business Profile | `/admin/business` |
| 4 | Create/Edit Offer | `/admin/offers/create` |
| 5 | Manage Offers | `/admin/offers` |
| 6 | Manage Slots | `/admin/slots` |
| 7 | Manage Bookings | `/admin/bookings` |
| 8 | Public Offer Listing | `/offers` |
| 9 | Public Offer Detail | `/offers/:id` |
| 10 | Booking Confirmation | `/booking-confirmation/:id` |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login |
| GET | `/api/business` | ❌ | Get all businesses |
| POST | `/api/business` | ✅ | Create business |
| PUT | `/api/business/{id}` | ✅ | Update business |
| GET | `/api/offers` | ❌ | Get offers (with filters) |
| GET | `/api/offers/{id}` | ❌ | Get offer by ID |
| POST | `/api/offers` | ✅ | Create offer |
| PUT | `/api/offers/{id}` | ✅ | Update offer |
| DELETE | `/api/offers/{id}` | ✅ | Delete offer |
| GET | `/api/offers/{offerId}/slots` | ❌ | Get slots for offer |
| GET | `/api/slots` | ❌ | Get all slots |
| POST | `/api/slots` | ✅ | Create slot |
| PUT | `/api/slots/{id}` | ✅ | Update slot |
| DELETE | `/api/slots/{id}` | ✅ | Delete slot |
| GET | `/api/bookings` | ✅ | Get all bookings |
| GET | `/api/bookings/{id}` | ❌ | Get booking by ID |
| POST | `/api/bookings` | ❌ | Create booking |
| PUT | `/api/bookings/{id}/status` | ✅ | Update booking status |
| GET | `/api/dashboard/summary` | ✅ | Dashboard stats |

---

## Features

### Admin
- ✅ JWT Authentication
- ✅ Business profile management
- ✅ Full offer CRUD with status management
- ✅ Slot management per offer
- ✅ Booking management with status updates
- ✅ Dashboard with live stats & conversion rate
- ✅ Export bookings as CSV

### Public
- ✅ Browse active offers with filters
- ✅ Search by name, category, business type
- ✅ Price range filter
- ✅ Available-only filter
- ✅ Countdown timer on each offer
- ✅ Full offer detail page
- ✅ Slot selection & booking form
- ✅ Booking confirmation with QR code
- ✅ Dark / Light mode

### Business Logic
- ✅ Offer price must be less than original price
- ✅ Expired offers cannot be booked
- ✅ Full slots cannot be booked
- ✅ Per-customer booking limit enforced
- ✅ Booked count auto-updates on booking/cancellation
- ✅ Unique booking reference generation

---

## Bonus Features Implemented
- 🎯 QR Code on booking confirmation
- ⏱️ Live countdown timer on offer cards
- 🌙 Dark / Light mode toggle
- 📥 Export bookings as CSV
- 📱 Fully responsive mobile UI

---

## Database Schema

See `schema.sql` for the complete database schema with indexes.

---

## Screenshots

> Add screenshots of each screen here after running the app.

---

## Demo Video

> Add 2-3 minute demo video link here.
