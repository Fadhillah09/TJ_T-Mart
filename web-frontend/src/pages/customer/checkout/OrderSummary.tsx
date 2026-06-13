import React, { useState, useMemo } from "react";
import { CheckoutForm, CheckoutErrors } from "@/types";
import { debounce } from "@/utils/helpers";
import { Banknote, CreditCard } from "lucide-react";

interface OrderSummaryProps {
  totals: { subtotal: number; ongkos: number; layanan: number; total: number };
  isSubmitting: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
  form: CheckoutForm;
  onChange: (field: keyof CheckoutForm, value: any) => void;
  errors: CheckoutErrors;
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

export const OrderSummary: React.FC<OrderSummaryProps> = React.memo(({
  totals,
  isSubmitting,
  isDisabled,
  onSubmit,
  form,
  onChange,
  errors,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [noteInput, setNoteInput] = useState(form.note);

  // Debounce onChange note to prevent frequent re-renders
  const debouncedChangeNote = useMemo(
    () => debounce((val: string) => onChange("note", val), 300),
    [onChange]
  );

  const handleNoteChange = (val: string) => {
    setNoteInput(val);
    debouncedChangeNote(val);
  };

  return (
    <aside className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 lg:sticky lg:top-36 h-fit">
      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
        Ringkasan Belanja
      </h3>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Metode Pembayaran
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-label="Metode Bayar COD"
            aria-pressed={form.payment_method === "cod"}
            onClick={() => onChange("payment_method", "cod")}
            className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
              form.payment_method === "cod"
                ? "border-red-600 bg-red-50 text-red-700 font-extrabold"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Banknote size={15} />
            <span>Bayar di Tempat (COD)</span>
          </button>
          <button
            type="button"
            aria-label="Metode Bayar Transfer"
            aria-pressed={form.payment_method === "transfer"}
            onClick={() => onChange("payment_method", "transfer")}
            className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
              form.payment_method === "transfer"
                ? "border-red-600 bg-red-50 text-red-700 font-extrabold"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            <CreditCard size={15} />
            <span>Transfer (Midtrans)</span>
          </button>
        </div>
      </div>

      {/* Catatan Pesanan */}
      <div className="space-y-1">
        <label htmlFor="input-note" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Catatan Pesanan (Opsional)
        </label>
        <textarea
          id="input-note"
          rows={2}
          maxLength={255}
          placeholder="Contoh: Titip di pos satpam asrama"
          value={noteInput}
          onChange={(e) => handleNoteChange(e.target.value)}
          className="w-full p-3 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white resize-none"
        />
      </div>

      {/* Breakdown */}
      <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs font-semibold text-gray-600">
        <div className="flex justify-between">
          <span>Total Harga Produk</span>
          <span>{formatRupiah(totals.subtotal)}</span>
        </div>
        {totals.ongkos > 0 && (
          <div className="flex justify-between">
            <span>Ongkos Kirim</span>
            <span>{formatRupiah(totals.ongkos)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Biaya Layanan</span>
          <span>{formatRupiah(totals.layanan)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-800">
          <span>Total Tagihan</span>
          <span className="text-red-600 font-extrabold text-base">
            {formatRupiah(totals.total)}
          </span>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="flex items-start gap-2 pt-2">
        <input
          id="agree-checkbox"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300 mt-0.5 cursor-pointer"
        />
        <label htmlFor="agree-checkbox" className="text-[10px] text-gray-500 font-medium leading-snug cursor-pointer select-none">
          Saya setuju dengan <span className="text-red-600 font-bold hover:underline">Syarat & Ketentuan</span> yang berlaku di Tel-U Mart.
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={isDisabled || isSubmitting || !agreed}
        aria-disabled={isDisabled || isSubmitting || !agreed ? "true" : "false"}
        onClick={onSubmit}
        className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 ${
          isDisabled || isSubmitting || !agreed
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-lg shadow-red-900/20"
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
            <span>Memproses...</span>
          </>
        ) : (
          <span>Buat Pesanan Sekarang</span>
        )}
      </button>

      <p className="text-[9px] text-gray-400 font-medium text-center leading-normal">
        Dengan menekan tombol di atas, pesanan Anda akan langsung diteruskan ke pihak Mart terkait.
      </p>
    </aside>
  );
});

OrderSummary.displayName = "OrderSummary";
