import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useCartStore } from '../store/cartStore'
import * as cartApi from '../api/cart'
import { useAuthStore } from '../store/authStore'

export function useCart() {
  const { setCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartApi.getCart()
      const { cart, total_harga } = res.data.data
      setCart(cart, total_harga)
      return res.data.data
    },
    enabled: isAuthenticated,
  })

  const addMutation = useMutation({
    mutationFn: ({ produk_id, quantity }: { produk_id: number; quantity: number }) =>
      cartApi.addToCart(produk_id, quantity),
    onSuccess: (res) => {
      setCart(res.data.data.cart, res.data.data.total_harga)
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Produk ditambahkan ke keranjang')
    },
    onError: () => toast.error('Gagal menambahkan ke keranjang'),
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => cartApi.removeCartItem(id),
    onSuccess: (res) => {
      setCart(res.data.data.cart, res.data.data.total_harga)
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: () => toast.error('Gagal menghapus item'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartApi.updateCartItem(id, quantity),
    onSuccess: (res) => {
      setCart(res.data.data.cart, res.data.data.total_harga)
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const addToCart = useCallback(
    (produk_id: number, quantity = 1) => addMutation.mutate({ produk_id, quantity }),
    [addMutation]
  )

  return {
    cart: data,
    isLoading,
    addToCart,
    removeFromCart: (id: number) => removeMutation.mutate(id),
    updateQuantity: (id: number, quantity: number) => updateMutation.mutate({ id, quantity }),
    isAdding: addMutation.isPending,
  }
}