import React from "react";
import { CartItem } from "@/types";
import { Store, MapPin } from "lucide-react";

interface CartItemGroupProps {
  items: CartItem[];
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

const resolveGambarUrl = (imagePath?: string): string => {
  if (!imagePath) return "https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=150&q=80";
  if (imagePath.startsWith("http")) return imagePath;
  const filename = imagePath.split("/").pop() || "";
  return `/produk_assets/${filename}`;
};

export const CartItemGroup: React.FC<CartItemGroupProps> = React.memo(({ items }) => {
  if (items.length === 0) return null;

  // Group items by mart for clear visual organization
  const grouped = items.reduce<Record<string, { martName: string; martAddress: string; items: CartItem[] }>>(
    (acc, item) => {
      const key = String(item.mart_id);
      if (!acc[key]) {
        acc[key] = { martName: item.mart_name, martAddress: item.mart_address || "", items: [] };
      }
      acc[key].items.push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-[#5B000B] uppercase tracking-wider">
        Daftar Belanja
      </h3>

      {Object.entries(grouped).map(([martId, group]) => (
        <div
          key={martId}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Mart Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50/60 border-b border-red-100/50">
            <div className="w-7 h-7 rounded-lg bg-[#930014]/10 flex items-center justify-center shrink-0">
              <Store size={14} className="text-[#930014]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#930014] truncate leading-tight">
                {group.martName}
              </p>
              {group.martAddress && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={9} className="text-gray-400 shrink-0" />
                  <p className="text-[10px] text-gray-500 font-medium truncate leading-tight max-w-[280px]">
                    {group.martAddress}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Item List */}
          <div className="divide-y divide-gray-50/80 px-4">
            {group.items.map((item) => (
              <div key={item.id} className="flex gap-3.5 py-4 first:pt-4 last:pb-4">
                {/* Thumbnail */}
                <div className="w-[72px] h-[72px] rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shrink-0 shadow-sm">
                  <img
                    src={resolveGambarUrl(item.image_url)}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=150&q=80";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                      {item.product_name}
                    </h4>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      {formatRupiah(item.price)} × {item.qty}
                    </p>
                  </div>

                  {/* Qty badge */}
                  <span className="inline-flex items-center w-fit mt-2 px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600">
                    Qty: {item.qty}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="text-right text-sm font-extrabold text-[#930014] self-center shrink-0">
                  {formatRupiah(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

CartItemGroup.displayName = "CartItemGroup";
