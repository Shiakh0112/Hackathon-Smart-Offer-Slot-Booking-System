import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";
import BoardingPass from "../../components/BoardingPass";
import { getBookingById } from "../../api/services";
import type { Booking } from "../../types";
import { FiCheckCircle, FiGrid, FiPrinter, FiHash } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBookingById(Number(id)).then((r) => setBooking(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#060b18]">
        <PublicNavbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="w-14 h-14 border-2 border-violet-600/20 border-t-violet-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HiSparkles size={16} className="text-violet-500" />
            </div>
          </div>
          <p className="text-sm text-gray-400 font-medium">Loading confirmation...</p>
        </div>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#060b18]">
        <PublicNavbar />
        <div className="text-center py-32 text-gray-400">Booking not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b18]">
      <PublicNavbar />
      <div className="max-w-2xl mx-auto px-4 py-12 animate-slide-up">

        {/* Success Header */}
        <div className="text-center mb-10 no-print">
          {/* Glow ring */}
          <div className="relative inline-flex mb-5">
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-2xl scale-150" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-float">
              <FiCheckCircle size={42} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <HiSparkles size={14} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Booking Confirmed!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">Your slot has been successfully reserved 🎉</p>
        </div>

        {/* Boarding Pass Ticket */}
        <BoardingPass booking={booking} />

        {/* Reference */}
        <div className="mt-5 flex items-center justify-center gap-2 no-print">
          <FiHash size={13} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Your reference: </span>
          <span className="text-xs font-mono font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-3 py-1 rounded-lg border border-violet-200 dark:border-violet-800/40">
            {booking.bookingReference}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print">
          <Link to="/offers" className="btn-secondary flex-1 justify-center">
            <FiGrid size={15} /> Browse More Offers
          </Link>
          <button onClick={() => window.print()} className="btn-primary flex-1 justify-center">
            <FiPrinter size={15} /> Print Ticket
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 no-print font-medium">
          Booked on {new Date(booking.createdAt).toLocaleString()}
        </p>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          nav { display: none !important; }
          body { background: white !important; }
          .boarding-pass-print { margin: 0; padding: 20px; }
        }
      `}</style>
    </div>
  );
}
