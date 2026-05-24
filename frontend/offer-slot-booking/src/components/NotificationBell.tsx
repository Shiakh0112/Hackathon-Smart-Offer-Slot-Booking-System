import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getNotifications } from "../api/services";
import type { NotificationLog } from "../types";
import { FiBell, FiMessageCircle, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";

export default function NotificationBell() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = () => {
    getNotifications().then((r) => {
      setLogs(r.data.slice(0, 5));
      setUnread(r.data.length);
    }).catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const typeIcon = (type: string) => {
    if (type === "WhatsApp") return <FiMessageCircle size={12} className="text-emerald-500" />;
    if (type === "SMS") return <FiPhone size={12} className="text-blue-500" />;
    return <FiMail size={12} className="text-violet-500" />;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setUnread(0); }}
        className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      >
        <FiBell size={17} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-slide-up">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <FiBell size={14} className="text-amber-500" /> Notifications
            </h3>
            <span className="text-xs text-gray-400">{logs.length} recent</span>
          </div>

          {logs.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No notifications yet</div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {logs.map((log) => (
                <div key={log.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {typeIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">{log.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">{new Date(log.sentAt).toLocaleTimeString()}</span>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{log.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800 p-2">
            <Link
              to="/admin/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-violet-600 dark:text-violet-400 py-2 hover:bg-violet-50 dark:hover:bg-violet-900/10 rounded-xl transition-colors"
            >
              View all notifications <FiArrowRight size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
