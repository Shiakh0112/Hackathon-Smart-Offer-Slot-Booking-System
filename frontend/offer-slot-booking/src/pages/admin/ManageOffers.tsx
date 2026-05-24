import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import { getOffers, deleteOffer, updateOffer } from "../../api/services";
import type { Offer } from "../../types";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiTag, FiFilter, FiCalendar } from "react-icons/fi";

const STATUS_OPTIONS = ["All", "Draft", "Active", "Paused", "Expired", "Cancelled"];

export default function ManageOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getOffers({ adminView: true }).then((r) => setOffers(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this offer?")) return;
    try { await deleteOffer(id); toast.success("Offer deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  const handleStatusChange = async (offer: Offer, status: string) => {
    try {
      await updateOffer(offer.id, { ...offer, status });
      toast.success(`Status changed to ${status}`);
      load();
    } catch { toast.error("Failed to update status"); }
  };

  const filtered = offers.filter((o) => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.businessName.toLowerCase().includes(search.toLowerCase()) ||
      o.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiTag size={22} className="text-violet-500" />
              Manage Offers
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{offers.length} total offers</p>
          </div>
          <Link to="/admin/offers/create" className="btn-primary self-start sm:self-auto">
            <FiPlus size={16} /> New Offer
          </Link>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search offers, businesses, categories..."
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
                    {["Offer", "Business", "Price", "Dates", "Capacity", "Status", "Actions"].map((h) => (
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
                        <FiTag size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                        <p className="text-gray-400 font-medium">No offers found</p>
                      </td>
                    </tr>
                  )}
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm max-w-[160px] truncate">{o.title}</div>
                        <span className="inline-block mt-0.5 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-medium">
                          {o.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{o.businessName}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">₹{o.offerPrice}</div>
                        <div className="text-xs text-gray-400 line-through">₹{o.originalPrice}</div>
                        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">{Math.round(o.discountPercentage)}% off</div>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <FiCalendar size={11} className="text-violet-400" />
                          {o.startDate.split("T")[0]}
                        </div>
                        <div className="text-gray-400 mt-0.5 pl-4">→ {o.endDate.split("T")[0]}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                          {o.totalCapacity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o, e.target.value)}
                          className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer"
                        >
                          {["Draft", "Active", "Paused", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/admin/offers/edit/${o.id}`}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                          <Link
                            to={`/admin/slots?offerId=${o.id}`}
                            className="px-2 py-1 rounded-lg text-xs font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors whitespace-nowrap"
                          >
                            Slots
                          </Link>
                        </div>
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
