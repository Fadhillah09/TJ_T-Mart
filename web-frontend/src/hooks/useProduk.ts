import { useQuery } from '@tanstack/react-query'
import * as produkApi from '../api/produk'
import type { ProdukParams } from '../api/produk'

export function useProdukList(params?: ProdukParams) {
  return useQuery({
    queryKey: ['produk', params],
    queryFn: async () => {
      const res = await produkApi.getProduk(params)
      return res.data
    },
    staleTime: 1000 * 60 * 2, // 2 min cache
  })
}

export function useProdukDetail(id: number) {
  return useQuery({
    queryKey: ['produk', id],
    queryFn: async () => {
      const res = await produkApi.getProdukDetail(id)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useKategori() {
  return useQuery({
    queryKey: ['kategori'],
    queryFn: async () => {
      const res = await produkApi.getKategori()
      return res.data.data
    },
    staleTime: 1000 * 60 * 10, // 10 min
  })
}

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await produkApi.getBanners()
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}