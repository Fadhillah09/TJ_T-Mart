import React from "react";
import { CartItem } from "@/types";
import { Store } from "lucide-react";

interface CartItemGroupProps {
  grouped: Record<number, { martName: string; items: CartItem[] }>;
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

export const CartItemGroup: React.FC<CartItemGroupProps> = React.memo(({ grouped }) => {
  const groupKeys = Object.keys(grouped).map(Number);

  if (groupKeys.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-[#5B000B] uppercase tracking-wider">
        Daftar Belanja
      </h3>

      {groupKeys.map((martId) => {
        const { martName, items } = grouped[martId];

        return (
          <div
            key={martId}
            className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm space-y-3"
          >
            {/* Header Mart */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 text-xs font-bold text-gray-700">
              <Store size={14} className="text-red-600" />
              <span>{martName || `Mart ${martId}`}</span>
            </div>

            {/* List Item */}
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  {/* Thumbnail Image */}
                  <img
                    src={resolveGambarUrl(item.image_url)}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=150&q=80";
                    }}
                  />

                  {/* Detail Item */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
                      {item.product_name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">
                      {item.qty} × {formatRupiah(item.price)}
                    </p>
                  </div>

                  {/* Subtotal Item */}
                  <div className="text-right text-xs font-bold text-[#5B000B] flex-shrink-0 self-center">
                    {formatRupiah(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});

CartItemGroup.displayName = "CartItemGroup";
