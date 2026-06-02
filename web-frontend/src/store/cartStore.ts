import { create } from 'zustand'
import type { Cart } from '../types'
 
interface CartState {
  cart: Cart | null
  totalItems: number
  totalHarga: number
  setCart: (cart: Cart, totalHarga?: number) => void
  clearCart: () => void
}
 
export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  totalItems: 0,
  totalHarga: 0,
  setCart: (cart, totalHarga = 0) =>
    set({
      cart,
      totalItems: cart.items?.length ?? 0,
      totalHarga,
    }),
  clearCart: () => set({ cart: null, totalItems: 0, totalHarga: 0 }),
}))