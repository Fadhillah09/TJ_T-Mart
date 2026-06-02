import React from 'react';
import { motion } from 'framer-motion';
import { KategoriProduk } from '@/types';
import { 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Droplet, 
  Package, 
  Zap,
  MoreHorizontal
} from 'lucide-react';

interface CategoryCardProps {
  kategori: KategoriProduk;
  onClick?: (kategori: KategoriProduk) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ kategori, onClick }) => {
  // Simple icon mapping based on category name
  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('minuman') || lowerName.includes('drink')) return <Coffee className="h-6 w-6" />;
    if (lowerName.includes('makanan') || lowerName.includes('food')) return <Utensils className="h-6 w-6" />;
    if (lowerName.includes('galon')) return <Droplet className="h-6 w-6" />;
    if (lowerName.includes('snack') || lowerName.includes('cemilan')) return <Package className="h-6 w-6" />;
    if (lowerName.includes('token') || lowerName.includes('listrik')) return <Zap className="h-6 w-6" />;
    return <ShoppingBag className="h-6 w-6" />;
  };

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(kategori)}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group w-full"
      aria-label={kategori.nama_kategori}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
        {getIcon(kategori.nama_kategori)}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center group-hover:text-red-600">
        {kategori.nama_kategori}
      </span>
    </motion.button>
  );
};
