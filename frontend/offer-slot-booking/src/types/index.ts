export interface User {
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface Business {
  id: number;
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  logoUrl?: string;
  openingTime: string;
  closingTime: string;
  createdAt: string;
}

export interface Offer {
  id: number;
  businessId: number;
  businessName: string;
  businessType: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalCapacity: number;
  maxBookingPerCustomer: number;
  termsAndConditions?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  availableSlots: number;
  businessCity?: string;
  businessAddress?: string;
}

export interface OfferSlot {
  id: number;
  offerId: number;
  offerTitle: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  availableCount: number;
  status: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  bookingReference: string;
  offerId: number;
  offerTitle: string;
  businessName: string;
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  specialNote?: string;
  status: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalOffers: number;
  activeOffers: number;
  totalBookings: number;
  todaysBookings: number;
  totalCapacity: number;
  bookedSeats: number;
  availableSeats: number;
  conversionRate: number;
  recentBookings: Booking[];
  last7DaysStats: DailyBookingStat[];
}

export interface DailyBookingStat {
  date: string;
  count: number;
}

export interface NotificationLog {
  id: number;
  type: string;
  recipient: string;
  message: string;
  status: string;
  sentAt: string;
}
