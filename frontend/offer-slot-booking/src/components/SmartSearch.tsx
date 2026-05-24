import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getOffers } from "../api/services";
import type { Offer } from "../types";
import { FiSearch, FiTag, FiBriefcase, FiArrowRight, FiX } from "react-icons/fi";

export default function SmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Offer[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getOffers().then((r) => setAllOffers(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const q = query.toLowerCase();
    const filtered = allOffers.filter((o) =>
      o.title.toLowerCase().includes(q) ||
      o.businessName.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.businessType.toLowerCase().includes(q)
    ).slice(0, 6);
    setResults(filtered);
    setOpen(true);
  }, [query, allOffers]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (offer: Offer) => {
    setQuery("");
    setOpen(false);
    navigate(`/offers/${offer.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      navigate(`/offers?search=${encodeURIComponent(query)}`);
    }
  };

  // Group unique categories from results
  const categories = [...new Set(results.map((r) => r.category))];

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setOpen(true)}
            placeholder="Search offers, businesses, categories..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-gray-900 bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setOpen(false); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            >
              <FiX size={15} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-slide-up">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-400">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-400">No results for "{query}"</div>
          ) : (
            <>
              {/* Category chips */}
              {categories.length > 0 && (
                <div className="px-4 pt-3 pb-2 flex gap-2 flex-wrap border-b border-gray-50 dark:border-gray-800">
                  {categories.map((cat) => (
                    <span key={cat} className="text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                      <FiTag size={10} /> {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Results */}
              <div className="py-1">
                {results.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => handleSelect(offer)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {Math.round(offer.discountPercentage)}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{offer.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <FiBriefcase size={10} /> {offer.businessName}
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">₹{offer.offerPrice}</span>
                      </div>
                    </div>
                    <FiArrowRight size={14} className="text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* View all */}
              <div className="border-t border-gray-50 dark:border-gray-800 p-2">
                <button
                  onClick={() => { setOpen(false); navigate(`/offers`); }}
                  className="w-full text-center text-xs font-semibold text-violet-600 dark:text-violet-400 py-2 hover:bg-violet-50 dark:hover:bg-violet-900/10 rounded-xl transition-colors"
                >
                  View all offers →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
