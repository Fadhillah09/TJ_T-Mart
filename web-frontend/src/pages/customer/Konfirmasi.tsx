import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";

const KonfirmasiPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.order_id || "ORD-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <>
      <Header />
      <SubHeader />
      <main className="max-w-md mx-auto px-4 pt-36 pb-24 text-center min-h-[70vh] flex flex-col justify-center items-center">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-100 shadow-lg shadow-green-100/50 animate-bounce">
          <CheckCircle size={44} strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl font-black text-gray-900 leading-tight">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-xs text-gray-500 mt-2 font-medium max-w-sm">
          Terima kasih atas pembelian Anda. Pesanan Anda telah diterima oleh pihak Mart dan sedang diproses.
        </p>

        {/* Info Box */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 w-full mt-6 space-y-2 text-left text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-gray-400">ID Pesanan:</span>
            <span className="text-gray-800 font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-gray-400">Status:</span>
            <span className="text-green-600 font-extrabold uppercase">Pending</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 mt-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-950/10 flex items-center justify-center gap-1.5"
          >
            <span>Kembali ke Beranda</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default KonfirmasiPage;
