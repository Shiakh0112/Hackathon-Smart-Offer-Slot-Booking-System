import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";
import CountdownTimer from "../../components/CountdownTimer";
import SmartSearch from "../../components/SmartSearch";
import { getOffers } from "../../api/services";
import type { Offer } from "../../types";
import {
  FiSearch, FiFilter, FiMapPin, FiUsers, FiX,
  FiTag, FiPercent, FiArrowRight, FiSliders, FiZap
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const BUSINESS_TYPES = ["All", "Restaurant", "Gym", "Salon", "Clinic", "Coaching", "Turf", "Gaming Zone", "Spa", "Other"];
const CATEGORIES = ["All", "Fitness", "Food & Dining", "Beauty & Wellness", "Healthcare", "Education", "Sports", "Entertainment", "Other"];

const categoryGradients: Record<string, string> = {
  "Fitness":           "from-blue-500 via-indigo-500 to-violet-600",
  "Food & Dining":     "from-orange-400 via-red-500 to-rose-600",
  "Beauty & Wellness": "from-pink-400 via-rose-500 to-fuchsia-600",
  "Healthcare":        "from-emerald-400 via-teal-500 to-cyan-600",
  "Education":         "from-violet-500 via-purple-500 to-indigo-600",
  "Sports":            "from-green-400 via-emerald-500 to-teal-600",
  "Entertainment":     "from-amber-400 via-orange-500 to-red-500",
  "Other":             "from-slate-400 via-gray-500 to-zinc-600",
};

const categoryIcons: Record<string, string> = {
  "Fitness":           "🏋️",
  "Food & Dining":     "🍽️",
  "Beauty & Wellness": "💆",
  "Healthcare":        "🏥",
  "Education":         "📚",
  "Sports":            "⚽",
  "Entertainment":     "🎭",
  "Other":             "✨",
};

const businessTypeIcons: Record<string, string> = {
  "Restaurant": "🍴", "Gym": "💪", "Salon": "✂️", "Clinic": "🩺",
  "Coaching": "📖", "Turf": "🏟️", "Gaming Zone": "🎮", "Spa": "🧖", "Other": "🏢",
};

export default function OfferListing() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [businessType, setBusinessType] = useState("All");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, unknown> = {};
    if (businessType !== "All") params.businessType = businessType;
    if (category !== "All") params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (availableOnly) params.availableOnly = true;
    getOffers(params).then((r) => setOffers(r.data)).finally(() => setLoading(false));
  }, [businessType, category, minPrice, maxPrice, availableOnly]);

  const filtered = offers.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.businessName.toLowerCase().includes(search.toLowerCase()) ||
    o.category.toLowerCase().includes(search.toLowerCase())
  );

  const clearFilters = () => {
    setBusinessType("All"); setCategory("All");
    setMinPrice(""); setMaxPrice(""); setAvailableOnly(false);
  };

  const hasFilters = businessType !== "All" || category !== "All" || minPrice || maxPrice || availableOnly;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b18]">
      <PublicNavbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full mb-5 border border-white/20 shadow-lg animate-fade-in">
            <HiSparkles size={13} className="text-amber-300" />
            Limited Time Offers
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-[1.1] tracking-tight animate-slide-up">
            Exclusive Deals,<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300"> Book Your Slot</span>
          </h1>
          <p className="text-indigo-200 mb-10 text-sm sm:text-base font-medium animate-fade-in">
            Discover amazing offers from top businesses near you
          </p>
          <div className="animate-slide-up">
            <SmartSearch />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              showFilters || hasFilters
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-lg shadow-violet-500/30"
                : "bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-violet-400 dark:hover:border-violet-600 backdrop-blur-sm"
            }`}
          >
            <FiSliders size={14} />
            Filters {hasFilters && <span className="bg-white/25 text-xs px-1.5 py-0.5 rounded-full font-bold">ON</span>}
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700/60 px-3.5 py-2.5 rounded-xl hover:border-violet-400 transition-all duration-200 backdrop-blur-sm font-medium">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded accent-violet-600"
            />
            <FiZap size={13} className="text-amber-500" />
            Available only
          </label>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 px-3.5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 border border-red-200 dark:border-red-900/40">
              <FiX size={14} /> Clear
            </button>
          )}

          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 font-medium">
            <span className="text-violet-600 dark:text-violet-400 font-black text-base">{filtered.length}</span> offer{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="card p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-violet-200 dark:border-violet-800/40 border-2 animate-scale-in shadow-lg shadow-violet-500/5">
            <div>
              <label className="label text-xs flex items-center gap-1.5 text-violet-700 dark:text-violet-400"><FiFilter size={11} /> Business Type</label>
              <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="input text-sm">
                {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs flex items-center gap-1.5 text-violet-700 dark:text-violet-400"><FiTag size={11} /> Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs flex items-center gap-1.5 text-violet-700 dark:text-violet-400"><FiPercent size={11} /> Min Price (₹)</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="input text-sm" placeholder="0" />
            </div>
            <div>
              <label className="label text-xs flex items-center gap-1.5 text-violet-700 dark:text-violet-400"><FiPercent size={11} /> Max Price (₹)</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input text-sm" placeholder="9999" />
            </div>
          </div>
        )}

        {/* Offers Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-14 h-14 border-2 border-violet-600/20 border-t-violet-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <HiSparkles size={16} className="text-violet-500" />
              </div>
            </div>
            <p className="text-sm text-gray-400 font-medium">Loading amazing offers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <FiSearch size={36} className="text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">No offers found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((offer) => {
              const gradient = categoryGradients[offer.category] ?? "from-violet-500 via-indigo-500 to-blue-600";
              const catIcon = categoryIcons[offer.category] ?? "✨";
              const bizIcon = businessTypeIcons[offer.businessType] ?? "🏢";
              const fillPct = offer.totalCapacity > 0
                ? Math.min(100, ((offer.totalCapacity - offer.availableSlots) / offer.totalCapacity) * 100)
                : 0;
              return (
                <div key={offer.id} className="group card-hover flex flex-col animate-fade-in">
                  {/* Card Visual */}
                  <div className={`relative bg-gradient-to-br ${gradient} h-40 flex items-center justify-center overflow-hidden rounded-t-2xl`}>
                    {/* Shimmer overlay on hover */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />

                    <div className="relative text-center text-white z-10">
                      <div className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{catIcon}</div>
                      <div className="text-3xl font-black drop-shadow-md">{Math.round(offer.discountPercentage)}%</div>
                      <div className="text-xs font-bold opacity-90 tracking-widest uppercase">OFF</div>
                    </div>

                    <div className="absolute top-3 left-3 bg-black/25 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
                      {bizIcon} {offer.businessType}
                    </div>
                    <div className="absolute top-3 right-3">
                      <CountdownTimer endDate={offer.endDate} />
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-200">
                      {offer.title}
                    </h3>
                    <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">{offer.businessName}</p>

                    {offer.businessCity && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                        <FiMapPin size={11} /> {offer.businessCity}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{offer.offerPrice}</span>
                      <span className="text-sm text-gray-400 line-through">₹{offer.originalPrice}</span>
                      <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/30">
                        Save ₹{offer.originalPrice - offer.offerPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs mb-1.5">
                      <FiUsers size={12} className="text-gray-400" />
                      <span className={offer.availableSlots > 0 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-red-500 font-semibold"}>
                        {offer.availableSlots > 0 ? `${offer.availableSlots} seats left` : "Fully Booked"}
                      </span>
                    </div>

                    {offer.totalCapacity > 0 && (
                      <div className="mb-4">
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              offer.availableSlots === 0 ? "bg-gradient-to-r from-red-500 to-rose-500"
                              : offer.availableSlots <= offer.totalCapacity * 0.2 ? "bg-gradient-to-r from-amber-400 to-orange-500"
                              : "bg-gradient-to-r from-emerald-400 to-teal-500"
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{offer.totalCapacity - offer.availableSlots} booked</span>
                          <span>{offer.totalCapacity} total</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      {offer.availableSlots > 0 ? (
                        <Link
                          to={`/offers/${offer.id}`}
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold transition-all duration-200 shadow-md shadow-violet-500/30 hover:shadow-lg hover:shadow-violet-500/40 active:scale-95 group/btn"
                        >
                          Book Now
                          <FiArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                      ) : (
                        <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/60 text-gray-400 text-sm font-semibold cursor-not-allowed">
                          <FiUsers size={14} /> Fully Booked
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
