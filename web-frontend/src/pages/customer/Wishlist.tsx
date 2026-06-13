import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/api/wishlist";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCart } from "@/hooks/useCart";
import { currency, resolveGambar } from "@/utils/produkUtils";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setWishlistedIds } = useWishlistStore();
  const { addToCart } = useCart();

  // Query: Get Wishlist items from backend
  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
  });

  const products = wishlistData?.data?.produk || [];

  // Sync Zustand store wishlistedIds with database values
  useEffect(() => {
    if (wishlistData?.data?.produk) {
      setWishlistedIds(wishlistData.data.produk.map((p) => p.id));
    }
  }, [wishlistData, setWishlistedIds]);

  // Mutation: Remove item from wishlist
  const removeMutation = useMutation({
    mutationFn: (id: number) => wishlistApi.removeWishlist(id),
    onSuccess: (_, id) => {
      toast.success("Produk dihapus dari wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // Update local store as well
      setWishlistedIds(products.filter((p) => p.id !== id).map((p) => p.id));
    },
    onError: () => {
      toast.error("Gagal menghapus produk dari wishlist.");
    },
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-72 rounded-3xl" />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <Header />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 pt-32 pb-24 flex items-center justify-center min-h-[50vh]">
          <EmptyState
            icon={<Heart size={48} className="text-gray-400" />}
            title="Wishlist kamu kosong"
            description="Simpan produk-produk favoritmu di sini untuk mempermudah pembelian nanti."
            action={
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95 text-xs shadow-md shadow-red-900/10"
              >
                Mulai Menjelajah
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
          <span className="text-[#5B000B]">Wishlist</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-[#5B000B] mb-6">
          Wishlist Saya
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((produk) => {
            const hasDiskon = produk.persentase_diskon && produk.persentase_diskon > 0;
            const hargaDiskon = hasDiskon
              ? produk.harga - produk.harga * (produk.persentase_diskon! / 100)
              : produk.harga;

            return (
              <div
                key={produk.id}
                className="group bg-white rounded-3xl border border-gray-100 hover:border-red-500/20 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative"
              >
                {/* Badge Diskon */}
                {hasDiskon && (
                  <span className="absolute top-3 left-3 bg-[#dc2626] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full z-10 animate-pulse-subtle">
                    {produk.persentase_diskon}% OFF
                  </span>
                )}

                {/* Product Image */}
                <div
                  className="relative pt-[100%] bg-gray-50 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/produk/${produk.id}`)}
                >
                  <img
                    src={resolveGambar(produk)}
                    alt={produk.nama_produk}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/produk_assets/no-image.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Product Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {produk.kategori?.nama_kategori || "Mart"}
                    </p>
                    <h3
                      className="font-extrabold text-xs text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight line-clamp-2 cursor-pointer"
                      onClick={() => navigate(`/produk/${produk.id}`)}
                    >
                      {produk.nama_produk}
                    </h3>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-[#dc2626]">
                        {currency(hargaDiskon)}
                      </span>
                      {hasDiskon && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">
                          {currency(produk.harga)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => removeMutation.mutate(produk.id)}
                        disabled={removeMutation.isPending}
                        className="p-2 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        title="Hapus dari Wishlist"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => addToCart({ produkId: produk.id, quantity: 1 })}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 active:scale-95 shadow-md shadow-red-900/10"
                      >
                        <ShoppingCart size={11} />
                        <span>+ Keranjang</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
