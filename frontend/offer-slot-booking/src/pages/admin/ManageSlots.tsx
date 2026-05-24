import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import { getOffers, getSlotsByOffer, createSlot, updateSlot, deleteSlot } from "../../api/services";
import type { Offer, OfferSlot } from "../../types";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCalendar, FiClock, FiUsers } from "react-icons/fi";

const SLOT_STATUSES = ["Available", "Closed", "Cancelled"];

export default function ManageSlots() {
  const [searchParams] = useSearchParams();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<string>(searchParams.get("offerId") || "");
  const [slots, setSlots] = useState<OfferSlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<OfferSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ slotDate: "", startTime: "09:00", endTime: "10:00", capacity: "10" });

  useEffect(() => {
    getOffers({ adminView: true }).then((r) => {
      setOffers(r.data);
      if (!selectedOffer && r.data.length > 0) setSelectedOffer(String(r.data[0].id));
    });
  }, []);

  useEffect(() => {
    if (selectedOffer) getSlotsByOffer(Number(selectedOffer)).then((r) => setSlots(r.data));
  }, [selectedOffer]);

  const loadSlots = () => {
    if (selectedOffer) getSlotsByOffer(Number(selectedOffer)).then((r) => setSlots(r.data));
  };

  const openCreate = () => {
    setEditingSlot(null);
    setForm({ slotDate: "", startTime: "09:00", endTime: "10:00", capacity: "10" });
    setShowForm(true);
  };

  const openEdit = (s: OfferSlot) => {
    setEditingSlot(s);
    setForm({ slotDate: s.slotDate.split("T")[0], startTime: s.startTime, endTime: s.endTime, capacity: String(s.capacity) });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSlot) {
        await updateSlot(editingSlot.id, {
          slotDate: new Date(form.slotDate).toISOString(), startTime: form.startTime,
          endTime: form.endTime, capacity: Number(form.capacity), status: editingSlot.status,
        });
        toast.success("Slot updated!");
      } else {
        await createSlot({
          offerId: Number(selectedOffer), slotDate: new Date(form.slotDate).toISOString(),
          startTime: form.startTime, endTime: form.endTime, capacity: Number(form.capacity),
        });
        toast.success("Slot created!");
      }
      setShowForm(false);
      loadSlots();
    } catch { toast.error("Failed to save slot"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this slot?")) return;
    try { await deleteSlot(id); toast.success("Slot deleted"); loadSlots(); }
    catch { toast.error("Failed to delete slot"); }
  };

  const handleStatusChange = async (slot: OfferSlot, status: string) => {
    try {
      await updateSlot(slot.id, { slotDate: slot.slotDate, startTime: slot.startTime, endTime: slot.endTime, capacity: slot.capacity, status });
      toast.success("Status updated");
      loadSlots();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiCalendar size={22} className="text-amber-500" />
              Manage Slots
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{slots.length} slots for selected offer</p>
          </div>
          <button onClick={openCreate} disabled={!selectedOffer} className="btn-primary self-start sm:self-auto">
            <FiPlus size={16} /> Add Slot
          </button>
        </div>

        {/* Offer Selector */}
        <div className="card p-4">
          <label className="label">Select Offer</label>
          <select value={selectedOffer} onChange={(e) => setSelectedOffer(e.target.value)} className="input max-w-sm">
            <option value="">-- Select Offer --</option>
            {offers.map((o) => <option key={o.id} value={o.id}>{o.title} ({o.businessName})</option>)}
          </select>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="card p-5 border-2 border-violet-200 dark:border-violet-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {editingSlot ? <FiEdit2 size={16} className="text-violet-500" /> : <FiPlus size={16} className="text-violet-500" />}
                {editingSlot ? "Edit Slot" : "New Slot"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiX size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label flex items-center gap-1"><FiCalendar size={12} /> Date *</label>
                <input type="date" value={form.slotDate} onChange={(e) => setForm({ ...form, slotDate: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="label flex items-center gap-1"><FiClock size={12} /> Start Time *</label>
                <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="label flex items-center gap-1"><FiClock size={12} /> End Time *</label>
                <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="label flex items-center gap-1"><FiUsers size={12} /> Capacity *</label>
                <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input" required />
              </div>
              <div className="col-span-2 md:col-span-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave size={14} /> Save</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Slots Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/50">
                  {["Date", "Time", "Capacity", "Booked", "Available", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {slots.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <FiCalendar size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                      <p className="text-gray-400 font-medium">
                        {selectedOffer ? "No slots for this offer" : "Select an offer to view slots"}
                      </p>
                    </td>
                  </tr>
                )}
                {slots.map((s) => (
                  <tr key={s.id} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                          <FiCalendar size={13} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{s.slotDate.split("T")[0]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">
                      {s.startTime} – {s.endTime}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                        {s.capacity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-sm font-bold text-rose-600 dark:text-rose-400">
                        {s.bookedCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                        s.availableCount > 0
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-50 dark:bg-red-900/20 text-red-500"
                      }`}>
                        {s.availableCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={(e) => handleStatusChange(s, e.target.value)}
                        className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer"
                      >
                        {SLOT_STATUSES.map((st) => <option key={st}>{st}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
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
