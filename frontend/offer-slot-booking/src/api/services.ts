import api from "./axios";
import type { Business, Offer, OfferSlot, Booking, DashboardSummary } from "../types";

// Auth
export const login = (email: string, password: string) =>
  api.post("/api/auth/login", { email, password });

// Business
export const getBusiness = () => api.get<Business[]>("/api/business");
export const getBusinessById = (id: number) => api.get<Business>(`/api/business/${id}`);
export const createBusiness = (data: Partial<Business>) => api.post<Business>("/api/business", data);
export const updateBusiness = (id: number, data: Partial<Business>) =>
  api.put<Business>(`/api/business/${id}`, data);

// Offers
export const getOffers = (params?: Record<string, unknown>) =>
  api.get<Offer[]>("/api/offers", { params });
export const getOfferById = (id: number) => api.get<Offer>(`/api/offers/${id}`);
export const createOffer = (data: Partial<Offer>) => api.post<Offer>("/api/offers", data);
export const updateOffer = (id: number, data: Partial<Offer>) =>
  api.put<Offer>(`/api/offers/${id}`, data);
export const deleteOffer = (id: number) => api.delete(`/api/offers/${id}`);

// Slots
export const getSlots = () => api.get<OfferSlot[]>("/api/slots");
export const getSlotsByOffer = (offerId: number) =>
  api.get<OfferSlot[]>(`/api/offers/${offerId}/slots`);
export const createSlot = (data: Partial<OfferSlot>) => api.post<OfferSlot>("/api/slots", data);
export const updateSlot = (id: number, data: Partial<OfferSlot>) =>
  api.put<OfferSlot>(`/api/slots/${id}`, data);
export const deleteSlot = (id: number) => api.delete(`/api/slots/${id}`);

// Bookings
export const getBookings = () => api.get<Booking[]>("/api/bookings");
export const getBookingById = (id: number) => api.get<Booking>(`/api/bookings/${id}`);
export const createBooking = (data: Partial<Booking> & { slotId: number }) =>
  api.post<Booking>("/api/bookings", data);
export const updateBookingStatus = (id: number, status: string) =>
  api.put(`/api/bookings/${id}/status`, { status });

// Dashboard
export const getDashboardSummary = () =>
  api.get<DashboardSummary>("/api/dashboard/summary");

// Notifications
export const getNotifications = () =>
  api.get<import('../types').NotificationLog[]>("/api/notifications");

// Booking search by reference (public)
export const searchBookingByReference = (reference: string) =>
  api.get<import('../types').Booking>(`/api/bookings/search?reference=${encodeURIComponent(reference)}`);
