import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FiHome, FiTag, FiCalendar, FiBookOpen, FiLogOut,
  FiSun, FiMoon, FiBriefcase, FiMenu, FiX, FiExternalLink, FiBell
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const navItems = [
  { to: "/admin/dashboard",     icon: FiHome,      label: "Dashboard",     color: "from-violet-500 to-indigo-600" },
  { to: "/admin/business",      icon: FiBriefcase, label: "Business",      color: "from-blue-500 to-cyan-600" },
  { to: "/admin/offers",        icon: FiTag,       label: "Offers",        color: "from-emerald-500 to-teal-600" },
  { to: "/admin/slots",         icon: FiCalendar,  label: "Slots",         color: "from-amber-500 to-orange-600" },
  { to: "/admin/bookings",      icon: FiBookOpen,  label: "Bookings",      color: "from-pink-500 to-rose-600" },
  { to: "/admin/notifications", icon: FiBell,      label: "Notifications", color: "from-yellow-500 to-amber-600" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
            <HiSparkles size={17} className="text-white" />
          </div>
          <span className="text-lg font-black gradient-text tracking-tight">OfferSlot</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <FiX size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-3 py-2.5">Navigation</p>
        {navItems.map(({ to, icon: Icon, label, color }) => {
          const active = location.pathname === to || (to !== "/admin/dashboard" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/25 dark:to-indigo-900/25 text-violet-700 dark:text-violet-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                active
                  ? `bg-gradient-to-br ${color} shadow-md`
                  : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
              }`}>
                <Icon size={14} className={active ? "text-white" : "text-gray-500 dark:text-gray-400"} />
              </div>
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-sm shadow-violet-500/50" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/60 dark:to-gray-900/60 mb-2 border border-gray-100 dark:border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-violet-500/30 flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 rounded-xl transition-all duration-200 hover:text-red-600"
        >
          <FiLogOut size={15} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#060b18]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 bg-white dark:bg-gray-900/90 border-r border-gray-100 dark:border-white/5 flex-shrink-0 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${sidebarOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
        <aside className={`absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <SidebarContent />
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-100/80 dark:border-white/5 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-sm shadow-black/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {navItems.find(n => location.pathname.startsWith(n.to))?.label ?? "Admin Panel"}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              to="/offers"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200 border border-violet-200/50 dark:border-violet-700/30"
            >
              <FiExternalLink size={14} />
              Public Page
            </Link>
            <NotificationBell />
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
            >
              {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
