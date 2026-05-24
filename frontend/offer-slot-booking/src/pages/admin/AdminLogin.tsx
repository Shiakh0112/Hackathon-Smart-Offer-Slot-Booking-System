import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginApi } from "../../api/services";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@offers.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      login({ ...res.data, token: res.data.token });
      toast.success("Welcome back! 👋");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060b18]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
      </div>

      <div className="relative w-full max-w-md px-4 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-5">
            <div className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-2xl scale-150" />
            <div className="relative inline-flex items-center justify-center w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/50 animate-float">
              <HiSparkles size={30} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">OfferSlot</h1>
          <p className="text-gray-500 mt-1.5 text-sm font-medium">Smart Offer Slot Booking System</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h2 className="text-xl font-black text-white mb-1">Admin Login</h2>
          <p className="text-gray-500 text-sm mb-7">Sign in to manage your offers</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/60 transition-all text-sm hover:border-white/20"
                  placeholder="admin@offers.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-11 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/60 transition-all text-sm hover:border-white/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8">
            <p className="text-xs text-gray-600 text-center">
              Default: <span className="text-gray-400 font-mono">admin@offers.com</span> / <span className="text-gray-400 font-mono">Admin@123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
