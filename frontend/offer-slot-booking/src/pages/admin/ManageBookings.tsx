import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import { getBookings, updateBookingStatus } from "../../api/services";
import type { Booking } from "../../types";
import toast from "react-hot-toast";
import { FiSearch, FiDownload, FiBookOpen, FiFilter, FiPhone, FiUser } from "react-icons/fi";

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Cancelled", "Completed", "No Show"];

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getBookings().then((r) => setBookings(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, status);
      toast.success("Status updated");
      load();
    } catch { toast.error("Failed to update status"); }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search) ||
      b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      b.offerTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const headers = ["Reference", "Customer", "Phone", "Offer", "Business", "Slot Date", "Time", "People", "Status", "Created"];
    const rows = filtered.map((b) => [
      b.bookingReference, b.customerName, b.customerPhone, b.offerTitle,
      b.businessName, b.slotDate, `${b.startTime}-${b.endTime}`,
      b.peopleCount, b.status, new Date(b.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bookings.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiBookOpen size={22} className="text-violet-500" />
              Manage Bookings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{bookings.length} total bookings</p>
          </div>
          <button onClick={exportCSV} className="btn-secondary self-start sm:self-auto">
            <FiDownload size={15} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search by name, phone, reference, offer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="relative sm:w-44">
              <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-9 appearance-none"
              >
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {(search || statusFilter !== "All") && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              Showing <span className="font-semibold text-violet-600 dark:text-violet-400">{filtered.length}</span> of {bookings.length} bookings
            </p>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-gray-800/50">
                    {["Reference", "Customer", "Offer", "Slot", "People", "Status", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center">
                        <FiBookOpen size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                        <p className="text-gray-400 font-medium">No bookings found</p>
                        <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 px-2.5 py-1 rounded-lg border border-violet-100 dark:border-violet-800">
                          {b.bookingReference}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            <FiUser size={12} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{b.customerName}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <FiPhone size={10} /> {b.customerPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white text-sm max-w-[130px] truncate">{b.offerTitle}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[130px]">{b.businessName}</div>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <div className="font-medium text-gray-700 dark:text-gray-300">{b.slotDate}</div>
                        <div className="text-gray-400">{b.startTime} – {b.endTime}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                          {b.peopleCount}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer"
                        >
                          {["Pending", "Confirmed", "Cancelled", "Completed", "No Show"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
