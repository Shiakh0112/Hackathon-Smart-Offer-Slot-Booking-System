import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getBusiness, createBusiness, updateBusiness } from "../../api/services";
import type { Business } from "../../types";
import toast from "react-hot-toast";
import {
  FiEdit2, FiSave, FiX, FiPlus, FiBriefcase,
  FiUser, FiPhone, FiMail, FiMapPin, FiClock, FiLink
} from "react-icons/fi";

const BUSINESS_TYPES = ["Restaurant", "Gym", "Salon", "Clinic", "Coaching", "Turf", "Gaming Zone", "Spa", "Other"];

const emptyForm = {
  name: "", businessType: "Gym", ownerName: "", phone: "", email: "",
  address: "", city: "", logoUrl: "", openingTime: "09:00", closingTime: "21:00",
};

const typeColors: Record<string, string> = {
  Restaurant: "from-orange-500 to-red-500",
  Gym: "from-blue-500 to-indigo-500",
  Salon: "from-pink-500 to-rose-500",
  Clinic: "from-emerald-500 to-teal-500",
  Coaching: "from-violet-500 to-purple-500",
  Turf: "from-green-500 to-emerald-500",
  "Gaming Zone": "from-cyan-500 to-blue-500",
  Spa: "from-purple-500 to-pink-500",
  Other: "from-gray-500 to-slate-500",
};

export default function BusinessProfile() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [editing, setEditing] = useState<Business | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => getBusiness().then((r) => setBusinesses(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (b: Business) => {
    setEditing(b);
    setForm({ name: b.name, businessType: b.businessType, ownerName: b.ownerName,
      phone: b.phone, email: b.email, address: b.address, city: b.city,
      logoUrl: b.logoUrl || "", openingTime: b.openingTime, closingTime: b.closingTime });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) { await updateBusiness(editing.id, form); toast.success("Business updated!"); }
      else { await createBusiness(form); toast.success("Business created!"); }
      setShowForm(false);
      load();
    } catch { toast.error("Failed to save business"); }
    finally { setLoading(false); }
  };

  const fields = [
    { label: "Business Name", key: "name", type: "text", icon: FiBriefcase },
    { label: "Owner Name", key: "ownerName", type: "text", icon: FiUser },
    { label: "Phone", key: "phone", type: "tel", icon: FiPhone },
    { label: "Email", key: "email", type: "email", icon: FiMail },
    { label: "Address", key: "address", type: "text", icon: FiMapPin },
    { label: "City", key: "city", type: "text", icon: FiMapPin },
    { label: "Logo URL (optional)", key: "logoUrl", type: "url", icon: FiLink },
    { label: "Opening Time", key: "openingTime", type: "time", icon: FiClock },
    { label: "Closing Time", key: "closingTime", type: "time", icon: FiClock },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiBriefcase size={22} className="text-blue-500" />
              Business Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{businesses.length} business{businesses.length !== 1 ? "es" : ""} registered</p>
          </div>
          <button onClick={openCreate} className="btn-primary self-start sm:self-auto">
            <FiPlus size={16} /> Add Business
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-6 border-2 border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {editing ? <FiEdit2 size={16} className="text-blue-500" /> : <FiPlus size={16} className="text-blue-500" />}
                {editing ? "Edit Business" : "New Business"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiX size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(({ label, key, type, icon: Icon }) => (
                <div key={key}>
                  <label className="label flex items-center gap-1.5">
                    <Icon size={12} className="text-gray-400" /> {label}
                  </label>
                  <input
                    type={type}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input"
                    required={key !== "logoUrl"}
                  />
                </div>
              ))}
              <div>
                <label className="label flex items-center gap-1.5">
                  <FiBriefcase size={12} className="text-gray-400" /> Business Type
                </label>
                <select value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="input">
                  {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave size={15} /> Save</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.length === 0 && (
            <div className="card p-12 text-center md:col-span-2">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <FiBriefcase size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No businesses yet</p>
              <p className="text-gray-400 text-sm mt-1">Create one to get started</p>
            </div>
          )}
          {businesses.map((b) => (
            <div key={b.id} className="card overflow-hidden hover:shadow-md transition-all duration-300 group">
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${typeColors[b.businessType] ?? "from-gray-500 to-slate-500"} p-5`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {b.logoUrl ? (
                      <img src={b.logoUrl} alt={b.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border border-white/30">
                        {b.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{b.name}</h3>
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                        {b.businessType}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit(b)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <FiEdit2 size={14} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 grid grid-cols-2 gap-3">
                {[
                  { icon: FiUser, value: b.ownerName },
                  { icon: FiPhone, value: b.phone },
                  { icon: FiMail, value: b.email },
                  { icon: FiMapPin, value: b.city },
                  { icon: FiClock, value: `${b.openingTime} – ${b.closingTime}` },
                  { icon: FiMapPin, value: b.address },
                ].map(({ icon: Icon, value }, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-0">
                    <Icon size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
