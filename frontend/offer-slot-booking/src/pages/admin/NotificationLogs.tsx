import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getNotifications } from "../../api/services";
import type { NotificationLog } from "../../types";
import { FiBell, FiRefreshCw, FiMessageCircle, FiMail, FiPhone, FiCheckCircle, FiXCircle } from "react-icons/fi";

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  WhatsApp: { icon: <FiMessageCircle size={14} />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  SMS:      { icon: <FiPhone size={14} />,         color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-900/20" },
  Email:    { icon: <FiMail size={14} />,          color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
};

export default function NotificationLogs() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getNotifications().then((r) => setLogs(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const sent = logs.filter((l) => l.status === "Sent").length;

  return (
    <AdminLayout>
      <div className="space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiBell size={22} className="text-amber-500" />
              Notification Log
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Mock WhatsApp / SMS / Email notifications sent to customers
            </p>
          </div>
          <button onClick={load} className="btn-secondary self-start sm:self-auto">
            <FiRefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Sent", value: logs.length, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
            { label: "Successful", value: sent, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Failed", value: logs.length - sent, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`card p-4 text-center ${bg} border-0`}>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Log Table */}
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
                    {["Type", "Recipient", "Message", "Status", "Sent At"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {logs.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-16 text-center">
                      <FiBell size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                      <p className="text-gray-400 font-medium">No notifications yet</p>
                      <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Notifications appear here when bookings are made</p>
                    </td></tr>
                  )}
                  {logs.map((log) => {
                    const cfg = typeConfig[log.type] ?? typeConfig.WhatsApp;
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
                            {cfg.icon} {log.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                            {log.recipient}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs max-w-xs truncate">{log.message}</td>
                        <td className="px-4 py-3">
                          {log.status === "Sent" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <FiCheckCircle size={12} /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                              <FiXCircle size={12} /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(log.sentAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
