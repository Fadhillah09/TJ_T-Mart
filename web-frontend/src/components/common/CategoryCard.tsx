import { motion } from 'framer-motion'
import { Utensils, Coffee, ShoppingBag, Shirt, Zap, Grid3x3 } from 'lucide-react'
import type { KategoriProduk } from '../../types'
 
const iconMap: Record<string, React.ReactNode> = {
  'Makanan': <Utensils size={28} />,
  'Minuman': <Coffee size={28} />,
  'Snack': <ShoppingBag size={28} />,
  'Laundry': <Shirt size={28} />,
  'Perlengkapan Kebersihan': <Shirt size={28} />,
  'Elektronik': <Zap size={28} />,
  'Lainnya': <Grid3x3 size={28} />,
}
 
interface CategoryCardProps {
  kategori: KategoriProduk
  onClick?: () => void
}
 
export default function CategoryCard({ kategori, onClick }: CategoryCardProps) {
  const icon = iconMap[kategori.nama_kategori] ?? <Grid3x3 size={28} />
 
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#DC2626]/30 transition-all w-full"
    >
      <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
        {kategori.nama_kategori}
      </span>
    </motion.button>
  )
}