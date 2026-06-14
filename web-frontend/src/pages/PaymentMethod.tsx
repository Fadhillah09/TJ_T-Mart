import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import { CreditCard, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

export default function PaymentMethod() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse query params from checkout redirect
  const amount = parseInt(searchParams.get("amount") ?? "0", 10);
  const type = searchParams.get("type") === "takeaway" ? "takeaway" : "delivery";
  const address = (searchParams.get("address") ?? "").slice(0, 200);
  const orderIdFromUrl = searchParams.get("order_id") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [snapError, setSnapError] = useState<string | null>(null);

  // Validate amount on mount
  useEffect(() => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setSnapError("Data pembayaran tidak valid. Silakan ulangi proses checkout.");
    }
  }, [amount]);

  const handlePayment = async () => {
    setSnapError(null);

    if (!amount || isNaN(amount) || amount <= 0) {
      setSnapError("Jumlah pembayaran tidak valid.");
      return;
    }

    // Double submit guard
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await api.post(
        "/payment/snap-product",
        {
          total_amount: amount,
          product_id: null,
          qty: null,
        },
        { timeout: 15000 }
      );

      const snapToken = response.data?.snap_token;
      const orderId = orderIdFromUrl || response.data?.order_id || `ORDER-${Date.now()}`;

      if (!snapToken || typeof snapToken !== "string") {
        throw new Error("Token Snap Midtrans tidak valid.");
      }

      // Trigger Midtrans Snap popup
      window.snap.pay(snapToken, {
        onSuccess: () => {
          navigate(
            `/order/success?method=online&status=paid&amount=${amount}&order_id=${orderId}&payment_method=${encodeURIComponent("Midtrans Online")}&type=${type}&address=${encodeURIComponent(address)}`
          );
        },
        onPending: () => {
          navigate(
            `/order/success?method=online&status=pending&amount=${amount}&order_id=${orderId}&payment_method=${encodeURIComponent("Midtrans Online")}&type=${type}&address=${encodeURIComponent(address)}`
          );
        },
        onError: () => {
          setSnapError("Pembayaran Midtrans gagal diproses. Silakan coba lagi.");
          setIsLoading(false);
        },
        onClose: () => {
          setIsLoading(false);
        },
      });
    } catch (err: any) {
      console.error("Payment error:", err);
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setSnapError("Permintaan timeout, silakan coba lagi.");
      } else if (err.response) {
        setSnapError(err.response.data?.message || "Terjadi kesalahan server.");
      } else if (err.request) {
        setSnapError("Koneksi gagal, pastikan koneksi internet Anda stabil.");
      } else {
        setSnapError(err.message || "Gagal membuat sesi pembayaran.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <SubHeader />

      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-24">
        <div className="w-full max-w-md space-y-6">
          {/* Payment Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-red-100">
                    Pembayaran Online
                  </p>
                  <h2 className="text-lg font-black tracking-tight">Midtrans Payment</h2>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Amount Display */}
              <div className="bg-red-50/60 border border-red-100 rounded-2xl p-5 text-center space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total Tagihan
                </p>
                <p className="text-3xl font-black text-red-600 tracking-tight">
                  {formatRupiah(amount)}
                </p>
                {orderIdFromUrl && (
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">
                    Invoice: {orderIdFromUrl}
                  </p>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <p className="text-[10px] text-emerald-700 font-semibold leading-snug">
                  Pembayaran dijamin aman melalui gateway Midtrans yang terenkripsi.
                </p>
              </div>

              {/* Error Alert */}
              {snapError && (
                <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 font-semibold leading-snug" role="alert">
                    {snapError}
                  </p>
                </div>
              )}

              {/* Payment Button */}
              <button
                type="button"
                disabled={isLoading || !amount || amount <= 0}
                onClick={handlePayment}
                className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 ${
                  isLoading || !amount || amount <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-900/20"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memproses Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>Bayar Sekarang</span>
                  </>
                )}
              </button>

              {/* Back button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate(-1)}
                className="w-full py-3 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider"
              >
                Kembali
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <p className="text-[9px] text-gray-400 font-medium text-center leading-normal px-4">
            Anda akan diarahkan ke halaman pembayaran Midtrans. Setelah pembayaran selesai, Anda akan otomatis kembali ke halaman konfirmasi pesanan.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
