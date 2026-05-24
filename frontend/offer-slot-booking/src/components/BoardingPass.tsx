import type { Booking } from "../types";
import { QRCodeSVG } from "qrcode.react";
import { FiCalendar, FiClock, FiUsers, FiHash, FiMapPin } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

interface Props { booking: Booking; }

export default function BoardingPass({ booking }: Props) {
  const qrData = JSON.stringify({
    ref: booking.bookingReference,
    offer: booking.offerTitle,
    customer: booking.customerName,
    slot: `${booking.slotDate} ${booking.startTime}`,
  });

  return (
    <div className="boarding-pass-print">
      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-100 dark:border-white/5 max-w-2xl mx-auto">

        {/* Top — Gradient Header */}
        <div className="bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 p-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }} />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <HiSparkles size={15} className="text-white" />
                </div>
                <span className="text-white/80 text-sm font-bold tracking-wide">OfferSlot</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">{booking.offerTitle}</h2>
              <p className="text-indigo-200 mt-1.5 font-semibold">{booking.businessName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-indigo-300 uppercase tracking-widest mb-1.5 font-bold">Status</div>
              <div className="bg-white/15 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full border border-white/25 shadow-sm">
                {booking.status}
              </div>
            </div>
          </div>
        </div>

        {/* Tear Line */}
        <div className="relative flex items-center bg-white dark:bg-gray-900">
          <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-[#060b18] -ml-3.5 flex-shrink-0" />
          <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-gray-700/60 mx-2" />
          <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-[#060b18] -mr-3.5 flex-shrink-0" />
        </div>

        {/* Bottom — Details + QR */}
        <div className="p-6">
          <div className="flex gap-6">
            {/* Details Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { icon: FiHash,     label: "Reference",  value: booking.bookingReference, mono: true },
                { icon: FiUsers,    label: "Passenger",  value: booking.customerName },
                { icon: FiCalendar, label: "Date",       value: booking.slotDate },
                { icon: FiClock,    label: "Time",       value: `${booking.startTime} – ${booking.endTime}` },
                { icon: FiUsers,    label: "People",     value: `${booking.peopleCount} person${booking.peopleCount > 1 ? "s" : ""}` },
                { icon: FiMapPin,   label: "Business",   value: booking.businessName },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="group">
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                    <Icon size={10} className="text-violet-400" /> {label}
                  </div>
                  <p className={`text-sm font-bold text-gray-900 dark:text-white truncate ${mono ? "font-mono text-xs bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-lg text-violet-700 dark:text-violet-400" : ""}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <div className="bg-white p-3.5 rounded-2xl shadow-lg border border-gray-100">
                <QRCodeSVG value={qrData} size={110} />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center font-semibold uppercase tracking-wide">Scan at venue</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Valid for entry</span>
            </div>
            <span className="text-xs text-gray-400 font-mono font-bold">{booking.bookingReference}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
