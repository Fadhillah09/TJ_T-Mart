import React from "react";
import { currency } from "@/utils/produkUtils";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
  image_url: string;
  gambar?: string;
  stock: number;
}

interface OrderItemsListProps {
  itemsList: OrderItem[];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ itemsList }) => {
  const resolveItemImage = (item: OrderItem) => {
    if (item.image_url) return item.image_url;
    const raw = item.gambar || "";
    if (!raw) return "https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=100&q=80";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.startsWith("produk/")) {
      return `http://127.0.0.1:8000/storage/${raw}`;
    }
    const filename = raw.split("/").pop();
    return `/produk_assets/${filename}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">
          Daftar Belanja
        </h2>
        <span className="text-[10px] bg-red-50 text-[#930014] font-black px-2.5 py-1 rounded-full uppercase border border-red-200/50">
          {itemsList.length} Item
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itemsList.map((item, idx) => {
          const image = resolveItemImage(item);
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-gray-100 flex gap-4 hover:border-red-100 hover:shadow-md transition-all duration-300 bg-white"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-50 bg-gray-50">
                <img
                  src={image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-w-0 space-y-1">
                <div>
                  <p className="font-extrabold text-gray-900 text-xs truncate uppercase leading-tight">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200/60">
                      Tersedia
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold">Stok: {item.stock}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <p className="text-[10px] text-gray-400 font-bold">
                    {currency(item.price)} <span className="text-gray-900">x {item.qty}</span>
                  </p>
                  <p className="font-extrabold text-xs text-[#930014]">
                    {currency(item.subtotal)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
