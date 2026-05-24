import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import { getDashboardSummary, getOffers, updateOffer } from "../../api/services";
import type { DashboardSummary, Offer } from "../../types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import {
  FiTag, FiCheckCircle, FiBookOpen, FiCalendar,
  FiUsers, FiTrendingUp, FiPlus, FiArrowRight,
  FiActivity, FiBarChart2, FiZap, FiPause, FiPlay
} from "react-icons/fi";

const statCards = [
  { key: "totalOffers",    label: "Total Offers",     icon: FiTag,         from: "from-violet-500", to: "to-indigo-500",  shadow: "shadow-violet-500/20" },
  { key: "activeOffers",   label: "Active Offers",    icon: FiCheckCircle, from: "from-emerald-500", to: "to-teal-500",   shadow: "shadow-emerald-500/20" },
  { key: "totalBookings",  label: "Total Bookings",   icon: FiBookOpen,    from: "from-blue-500",    to: "to-cyan-500",   shadow: "shadow-blue-500/20" },
  { key: "todaysBookings", label: "Today's Bookings", icon: FiCalendar,    from: "from-amber-500",   to: "to-orange-500", shadow: "shadow-amber-500/20" },
  { key: "totalCapacity",  label: "Total Capacity",   icon: FiUsers,       from: "from-pink-500",    to: "to-rose-500",   shadow: "shadow-pink-500/20" },
  { key: "bookedSeats",    label: "Booked Seats",     icon: FiActivity,    from: "from-purple-500",  to: "to-violet-500", shadow: "shadow-purple-500/20" },
  { key: "availableSeats", label: "Available Seats",  icon: FiUsers,       from: "from-teal-500",    to: "to-cyan-500",   shadow: "shadow-teal-500/20" },
  { key: "conversionRate", label: "Conversion Rate",  icon: FiTrendingUp,  from: "from-indigo-500",  to: "to-blue-500",   shadow: "shadow-indigo-500/20", suffix: "%" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-xl">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{payload[0].value} bookings</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeOffersList, setActiveOffersList] = useState<Offer[]>([]);
  const [quickLoading, setQuickLoading] = useState<number | null>(null);

  const loadAll = () => {
    getDashboardSummary().then((r) => setData(r.data)).finally(() => setLoading(false));
    getOffers({ adminView: true }).then((r) =>
      setActiveOffersList(r.data.filter((o) => o.status === "Active" || o.status === "Paused").slice(0, 4))
    );
  };

  useEffect(() => { loadAll(); }, []);

  const quickToggle = async (offer: Offer) => {
    setQuickLoading(offer.id);
    const newStatus = offer.status === "Active" ? "Paused" : "Active";
    try {
      await updateOffer(offer.id, { ...offer, status: newStatus });
      loadAll();
    } finally { setQuickLoading(null); }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back! Here's what's happening.</p>
          </div>
          <Link to="/admin/offers/create" className="btn-primary self-start sm:self-auto">
            <FiPlus size={16} /> Create Offer
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map(({ key, label, icon: Icon, from, to, shadow, suffix }) => (
            <div key={key} className="card p-4 sm:p-5 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(data as unknown as Record<string, number>)?.[key] ?? 0}{suffix ?? ""}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Chart + Utilization Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Bookings Chart */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title flex items-center gap-2">
                <FiBarChart2 size={18} className="text-violet-500" />
                Bookings — Last 7 Days
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
                {data?.last7DaysStats?.reduce((a, b) => a + b.count, 0) ?? 0} total
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data?.last7DaysStats ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#bookingGrad)"
                  dot={{ fill: "#7c3aed", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#7c3aed" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Seat Utilization */}
          <div className="card p-5 flex flex-col justify-between">
            <h2 className="section-title flex items-center gap-2 mb-4">
              <FiActivity size={18} className="text-violet-500" />
              Seat Utilization
            </h2>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="text-center">
                <div className="text-5xl font-black gradient-text">{data?.conversionRate ?? 0}%</div>
                <p className="text-sm text-gray-400 mt-1">Fill Rate</p>
              </div>
              <div className="relative h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.conversionRate ?? 0}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-3">
                  <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{data?.bookedSeats}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Booked</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data?.availableSeats}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {activeOffersList.length > 0 && (
          <div className="card p-5">
            <h2 className="section-title flex items-center gap-2 mb-4">
              <FiZap size={18} className="text-amber-500" />
              Quick Actions
              <span className="text-xs text-gray-400 font-normal ml-1">— Toggle offers without leaving dashboard</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeOffersList.map((offer) => (
                <div key={offer.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    offer.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{offer.title}</p>
                    <p className="text-xs text-gray-400 truncate">{offer.businessName}</p>
                  </div>
                  <button
                    onClick={() => quickToggle(offer)}
                    disabled={quickLoading === offer.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      offer.status === "Active"
                        ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-200"
                        : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200"
                    }`}
                  >
                    {quickLoading === offer.id ? (
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : offer.status === "Active" ? (
                      <><FiPause size={11} /> Pause</>
                    ) : (
                      <><FiPlay size={11} /> Activate</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="section-title flex items-center gap-2">
              <FiBookOpen size={18} className="text-violet-500" />
              Recent Bookings
            </h2>
            <Link to="/admin/bookings" className="flex items-center gap-1 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/50">
                  {["Customer", "Offer", "Slot Time", "People", "Status", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {(data?.recentBookings?.length ?? 0) === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center">
                    <FiBookOpen size={32} className="mx-auto text-gray-300 dark:text-gray-700 mb-2" />
                    <p className="text-gray-400 text-sm">No bookings yet</p>
                  </td></tr>
                )}
                {data?.recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {b.customerName[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{b.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm max-w-[140px] truncate">{b.offerTitle}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">{b.slotDate}</div>
                      <div className="text-gray-400">{b.startTime}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">{b.peopleCount}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <Link to="/admin/bookings" className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
                        Manage <FiArrowRight size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
