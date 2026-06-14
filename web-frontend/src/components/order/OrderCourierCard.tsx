import React from "react";
import { User, Phone, MessageSquare } from "lucide-react";

interface OrderCourierCardProps {
  courier: any;
  callLoading: boolean;
  chatLoading: boolean;
  handleCallDriver: () => void;
  handleChatDriver: () => void;
}

export const OrderCourierCard: React.FC<OrderCourierCardProps> = ({
  courier,
  callLoading,
  chatLoading,
  handleCallDriver,
  handleChatDriver,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
      <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm shrink-0">
          <User size={28} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <h4 className="font-black text-gray-900 text-base">{courier.name}</h4>
            <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ⭐ {courier.rating}
            </span>
          </div>
          <div className="flex justify-center md:justify-start">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#5B000B]/5 text-[#5B000B] border border-[#5B000B]/10">
              🚶 Kurir Berjalan Kaki
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
        <button
          type="button"
          onClick={handleCallDriver}
          disabled={callLoading}
          className="flex-1 md:flex-none px-4 py-3 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-200 disabled:opacity-50"
        >
          {callLoading ? (
            <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent animate-spin rounded-full" />
          ) : (
            <Phone className="w-4 h-4" />
          )}
          Telepon
        </button>

        <button
          type="button"
          onClick={handleChatDriver}
          disabled={chatLoading}
          className="flex-1 md:flex-none px-4 py-3 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-green-400 disabled:opacity-50"
        >
          {chatLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            <MessageSquare className="w-4 h-4" />
          )}
          Chat WA
        </button>
      </div>
    </div>
  );
};
