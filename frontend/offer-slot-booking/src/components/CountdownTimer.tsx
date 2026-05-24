import { useEffect, useState } from "react";
import { FiClock, FiAlertCircle } from "react-icons/fi";

interface CountdownProps { endDate: string; }

export default function CountdownTimer({ endDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [state, setState] = useState<"normal" | "urgent" | "expired">("normal");

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Expired"); setState("expired"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setState(diff < 3600000 ? "urgent" : "normal");
      if (d > 0) setTimeLeft(`${d}d ${h}h`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m`);
      else setTimeLeft(`${m}m ${s}s`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (state === "expired")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/15 backdrop-blur-sm px-2.5 py-1 rounded-full border border-red-500/20">
        <FiAlertCircle size={10} /> Expired
      </span>
    );

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${
      state === "urgent"
        ? "text-red-400 bg-red-500/15 border border-red-500/20 animate-pulse"
        : "text-amber-300 bg-amber-500/15 border border-amber-500/20"
    }`}>
      <FiClock size={10} />
      {timeLeft}
    </span>
  );
}
