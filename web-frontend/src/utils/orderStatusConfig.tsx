import React from "react";
import { Compass, UserCheck, Store, CheckCircle, Clock, XCircle } from "lucide-react";

export interface StatusConfig {
  heroGradient: string;
  badgeColor: string;
  badgeText: string;
  timelineColor: string;
  receiptLabel: string;
  receiptColor: string;
  icon: React.ReactNode;
  desc: string;
}

export function getStatusConfig(status: string, address?: string | null, paymentMethod?: string | null): StatusConfig {
  const match = address?.match(/Gedung\s*(12|11|10|[1-9]|[A-F])/i);
  const buildingName = match ? `Gedung ${match[1].toUpperCase()}` : "";

  switch (status) {
    case "WAITING_COURIER_ACCEPTANCE":
      return {
        heroGradient: "from-[#5B000B] to-[#930014]",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        badgeText: "MENCARI KURIR...",
        timelineColor: "text-amber-500 border-amber-500 bg-amber-500",
        receiptLabel: "PENDING / DIPROSES",
        receiptColor: "bg-amber-50 text-amber-700 border-amber-200/50",
        icon: <Compass className="w-5 h-5 text-amber-400 animate-spin" />,
        desc: "Sistem sedang mencari kurir terdekat untuk pesanan Anda.",
      };
    case "COURIER_ACCEPTED":
    case "COURIER_TO_STORE":
      return {
        heroGradient: "from-[#5B000B] to-[#930014]",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        badgeText: "KURIR DITEMUKAN",
        timelineColor: "text-amber-500 border-amber-500 bg-amber-500",
        receiptLabel: "PENDING / DIPROSES",
        receiptColor: "bg-amber-50 text-amber-700 border-amber-200/50",
        icon: <UserCheck className="w-5 h-5 text-amber-400 animate-bounce" />,
        desc: "Kurir sedang menuju T-Mart untuk mengambil pesanan Anda.",
      };
    case "SHOPPING":
      return {
        heroGradient: "from-[#5B000B] to-[#930014]",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        badgeText: "BELANJA PRODUK",
        timelineColor: "text-amber-500 border-amber-500 bg-amber-500",
        receiptLabel: "PENDING / DIPROSES",
        receiptColor: "bg-amber-50 text-amber-700 border-amber-200/50",
        icon: <Store className="w-5 h-5 text-amber-400" />,
        desc: "Kurir Anda sedang berbelanja dan mengemas produk Anda.",
      };
    case "DELIVERING":
      return {
        heroGradient: "from-[#5B000B] to-[#930014]",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        badgeText: "PESANAN DIANTAR",
        timelineColor: "text-amber-500 border-amber-500 bg-amber-500",
        receiptLabel: "PENDING / DIPROSES",
        receiptColor: "bg-amber-50 text-amber-700 border-amber-200/50",
        icon: <Compass className="w-5 h-5 text-amber-400 animate-pulse" />,
        desc: `Kurir menuju lokasi Anda${buildingName ? ` (${buildingName})` : ""}.`,
      };
    case "COMPLETED":
      return {
        heroGradient: "from-emerald-700 to-emerald-600",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        badgeText: "PESANAN SELESAI",
        timelineColor: "text-emerald-500 border-emerald-500 bg-emerald-500",
        receiptLabel: "PAID / BERHASIL",
        receiptColor: "bg-green-50 text-green-700 border-green-200/50",
        icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        desc: "Pesanan telah berhasil diantar ke alamat Anda.",
      };
    case "CANCELLED":
      const isCOD = paymentMethod?.toLowerCase().includes("cod") || paymentMethod?.toLowerCase().includes("tunai");
      return {
        heroGradient: "from-gray-800 to-gray-700",
        badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
        badgeText: "PESANAN DIBATALKAN",
        timelineColor: "text-red-500 border-red-500 bg-red-500",
        receiptLabel: "REFUNDED / BATAL",
        receiptColor: "bg-red-50 text-red-700 border-red-200/50",
        icon: <XCircle className="w-5 h-5 text-red-400" />,
        desc: isCOD
          ? "Pesanan Anda telah dibatalkan karena tidak menemukan kurir."
          : "Dana sedang dikembalikan secara otomatis ke rekening Anda.",
      };
    default:
      return {
        heroGradient: "from-[#5B000B] to-[#930014]",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        badgeText: "PROSES PESANAN",
        timelineColor: "text-amber-500 border-amber-500 bg-amber-500",
        receiptLabel: "PENDING / DIPROSES",
        receiptColor: "bg-amber-50 text-amber-700 border-amber-200/50",
        icon: <Clock className="w-5 h-5 text-amber-400" />,
        desc: "Pesanan sedang diproses.",
      };
  }
}
