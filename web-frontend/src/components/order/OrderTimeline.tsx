import React from "react";
import { CheckCircle } from "lucide-react";

interface OrderTimelineProps {
  sessionStatus: string;
  heroGradient: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  sessionStatus,
  heroGradient,
}) => {
  const getTimelineSteps = () => {
    const steps = [
      { name: "Pesanan Dibuat", status: "completed" },
      { name: "Kurir Ditemukan", status: "pending" },
      { name: "Kurir Menuju T-Mart", status: "pending" },
      { name: "Belanja Produk", status: "pending" },
      { name: "Pesanan Diantar", status: "pending" },
      { name: "Pesanan Selesai", status: "pending" },
    ];

    if (sessionStatus === "CANCELLED") {
      return steps.map((s, idx) =>
        idx === 0 ? { ...s, status: "completed" } : { ...s, status: "pending" }
      );
    }

    if (sessionStatus === "COMPLETED") {
      return steps.map((s) => ({ ...s, status: "completed" }));
    }

    const mapIndex: Record<string, number> = {
      WAITING_COURIER_ACCEPTANCE: 0,
      COURIER_ACCEPTED: 1,
      COURIER_TO_STORE: 2,
      SHOPPING: 3,
      DELIVERING: 4,
    };

    const activeIndex = mapIndex[sessionStatus] ?? 0;
    return steps.map((s, idx) => {
      if (idx < activeIndex) return { ...s, status: "completed" };
      if (idx === activeIndex) return { ...s, status: "current" };
      return { ...s, status: "pending" };
    });
  };

  const timelineSteps = getTimelineSteps();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6">
      <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b pb-4">
        Status Perjalanan Pesanan
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-2">
        {timelineSteps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-2.5">
            {/* Circle status wrapper */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step.status === "completed"
                  ? "bg-green-50 border-green-500 text-green-600 shadow-md shadow-green-500/10"
                  : step.status === "current"
                  ? `bg-gradient-to-br ${heroGradient} text-white border-transparent shadow-md animate-pulse`
                  : "bg-gray-50 border-gray-200 text-gray-300"
              }`}
            >
              {step.status === "completed" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-xs font-black">{idx + 1}</span>
              )}
            </div>

            <div className="space-y-0.5">
              <p
                className={`text-[10px] font-black tracking-wide uppercase ${
                  step.status === "completed"
                    ? "text-green-600"
                    : step.status === "current"
                    ? "text-gray-900 font-extrabold"
                    : "text-gray-400"
                }`}
              >
                {step.name}
              </p>
              {step.status === "current" && (
                <span className="inline-block px-1.5 py-0.5 bg-red-50 text-[8px] font-bold text-red-700 rounded-full">
                  Aktif
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
