import {
  FiCheckCircle, FiClock, FiPauseCircle, FiXCircle,
  FiAlertCircle, FiSlash, FiCheck, FiEyeOff
} from "react-icons/fi";

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Active:    { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800", icon: <FiCheckCircle size={11} /> },
  Draft:     { color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700", icon: <FiEyeOff size={11} /> },
  Paused:    { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800", icon: <FiPauseCircle size={11} /> },
  Expired:   { color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800", icon: <FiAlertCircle size={11} /> },
  Cancelled: { color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800", icon: <FiXCircle size={11} /> },
  Available: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800", icon: <FiCheckCircle size={11} /> },
  Full:      { color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800", icon: <FiSlash size={11} /> },
  Closed:    { color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700", icon: <FiXCircle size={11} /> },
  Pending:   { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800", icon: <FiClock size={11} /> },
  Confirmed: { color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 ring-1 ring-violet-200 dark:ring-violet-800", icon: <FiCheckCircle size={11} /> },
  Completed: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800", icon: <FiCheck size={11} /> },
  "No Show": { color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700", icon: <FiAlertCircle size={11} /> },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? { color: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", icon: null };
  return (
    <span className={`badge ${cfg.color}`}>
      {cfg.icon}
      {status}
    </span>
  );
}
