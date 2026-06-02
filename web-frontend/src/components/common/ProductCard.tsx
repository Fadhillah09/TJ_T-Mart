import { Heart, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatRupiah, isNewProduk } from '../../utils'
import Badge from '../ui/Badge'
import { ProductCardSkeleton } from '../ui/Skeleton'
import type { Produk } from '../../types'

interface ProductCardProps {
  produk: Produk
  onAddToCart?: (produk: Produk) => void
  onWishlist?: (produk: Produk) => void
  loading?: boolean
}

export default function ProductCard({ produk, onAddToCart, onWishlist, loading }: ProductCardProps) {
  if (loading) return <ProductCardSkeleton />

  const isNew = isNewProduk(produk.created_at)
  const outOfStock = produk.stok === 0

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {produk.gambar_url ? (
          <img
            src={produk.gambar_url}
            alt={produk.nama_produk}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart size={40} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <Badge variant="new">NEW</Badge>}
          {outOfStock && <Badge variant="out-of-stock">Habis</Badge>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => onWishlist?.(produk)}
          className={cn(
            'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all',
            'bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110',
            produk.is_wishlisted ? 'text-[#DC2626]' : 'text-gray-400 hover:text-[#DC2626]'
          )}
        >
          <Heart size={14} fill={produk.is_wishlisted ? '#DC2626' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        {produk.kategori && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
            {produk.kategori.nama_kategori}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-2">
          {produk.nama_produk}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#DC2626]">
            {formatRupiah(produk.harga)}
          </span>
          <button
            onClick={() => !outOfStock && onAddToCart?.(produk)}
            disabled={outOfStock}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90',
              outOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm hover:shadow-md'
            )}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}