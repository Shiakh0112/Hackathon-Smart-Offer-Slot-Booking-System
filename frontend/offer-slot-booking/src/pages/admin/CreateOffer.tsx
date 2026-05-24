import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { getBusiness, createOffer, updateOffer, getOfferById } from "../../api/services";
import type { Business } from "../../types";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave, FiTag, FiPercent } from "react-icons/fi";

const CATEGORIES = ["Fitness", "Food & Dining", "Beauty & Wellness", "Healthcare", "Education", "Sports", "Entertainment", "Other"];
const STATUSES = ["Draft", "Active", "Paused"];

export default function CreateOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessId: "", title: "", description: "", category: "Fitness",
    originalPrice: "", offerPrice: "", startDate: "", endDate: "",
    startTime: "09:00", endTime: "17:00", totalCapacity: "20",
    maxBookingPerCustomer: "1", termsAndConditions: "", status: "Draft",
  });

  useEffect(() => {
    getBusiness().then((r) => {
      setBusinesses(r.data);
      if (r.data.length > 0 && !id) setForm((f) => ({ ...f, businessId: String(r.data[0].id) }));
    });
    if (id) {
      getOfferById(Number(id)).then((r) => {
        const o = r.data;
        setForm({
          businessId: String(o.businessId), title: o.title, description: o.description,
          category: o.category, originalPrice: String(o.originalPrice),
          offerPrice: String(o.offerPrice), startDate: o.startDate.split("T")[0],
          endDate: o.endDate.split("T")[0], startTime: o.startTime, endTime: o.endTime,
          totalCapacity: String(o.totalCapacity), maxBookingPerCustomer: String(o.maxBookingPerCustomer),
          termsAndConditions: o.termsAndConditions || "", status: o.status,
        });
      });
    }
  }, [id]);

  const discount = form.originalPrice && form.offerPrice
    ? Math.round(((Number(form.originalPrice) - Number(form.offerPrice)) / Number(form.originalPrice)) * 100)
    : 0;

  const savings = form.originalPrice && form.offerPrice
    ? Number(form.originalPrice) - Number(form.offerPrice)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(form.offerPrice) >= Number(form.originalPrice)) {
      toast.error("Offer price must be less than original price");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        businessId: Number(form.businessId), title: form.title, description: form.description,
        category: form.category, originalPrice: Number(form.originalPrice),
        offerPrice: Number(form.offerPrice), startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(), startTime: form.startTime,
        endTime: form.endTime, totalCapacity: Number(form.totalCapacity),
        maxBookingPerCustomer: Number(form.maxBookingPerCustomer),
        termsAndConditions: form.termsAndConditions, status: form.status,
      };
      if (id) { await updateOffer(Number(id), payload); toast.success("Offer updated!"); }
      else { await createOffer(payload); toast.success("Offer created!"); }
      navigate("/admin/offers");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to save offer");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/offers")}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiTag size={20} className="text-violet-500" />
              {id ? "Edit Offer" : "Create New Offer"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {id ? "Update offer details" : "Fill in the details to create a new offer"}
            </p>
          </div>
        </div>

        {/* Discount Preview */}
        {discount > 0 && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FiPercent size={20} />
              </div>
              <div>
                <p className="font-bold text-lg">{discount}% Discount</p>
                <p className="text-emerald-100 text-sm">Customer saves ₹{savings}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{form.offerPrice}</p>
              <p className="text-emerald-200 text-sm line-through">₹{form.originalPrice}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Business & Basic Info */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-gray-100 dark:border-gray-800 pb-3">Basic Information</h2>

            <div>
              <label className="label">Business *</label>
              <select value={form.businessId} onChange={(e) => set("businessId", e.target.value)} className="input" required>
                <option value="">Select business</option>
                {businesses.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.businessType}</option>)}
              </select>
              {businesses.length === 0 && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  No businesses found.{" "}
                  <a href="/admin/business" className="underline font-medium">Create one first.</a>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Offer Title *</label>
                <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className="input" placeholder="e.g. Gym Trial Slot" required />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="input resize-none" rows={3} placeholder="Describe the offer..." required />
              </div>
              <div>
                <label className="label">Category *</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Status *</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-gray-100 dark:border-gray-800 pb-3">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Original Price (₹) *</label>
                <input type="number" min="1" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} className="input" placeholder="499" required />
              </div>
              <div>
                <label className="label">
                  Offer Price (₹) *
                  {discount > 0 && (
                    <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </label>
                <input type="number" min="1" value={form.offerPrice} onChange={(e) => set("offerPrice", e.target.value)} className="input" placeholder="99" required />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-gray-100 dark:border-gray-800 pb-3">Schedule</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date *</label>
                <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">End Date *</label>
                <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">Start Time *</label>
                <input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">End Time *</label>
                <input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} className="input" required />
              </div>
            </div>
          </div>

          {/* Capacity & Terms */}
          <div className="card p-5 space-y-4">
            <h2 className="section-title border-b border-gray-100 dark:border-gray-800 pb-3">Capacity & Terms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Total Capacity *</label>
                <input type="number" min="1" value={form.totalCapacity} onChange={(e) => set("totalCapacity", e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">Max Booking Per Customer *</label>
                <input type="number" min="1" value={form.maxBookingPerCustomer} onChange={(e) => set("maxBookingPerCustomer", e.target.value)} className="input" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Terms & Conditions</label>
                <textarea value={form.termsAndConditions} onChange={(e) => set("termsAndConditions", e.target.value)} className="input resize-none" rows={3} placeholder="Optional terms and conditions..." />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pb-4">
            <button type="button" onClick={() => navigate("/admin/offers")} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><FiSave size={15} /> {id ? "Update Offer" : "Create Offer"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
