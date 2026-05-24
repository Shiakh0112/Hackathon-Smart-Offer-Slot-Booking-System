import { useState } from "react";
import PublicNavbar from "../../components/PublicNavbar";
import StatusBadge from "../../components/StatusBadge";
import { searchBookingByReference } from "../../api/services";
import type { Booking } from "../../types";
import { QRCodeSVG } from "qrcode.react";
import {
  FiSearch, FiHash, FiUser, FiPhone, FiCalendar,
  FiClock, FiUsers, FiTag, FiBriefcase, FiFileText, FiPrinter
} from "react-icons/fi";

export default function MyBooking() {
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;
    setLoading(true);
    setError("");
    setBooking(null);
    setSearched(true);
    try {
      const res = await searchBookingByReference(reference.trim());
      setBooking(res.data);
    } catch {
      setError("No booking found with this reference. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const qrData = booking ? JSON.stringify({
    ref: booking.bookingReference,
    offer: booking.offerTitle,
    customer: booking.customerName,
    slot: `${booking.slotDate} ${booking.startTime}`,
  }) : "";

  const details = booking ? [
    { icon: FiUser,      label: "Customer",  value: booking.customerName },
    { icon: FiPhone,     label: "Phone",     value: booking.customerPhone },
    { icon: FiTag,       label: "Offer",     value: booking.offerTitle },
    { icon: FiBriefcase, label: "Business",  value: booking.businessName },
    { icon: FiCalendar,  label: "Date",      value: booking.slotDate },
    { icon: FiClock,     label: "Time",      value: `${booking.startTime} – ${booking.endTime}` },
    { icon: FiUsers,     label: "People",    value: String(booking.peopleCount) },
    ...(booking.specialNote ? [{ icon: FiFileText, label: "Note", value: booking.specialNote }] : []),
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
      <PublicNavbar />
      <div className="max-w-2xl mx-auto px-4 py-12 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/30">
            <FiHash size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find My Booking</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Enter your booking reference to view details</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="card p-5 mb-6">
          <label className="label flex items-center gap-1.5">
            <FiHash size={13} className="text-gray-400" /> Booking Reference
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                className="input pl-10 font-mono uppercase tracking-wider"
                placeholder="e.g. BK20260525123456789"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary px-5">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSearch size={16} />}
            </button>
          </div>
        </form>

        {/* Error */}
        {searched && error && (
          <div className="card p-5 border-2 border-red-100 dark:border-red-900/30 text-center">
            <FiSearch size={32} className="mx-auto text-red-300 dark:text-red-700 mb-2" />
            <p className="text-red-500 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Result */}
        {booking && (
          <div className="card overflow-hidden shadow-xl animate-slide-up">
            {/* Banner */}
            <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-5 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FiHash size={14} className="text-indigo-200" />
                  <span className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">Booking Reference</span>
                </div>
                <div className="text-2xl font-black text-white font-mono tracking-wider mb-2">{booking.bookingReference}</div>
                <StatusBadge status={booking.status} />
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Details */}
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <FiFileText size={15} className="text-violet-500" /> Booking Details
                  </h2>
                  <div className="space-y-3">
                    {details.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon size={13} className="text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{label}</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                    <QRCodeSVG value={qrData} size={140} />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center font-medium">Show at venue for entry</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800 pt-4">
              <button onClick={() => window.print()} className="btn-primary w-full justify-center">
                <FiPrinter size={15} /> Print / Save Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
