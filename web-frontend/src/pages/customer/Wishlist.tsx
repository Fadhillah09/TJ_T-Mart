import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/api/wishlist";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setWishlistedIds } = useWishlistStore();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<number | null>(null);

  // Query: Get Wishlist items from backend
  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
  });

  const products = useMemo(() => {
    if (Array.isArray(wishlistData?.data)) {
      return wishlistData.data.map((item: any) => item.produk).filter(Boolean);
    }
    return [];
  }, [wishlistData]);

  // Sync Zustand store wishlistedIds with database values
  useEffect(() => {
    if (wishlistData?.data) {
      setWishlistedIds(products.map((p) => p.id));
    }
  }, [wishlistData, products, setWishlistedIds]);

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

  const handleAddToCart = (id: number) => {
    setAddingId(id);
    addToCart(
      { produkId: id, quantity: 1 },
      {
        onSettled: () => {
          setAddingId(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95 text-xs shadow-md shadow-red-900/10 cursor-pointer"
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
        <h1 className="text-2xl font-extrabold text-[#5B000B] mb-6">
          Wishlist Saya
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((produk) => (
            <WishlistCard
              key={produk.id}
              produk={produk}
              onRemove={(id) => removeMutation.mutate(id)}
              onAddToCart={handleAddToCart}
              isRemoving={removeMutation.isPending && removeMutation.variables === produk.id}
              isAdding={addingId === produk.id}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
