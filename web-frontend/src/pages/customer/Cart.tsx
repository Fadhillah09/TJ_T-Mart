import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useMartStore } from "@/store/martStore";
import { groupCartByMart } from "@/utils/helpers";
import { currency, resolveGambar } from "@/utils/produkUtils";
import { CartItem } from "@/types";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ShoppingBag, Trash2, Plus, Minus, Store, ChevronRight } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
  const { activeMart } = useMartStore();

  const rawCartItems = cart?.items || [];

  // Map backend cart items to CartItem format
  const mappedCartItems: CartItem[] = useMemo(() => {
    return rawCartItems.map((item: any) => ({
      id: item.id,
      product_id: item.produk_id,
      product_name: item.produk?.nama_produk || "",
      mart_id: activeMart?.id || item.produk?.produk_marts?.[0]?.mart_id || 1,
      mart_name: activeMart?.nama_mart || item.produk?.produk_marts?.[0]?.mart?.nama_mart || "Mart",
      qty: item.quantity,
      price: item.produk?.harga || 0,
      image_url: resolveGambar(item.produk),
    }));
  }, [rawCartItems, activeMart]);

  const groupedItems = useMemo(() => groupCartByMart(mappedCartItems), [mappedCartItems]);

  const cartSubtotal = useMemo(() => {
    return mappedCartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [mappedCartItems]);

  const handleQtyChange = (itemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity({ id: itemId, quantity: newQty });
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-60 rounded-3xl" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (mappedCartItems.length === 0) {
    return (
      <>
        <Header />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 pt-32 pb-24 flex items-center justify-center min-h-[50vh]">
          <EmptyState
            icon={<ShoppingBag size={48} className="text-gray-400" />}
            title="Keranjang kamu kosong"
            description="Silakan cari produk pilihan Anda di TJ Mart terlebih dahulu."
            action={
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95 text-xs shadow-md shadow-red-900/10"
              >
                Kembali Belanja
              </button>
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <SubHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
          <span className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Beranda</span>
          <span className="text-gray-300">/</span>
          <span className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => navigate("/produk")}>Produk</span>
          <span className="text-gray-300">/</span>
          <span className="text-[#5B000B]">Keranjang</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-[#5B000B] mb-6">
          Keranjang Belanja
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* List items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedItems).map(([martId, group]) => (
              <div key={martId} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#930014]">
                    <Store size={18} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#5B000B] uppercase tracking-wide">
                    {group.martName}
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center first:pt-0 last:pb-0">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/produk_assets/no-image.png";
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-xs text-gray-900 truncate uppercase">
                          {item.product_name}
                        </h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                          {currency(item.price)}
                        </p>
                      </div>

                      {/* Quantity & Subtotal Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, item.qty, -1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors font-black text-sm"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-gray-800">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, item.qty, 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors font-black text-sm"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="font-black text-xs text-[#dc2626] block">
                            {currency(item.price * item.qty)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout summary panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                Ringkasan Belanja
              </h3>

              <div className="space-y-3 border-b border-gray-100 pb-4 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Total Harga Produk</span>
                  <span className="font-black text-gray-800">{currency(cartSubtotal)}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-normal italic mt-1.5">
                  * Biaya kirim dan biaya layanan akan ditambahkan saat checkout sesuai metode pengiriman pilihan Anda.
                </p>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-500 uppercase">Subtotal</span>
                <span className="text-lg font-black text-[#dc2626]">
                  {currency(cartSubtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-900/20 flex items-center justify-center gap-1.5"
              >
                <span>Lanjut ke Checkout</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
