import { useQuery } from '@tanstack/react-query';
import { produkApi } from '@/api/produk';
import { queryKeys } from '@/api/queryKeys';

export const useProdukList = (params?: object) => {
  return useQuery({
    queryKey: queryKeys.produk(params),
    queryFn: () => produkApi.getProduk(params),
  });
};

export const useProdukDetail = (id: number) => {
  return useQuery({
    queryKey: queryKeys.produkDetail(id),
    queryFn: () => produkApi.getProdukDetail(id),
    enabled: !!id,
  });
};

export const useKategori = () => {
  return useQuery({
    queryKey: queryKeys.kategori,
    queryFn: produkApi.getKategori,
  });
};

export const useBanners = () => {
  return useQuery({
    queryKey: queryKeys.banners,
    queryFn: produkApi.getBanners,
  });
};
