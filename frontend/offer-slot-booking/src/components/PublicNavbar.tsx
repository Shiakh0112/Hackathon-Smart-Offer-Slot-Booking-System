import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiGrid, FiShield, FiHash } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function PublicNavbar() {
  const { dark, toggle } = useTheme();
  const location = useLocation();

  return (
    <nav className="bg-white/70 dark:bg-[#060b18]/80 backdrop-blur-2xl border-b border-gray-200/40 dark:border-white/5 sticky top-0 z-40 shadow-sm shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/offers" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40 group-hover:shadow-violet-500/60 group-hover:scale-105 transition-all duration-200">
            <HiSparkles size={17} className="text-white" />
          </div>
          <span className="text-lg font-black gradient-text tracking-tight">OfferSlot</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/offers"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              location.pathname === "/offers"
                ? "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FiGrid size={15} />
            <span className="hidden sm:inline">Browse</span>
          </Link>

          <Link
            to="/my-booking"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              location.pathname === "/my-booking"
                ? "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FiHash size={15} />
            <span className="hidden sm:inline">My Booking</span>
          </Link>

          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-200 active:scale-95 ml-1"
          >
            <FiShield size={14} />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200 ml-1"
            aria-label="Toggle theme"
          >
            {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
