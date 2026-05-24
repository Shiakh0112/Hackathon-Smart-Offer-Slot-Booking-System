import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";
import CountdownTimer from "../../components/CountdownTimer";
import ShareOfferButton from "../../components/ShareOfferButton";
import { getOfferById, getSlotsByOffer, createBooking } from "../../api/services";
import type { Offer, OfferSlot } from "../../types";
import toast from "react-hot-toast";
import {
  FiMapPin, FiClock, FiUsers, FiCalendar, FiPhone,
  FiMail, FiUser, FiArrowLeft, FiCheckCircle, FiFileText,
  FiArrowRight, FiPercent, FiZap
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [slots, setSlots] = useState<OfferSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [form, setForm] = useState({
    customerName: "", customerPhone: "", customerEmail: "", peopleCount: "1", specialNote: "",
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([getOfferById(Number(id)), getSlotsByOffer(Number(id))])
      .then(([offerRes, slotsRes]) => {
        setOffer(offerRes.data);
        const available = slotsRes.data.filter((s) => s.status === "Available" && s.availableCount > 0);
        setSlots(available);
        if (available.length > 0) setSelectedSlot(String(available[0].id));
      })
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      getSlotsByOffer(Number(id)).then((r) => {
        const available = r.data.filter((s) => s.status === "Available" && s.availableCount > 0);
        setSlots(available);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) { toast.error("Please select a slot"); return; }
    setBooking(true);
    try {
      const res = await createBooking({
        offerId: Number(id), slotId: Number(selectedSlot),
        customerName: form.customerName, customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        peopleCount: Number(form.peopleCount),
        specialNote: form.specialNote || undefined,
      });
      toast.success("Booking confirmed! 🎉");
      navigate(`/booking-confirmation/${res.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const selectedSlotData = slots.find((s) => String(s.id) === selectedSlot);

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
          <p className="text-sm text-gray-400 font-medium">Loading offer...</p>
        </div>
      </div>
    );

  if (!offer)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#060b18]">
        <PublicNavbar />
        <div className="text-center py-32 text-gray-400">Offer not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b18]">
      <PublicNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
        {/* Back + Share */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/offers")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
          >
            <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" /> Back to offers
          </button>
          <ShareOfferButton offer={offer} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero Card */}
            <div className="card overflow-hidden shadow-xl shadow-violet-500/5">
              <div className="bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 p-7 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl" />
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "30px 30px"
                }} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-bold border border-white/20 mb-4 shadow-sm">
                        <HiSparkles size={11} className="text-amber-300" /> {offer.category}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{offer.title}</h1>
                      <p className="text-indigo-200 mt-1.5 font-semibold">{offer.businessName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-5xl font-black text-white drop-shadow-lg">{Math.round(offer.discountPercentage)}%</div>
                      <div className="text-indigo-200 text-sm font-black tracking-widest uppercase">OFF</div>
                      <div className="mt-2">
                        <CountdownTimer endDate={offer.endDate} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Price */}
                <div className="flex items-center gap-3 flex-wrap p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                  <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">₹{offer.offerPrice}</span>
                  <span className="text-xl text-gray-400 line-through">₹{offer.originalPrice}</span>
                  <span className="bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md shadow-emerald-500/30">
                    <FiPercent size={12} /> Save ₹{offer.originalPrice - offer.offerPrice}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{offer.description}</p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FiCalendar, label: "Duration", value: `${offer.startDate.split("T")[0]} → ${offer.endDate.split("T")[0]}` },
                    { icon: FiClock, label: "Time", value: `${offer.startTime} – ${offer.endTime}` },
                    { icon: FiUsers, label: "Available", value: `${offer.availableSlots} seats`, highlight: offer.availableSlots > 0 },
                    ...(offer.businessCity ? [{ icon: FiMapPin, label: "Location", value: offer.businessCity }] : []),
                  ].map(({ icon: Icon, label, value, highlight }, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/30 hover:border-violet-200 dark:hover:border-violet-700/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                        <p className={`text-sm font-bold mt-0.5 ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {offer.businessAddress && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700/30">
                    <FiMapPin size={14} className="text-violet-500 flex-shrink-0" />
                    {offer.businessAddress}, {offer.businessCity}
                  </div>
                )}

                {offer.termsAndConditions && (
                  <div className="border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/20">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <FiFileText size={14} className="text-violet-500" /> Terms & Conditions
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{offer.termsAndConditions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Slot Selector */}
            <div className="card p-5 shadow-lg shadow-black/5">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <FiCalendar size={13} className="text-white" />
                </div>
                Available Slots
                <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Live
                </span>
              </h2>
              {slots.length === 0 ? (
                <div className="text-center py-10">
                  <FiCalendar size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No available slots at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedSlot === String(s.id)
                          ? "border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 shadow-md shadow-violet-500/15"
                          : "border-gray-200 dark:border-gray-700/60 hover:border-violet-300 dark:hover:border-violet-700 bg-gray-50/50 dark:bg-gray-800/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={s.id}
                        checked={selectedSlot === String(s.id)}
                        onChange={() => setSelectedSlot(String(s.id))}
                        className="accent-violet-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                          <FiCalendar size={12} className="text-violet-500" />
                          {s.slotDate.split("T")[0]}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <FiClock size={11} /> {s.startTime} – {s.endTime}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          <FiUsers size={11} /> {s.availableCount} seats left
                        </div>
                      </div>
                      {selectedSlot === String(s.id) && (
                        <FiCheckCircle size={18} className="text-violet-500 flex-shrink-0" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-20 shadow-xl shadow-violet-500/5 border-violet-100/50 dark:border-violet-900/20">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <FiZap size={13} className="text-white" />
                </div>
                Book This Offer
              </h2>

              {slots.length === 0 ? (
                <div className="text-center py-10">
                  <FiUsers size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-sm text-gray-400 font-medium">No slots available</p>
                </div>
              ) : !showForm ? (
                <div className="space-y-4">
                  {selectedSlotData && (
                    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-violet-100 dark:border-violet-800/40">
                      <p className="text-xs font-black text-violet-700 dark:text-violet-400 uppercase tracking-widest mb-2.5">Selected Slot</p>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2"><FiCalendar size={13} className="text-violet-500" /> {selectedSlotData.slotDate.split("T")[0]}</div>
                        <div className="flex items-center gap-2"><FiClock size={13} className="text-violet-500" /> {selectedSlotData.startTime} – {selectedSlotData.endTime}</div>
                        <div className="flex items-center gap-2"><FiUsers size={13} className="text-emerald-500" /> {selectedSlotData.availableCount} seats available</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2 px-1">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{offer.offerPrice}</span>
                    <span className="text-gray-400 line-through text-sm">₹{offer.originalPrice}</span>
                  </div>
                  <button onClick={() => setShowForm(true)} disabled={!selectedSlot} className="btn-primary w-full">
                    Proceed to Book <FiArrowRight size={15} />
                  </button>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                    <FiUsers size={11} /> Max {offer.maxBookingPerCustomer} booking(s) per customer
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-3">
                  {[
                    { label: "Full Name", key: "customerName", type: "text", icon: FiUser, placeholder: "Your full name", required: true },
                    { label: "Phone Number", key: "customerPhone", type: "tel", icon: FiPhone, placeholder: "10-digit phone", required: true },
                    { label: "Email (optional)", key: "customerEmail", type: "email", icon: FiMail, placeholder: "your@email.com", required: false },
                  ].map(({ label, key, type, icon: Icon, placeholder, required }) => (
                    <div key={key}>
                      <label className="label text-xs flex items-center gap-1.5">
                        <Icon size={11} className="text-violet-400" /> {label}
                      </label>
                      <input
                        type={type}
                        value={(form as Record<string, string>)[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="input text-sm"
                        placeholder={placeholder}
                        required={required}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="label text-xs flex items-center gap-1.5">
                      <FiUsers size={11} className="text-violet-400" /> Number of People
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedSlotData?.availableCount || 1}
                      value={form.peopleCount}
                      onChange={(e) => setForm({ ...form, peopleCount: e.target.value })}
                      className="input text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs flex items-center gap-1.5">
                      <FiFileText size={11} className="text-violet-400" /> Special Note (optional)
                    </label>
                    <textarea
                      value={form.specialNote}
                      onChange={(e) => setForm({ ...form, specialNote: e.target.value })}
                      className="input text-sm resize-none"
                      rows={2}
                      placeholder="Any special requests..."
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">
                      Back
                    </button>
                    <button type="submit" disabled={booking} className="btn-primary flex-1 text-sm">
                      {booking ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm 🎉"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
