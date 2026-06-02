import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cart';
import { queryKeys } from '@/api/queryKeys';
import { useCartStore } from '@/store/cartStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  const query = useQuery({
    queryKey: queryKeys.cart,
    queryFn: cartApi.getCart,
  });

  // Sync with Zustand store
  useEffect(() => {
    if (query.data?.data) {
      // Assuming backend calculates totalHarga or you calculate it here
      const totalHarga = query.data.data.items?.reduce(
        (sum, item) => sum + ((item.harga || item.produk?.harga || 0) * item.quantity),
        0
      ) || 0;
      setCart(query.data.data, totalHarga);
    }
  }, [query.data, setCart]);

  const addToCart = useMutation({
    mutationFn: ({ produkId, quantity }: { produkId: number; quantity: number }) => 
      cartApi.addToCart(produkId, quantity),
    onSuccess: (response) => {
      toast.success('Produk ditambahkan ke keranjang');
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => 
      cartApi.updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: cartApi.removeCartItem,
    onSuccess: () => {
      toast.success('Produk dihapus dari keranjang');
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  return {
    cart: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    addToCart: addToCart.mutate,
    isAdding: addToCart.isPending,
    updateQuantity: updateQuantity.mutate,
    isUpdating: updateQuantity.isPending,
    removeFromCart: removeFromCart.mutate,
    isRemoving: removeFromCart.isPending,
  };
};
