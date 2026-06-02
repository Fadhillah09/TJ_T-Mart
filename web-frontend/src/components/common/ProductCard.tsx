import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Produk } from '@/types';
import { formatRupiah, isNewProduk, cn } from '@/utils';
import { Badge } from '@/components/ui/Badge';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  produk: Produk;
  onAddToCart?: (produk: Produk) => void;
  onWishlist?: (produk: Produk) => void;
  isLoading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  produk,
  onAddToCart,
  onWishlist,
  isLoading = false,
}) => {
  if (isLoading) return <ProductCardSkeleton />;

  const isNew = isNewProduk(produk.created_at);
  const outOfStock = produk.stok <= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
        {produk.gambar_url ? (
          <img
            src={produk.gambar_url}
            alt={produk.nama_produk}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}
        
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isNew && <Badge variant="new">NEW</Badge>}
          {outOfStock && <Badge variant="out-of-stock">HABIS</Badge>}
        </div>

        {onWishlist && (
          <button
            onClick={() => onWishlist(produk)}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:text-red-500"
            aria-label="Tambah ke wishlist"
          >
            <Heart className={cn("h-4 w-4", produk.is_wishlisted && "fill-red-500 text-red-500")} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
          {produk.nama_produk}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{produk.kategori?.nama_kategori}</p>
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">{formatRupiah(produk.harga)}</span>
          {onAddToCart && (
            <Button
              size="sm"
              variant="primary"
              className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
              disabled={outOfStock}
              onClick={() => onAddToCart(produk)}
              aria-label="Tambah ke keranjang"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
