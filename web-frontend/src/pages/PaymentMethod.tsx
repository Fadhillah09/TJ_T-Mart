import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

type PaymentMethodType = "va_online" | "cash_cod" | "cash_kasir";

export default function PaymentMethod() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 3. Sanitasi Query Params
  const amount = parseInt(searchParams.get("amount") ?? "0", 10);
  const type = searchParams.get("type") === "takeaway" ? "takeaway" : "delivery";
  const address = (searchParams.get("address") ?? "").slice(0, 200);
  const productId = searchParams.get("product_id") || undefined;
  const qty = searchParams.get("qty") || undefined;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("va_online");
  const [isLoading, setIsLoading] = useState(false);
  const [snapError, setSnapError] = useState<string | null>(null);

  const handlePayment = async () => {
    setSnapError(null);

    // 2. Validasi Amount di Frontend
    if (!amount || isNaN(amount) || amount <= 0) {
      setSnapError("Jumlah pembayaran tidak valid.");
      return;
    }

    if (selectedMethod !== "va_online") {
      setSnapError("Metode pembayaran non-Midtrans belum tersedia.");
      return;
    }

    // 1. Proteksi Double Submit
    setIsLoading(true);

    try {
      // 5. CSRF & 8. Timeout Request
      const response = await api.post(
        "/payment/snap-product",
        {
          total_amount: amount,
          product_id: productId,
          qty: qty,
        },
        {
          timeout: 15000,
        }
      );

      const data = response.data?.data || response.data;

      // 4. Validasi Response Snap Token
      if (!data?.snap_token || typeof data.snap_token !== "string") {
        throw new Error("Token Snap Midtrans tidak valid.");
      }

      const snapToken = data.snap_token;
      const orderId = data.order_id || `ORDER-${Date.now()}`;

      // 4. Panggil snap.pay
      window.snap.pay(snapToken, {
        onSuccess: (result: any) => {
          // 6. Jangan Expose Sensitive Data di URL
          navigate(
            `/order/success?method=online&status=paid&amount=${amount}&order_id=${orderId}&payment_method=Midtrans%20Online&type=${type}&address=${encodeURIComponent(
              address
            )}`
          );
        },
        onPending: (result: any) => {
          navigate(
            `/order/success?method=online&status=pending&amount=${amount}&order_id=${orderId}&payment_method=Midtrans%20Online&type=${type}&address=${encodeURIComponent(
              address
            )}`
          );
        },
        onError: (result: any) => {
          setSnapError("Pembayaran Midtrans gagal diproses.");
          setIsLoading(false);
        },
        onClose: () => {
          setIsLoading(false);
        },
      });
    } catch (err: any) {
      console.error("Payment method error:", err);
      // 7. Error Handling Terstruktur
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setSnapError("Permintaan timeout, silakan coba lagi.");
      } else if (err.response) {
        const msg = err.response.data?.message || "Terjadi kesalahan server.";
        setSnapError(msg);
      } else if (err.request) {
        setSnapError("Koneksi gagal, coba lagi.");
      } else {
        setSnapError(err.message || "Gagal membuat sesi pembayaran.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-extrabold text-[#5B000B] uppercase tracking-wide border-b pb-3">
          Metode Pembayaran
        </h2>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Pilih Metode
          </label>
          <div className="space-y-2">
            {[
              { id: "va_online", label: "Midtrans Online Payment" },
              { id: "cash_cod", label: "Bayar di Tempat (COD)" },
              { id: "cash_kasir", label: "Bayar di Kasir" },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => !isLoading && setSelectedMethod(m.id as PaymentMethodType)}
                className={`p-3 text-sm font-semibold rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === m.id
                    ? "border-red-600 bg-red-50 text-red-700 font-extrabold"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedMethod === m.id ? "border-red-600 bg-red-600" : "border-gray-300"
                  }`}
                >
                  {selectedMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-xs font-semibold text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Total Tagihan:</span>
            <span className="text-red-600 font-bold text-sm">
              Rp {amount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={handlePayment}
            className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-900/20"
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Konfirmasi Pembayaran</span>
            )}
          </button>

          {snapError && (
            <p className="text-xs text-red-600 font-semibold text-center mt-2" role="alert">
              {snapError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
