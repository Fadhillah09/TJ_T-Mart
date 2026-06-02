import { create } from 'zustand';
import { Cart } from '@/types';

interface CartState {
  cart: Cart | null;
  totalItems: number;
  totalHarga: number;
  setCart: (cart: Cart | null, totalHarga?: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  totalItems: 0,
  totalHarga: 0,
  setCart: (cart, totalHarga = 0) => {
    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    set({ cart, totalItems, totalHarga });
  },
  clearCart: () => set({ cart: null, totalItems: 0, totalHarga: 0 }),
}));
