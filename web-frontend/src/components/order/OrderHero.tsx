import React from "react";
import { FileText, Store, CreditCard } from "lucide-react";
import { StatusConfig } from "@/utils/orderStatusConfig";

interface OrderHeroProps {
  status: string;
  countdownTime: number;
  orderIdParam: string;
  martName: string;
  paymentMethod: string;
  statusConfig: StatusConfig;
  simulateCourierAccepted: (orderId: string) => void;
  simulateTimeout: (orderId: string) => void;
}

export const OrderHero: React.FC<OrderHeroProps> = ({
  status,
  countdownTime,
  orderIdParam,
  martName,
  paymentMethod,
  statusConfig,
  simulateCourierAccepted,
  simulateTimeout,
}) => {
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`bg-gradient-to-br ${statusConfig.heroGradient} text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[240px] border border-white/10 animate-fadeIn print:hidden`}
    >
      <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border ${statusConfig.badgeColor} backdrop-blur-md`}
            >
              {statusConfig.icon}
              {statusConfig.badgeText}
            </span>

            {status === "WAITING_COURIER_ACCEPTANCE" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 text-amber-300 text-xs font-extrabold rounded-full border border-amber-500/20 backdrop-blur-md">
                Mencari Kurir: {formatCountdown(countdownTime)}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight uppercase">
            {status === "CANCELLED" ? "Pesanan Anda Dibatalkan" : "Pesanan Anda Sedang Diproses"}
          </h1>
          <p className="text-xs text-red-100 font-bold max-w-2xl leading-relaxed min-h-[1.5rem]">
            {statusConfig.desc}
          </p>
        </div>

        {/* Quick action buttons on hero for interactive testing */}
        <div className="flex flex-wrap gap-2 shrink-0 min-h-[40px]">
          {status === "WAITING_COURIER_ACCEPTANCE" && (
            <>
              <button
                type="button"
                onClick={() => simulateCourierAccepted(orderIdParam)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black transition-all active:scale-95 shadow-md shadow-green-950/20 border border-green-400 cursor-pointer"
              >
                Simulasikan Terima Kurir 🛵
              </button>
              <button
                type="button"
                onClick={() => simulateTimeout(orderIdParam)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black transition-all active:scale-95 shadow-md shadow-red-950/20 border border-red-400 cursor-pointer"
              >
                Simulasikan Timeout/Cancel ❌
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-2 mt-8 border-t border-white/10 pt-4 text-xs font-bold text-red-100">
        <span className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
          <FileText className="w-3.5 h-3.5" />
          Invoice #{orderIdParam || "N/A"}
        </span>
        <span className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
          <Store className="w-3.5 h-3.5" />
          Toko: {martName}
        </span>
        <span className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
          <CreditCard className="w-3.5 h-3.5" />
          Metode: {paymentMethod === "Midtrans Online" ? "Midtrans" : "COD (Tunai)"}
        </span>
      </div>
    </div>
  );
};
