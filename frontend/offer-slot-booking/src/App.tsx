import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import BusinessProfile from "./pages/admin/BusinessProfile";
import CreateOffer from "./pages/admin/CreateOffer";
import ManageOffers from "./pages/admin/ManageOffers";
import ManageSlots from "./pages/admin/ManageSlots";
import ManageBookings from "./pages/admin/ManageBookings";
import NotificationLogs from "./pages/admin/NotificationLogs";

import OfferListing from "./pages/public/OfferListing";
import OfferDetail from "./pages/public/OfferDetail";
import BookingConfirmation from "./pages/public/BookingConfirmation";
import MyBooking from "./pages/public/MyBooking";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/offers" replace />} />
            <Route path="/offers" element={<OfferListing />} />
            <Route path="/offers/:id" element={<OfferDetail />} />
            <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
            <Route path="/my-booking" element={<MyBooking />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/business" element={<ProtectedRoute><BusinessProfile /></ProtectedRoute>} />
            <Route path="/admin/offers" element={<ProtectedRoute><ManageOffers /></ProtectedRoute>} />
            <Route path="/admin/offers/create" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
            <Route path="/admin/offers/edit/:id" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
            <Route path="/admin/slots" element={<ProtectedRoute><ManageSlots /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><NotificationLogs /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/offers" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
