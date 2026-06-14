import React from "react";
import { CheckCircle, XCircle, Clock, Printer, ArrowRight } from "lucide-react";
import { currency } from "@/utils/produkUtils";
import { StatusConfig } from "@/utils/orderStatusConfig";

interface OrderReceiptProps {
  status: string;
  orderDetail: any;
  paymentMethod: string;
  addressParam: string;
  itemsList: any[];
  serviceFee: number;
  shippingFee: number;
  totalAmount: number;
  statusConfig: StatusConfig;
  handlePrint: () => void;
  navigateHome: () => void;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({
  status,
  orderDetail,
  paymentMethod,
  addressParam,
  itemsList,
  serviceFee,
  shippingFee,
  totalAmount,
  statusConfig,
  handlePrint,
  navigateHome,
}) => {
  const formatDate = (dateStr?: string) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const subtotalAmount = itemsList.reduce((sum: number, item: any) => sum + item.subtotal, 0);

  return (
    <div className="space-y-6">
      {/* Digital Print Receipt */}
      <div className="relative bg-white border border-gray-200 shadow-2xl rounded-b-3xl overflow-hidden print:border-none print:shadow-none animate-fadeIn">
        {/* Jagged Receipt Edge Top Effect */}
        <div
          className="absolute top-0 left-0 right-0 h-4 bg-repeat-x z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'%3E%3Cpolygon points='0,8 4,0 8,8 12,0 16,8' fill='%23f3f4f6'/%3E%3C/svg%3E")`,
            backgroundSize: "16px 8px",
          }}
        />
        <div
          className="absolute top-1 left-0 right-0 h-3 bg-repeat-x z-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'%3E%3Cpolygon points='0,8 4,0 8,8 12,0 16,8' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: "16px 8px",
          }}
        />

        <div className="pt-8 p-6 space-y-6">
          {/* Header Struk */}
          <div className="text-center pb-5 border-b border-dashed border-gray-200 space-y-2">
            <div className="flex justify-center mb-2">
              {status === "CANCELLED" ? (
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <XCircle size={28} />
                </div>
              ) : status === "COMPLETED" ? (
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={28} />
                </div>
              ) : (
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center animate-pulse">
                  <Clock size={28} />
                </div>
              )}
            </div>

            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              Status Pembayaran
            </p>

            <div className="flex items-center justify-center gap-1.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border ${statusConfig.receiptColor}`}
              >
                {statusConfig.receiptLabel}
              </span>
            </div>
          </div>

          {/* Info Transaksi */}
          <div className="space-y-3.5 text-xs border-b border-dashed border-gray-200 pb-5">
            <div className="flex justify-between items-start gap-1">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                Waktu Transaksi
              </span>
              <span className="text-gray-900 font-extrabold text-right">
                {formatDate(orderDetail?.tanggal_pesan)}
              </span>
            </div>
            <div className="flex justify-between items-start gap-1">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                Metode Pembayaran
              </span>
              <span className="text-gray-900 font-extrabold text-right">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-start gap-1">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                Alamat Tujuan
              </span>
              <span className="text-gray-900 font-extrabold text-right leading-relaxed max-w-[150px]">
                {addressParam || orderDetail?.alamat_pengantaran || "Detail lokasi tidak tersedia"}
              </span>
            </div>
          </div>

          {/* Rincian Harga */}
          <div className="space-y-3.5 text-xs border-b border-dashed border-gray-200 pb-5">
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                Subtotal Belanja
              </span>
              <span className="text-gray-900 font-extrabold">{currency(subtotalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                Biaya Layanan
              </span>
              <span className="text-gray-900 font-extrabold">{currency(serviceFee)}</span>
            </div>
            {shippingFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                  Ongkos Kirim
                </span>
                <span className="text-gray-900 font-extrabold">{currency(shippingFee)}</span>
              </div>
            )}
          </div>

          {/* Total Akhir */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
              TOTAL AKHIR
            </span>
            <span className="text-xl font-black text-[#930014]">{currency(totalAmount)}</span>
          </div>
        </div>

        {/* Jagged Receipt Edge Bottom Effect */}
        <div
          className="h-4 bg-repeat-x z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'%3E%3Cpolygon points='0,0 4,8 8,0 12,8 16,0' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: "16px 8px",
          }}
        />
      </div>

      {/* Tombol Aksi */}
      <div className="space-y-3.5 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 active:scale-[0.98] text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-gray-200 cursor-pointer"
        >
          <Printer size={16} />
          Cetak Struk Digital
        </button>

        <button
          type="button"
          onClick={navigateHome}
          className="w-full py-4 bg-[#930014] hover:bg-[#5B000B] active:scale-[0.98] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 border border-transparent cursor-pointer"
        >
          Kembali ke Beranda
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
