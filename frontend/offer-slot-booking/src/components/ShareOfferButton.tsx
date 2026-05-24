import { useState } from "react";
import type { Offer } from "../types";
import { FiShare2, FiCopy, FiCheck, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface Props { offer: Offer; }

export default function ShareOfferButton({ offer }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/offers/${offer.id}`;
  const text = `🎯 ${offer.title} — ${Math.round(offer.discountPercentage)}% OFF!\n₹${offer.offerPrice} (was ₹${offer.originalPrice})\nBook now: ${url}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setOpen(false);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: offer.title, text: `${offer.title} — ${Math.round(offer.discountPercentage)}% OFF!`, url });
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 border border-violet-200 dark:border-violet-700/50 transition-all duration-200 hover:shadow-md hover:shadow-violet-500/10 active:scale-95"
      >
        <FiShare2 size={14} /> Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/20 border border-gray-100/80 dark:border-white/10 overflow-hidden z-[9999] animate-scale-in">

            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <FiShare2 size={11} className="text-white" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Share Offer</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                <FiX size={13} />
              </button>
            </div>

            {/* Offer Preview */}
            <div className="mx-3 mt-3 p-3 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl border border-violet-100 dark:border-violet-800/40">
              <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{offer.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{offer.offerPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{offer.originalPrice}</span>
                <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                  {Math.round(offer.discountPercentage)}% OFF
                </span>
              </div>
            </div>

            <div className="px-3 py-3 space-y-1.5">
              {/* Copy Link */}
              <button
                onClick={copyLink}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${
                  copied ? "bg-emerald-50 dark:bg-emerald-900/20" : "hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  copied ? "bg-emerald-500 shadow-md shadow-emerald-500/30" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                }`}>
                  {copied ? <FiCheck size={15} className="text-white" /> : <FiCopy size={15} className="text-gray-500 dark:text-gray-400" />}
                </div>
                <span className={`text-sm font-semibold transition-colors ${copied ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {copied ? "✓ Link Copied!" : "Copy Link"}
                </span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all duration-200 text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-500 group-hover:shadow-md group-hover:shadow-emerald-500/30 transition-all duration-200">
                  <FaWhatsapp size={17} className="text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share on WhatsApp</span>
              </button>

              {/* Native Share */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={shareNative}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all duration-200 text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-600 group-hover:shadow-md group-hover:shadow-violet-500/30 transition-all duration-200">
                    <FiShare2 size={14} className="text-violet-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">More Options</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
