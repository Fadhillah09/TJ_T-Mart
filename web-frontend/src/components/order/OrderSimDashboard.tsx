import React from "react";

interface OrderSimDashboardProps {
  status: string;
  elapsedSeconds: number;
  orderIdParam: string;
  simulateCourierAccepted: (orderId: string) => void;
  simulateTimeout: (orderId: string) => void;
  onSpeedUp: () => void;
}

export const OrderSimDashboard: React.FC<OrderSimDashboardProps> = ({
  status,
  elapsedSeconds,
  orderIdParam,
  simulateCourierAccepted,
  simulateTimeout,
  onSpeedUp,
}) => {
  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white/95 backdrop-blur border border-red-200 p-3 rounded-2xl shadow-2xl space-y-2 max-w-xs text-xs font-bold text-gray-800 print:hidden">
      <p className="text-[10px] uppercase font-black tracking-wider text-[#930014] border-b pb-1.5">
        Simulation Control Hub
      </p>
      <div className="space-y-1">
        <p className="text-[9px] text-gray-500 font-medium">
          Status: <span className="font-extrabold text-gray-800">{status}</span>
        </p>
        <p className="text-[9px] text-gray-500 font-medium">
          Elapsed: <span className="font-extrabold text-gray-800">{elapsedSeconds}s</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => simulateCourierAccepted(orderIdParam)}
          disabled={status !== "WAITING_COURIER_ACCEPTANCE"}
          className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-[9px] font-black border border-green-200/50 disabled:opacity-50 cursor-pointer"
        >
          Driver Found
        </button>
        <button
          type="button"
          onClick={() => simulateTimeout(orderIdParam)}
          disabled={status === "CANCELLED" || status === "COMPLETED"}
          className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[9px] font-black border border-red-200/50 disabled:opacity-50 cursor-pointer"
        >
          Force Cancel
        </button>
        <button
          type="button"
          onClick={onSpeedUp}
          disabled={status === "CANCELLED" || status === "COMPLETED"}
          className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[9px] font-black border border-amber-200/50 disabled:opacity-50 cursor-pointer col-span-2 text-center"
        >
          Speed Up 🚀
        </button>
      </div>
    </div>
  );
};
