import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import MainFeatures from '@/components/home/MainFeatures';
import { ProductCategorySection, ProductLoadingSkeleton } from '@/components/home/ProductSection';
import { Produk } from '@/types';
import { MOCK_PRODUK, MOCK_KATEGORI, MOCK_BANNERS } from '@/data/mockHome';
import { useMartStore } from '@/store/martStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useKategori, useProdukList, useBanners } from '@/hooks/useProduk';
import api from '@/api/axiosConfig';

const INITIAL_SHOW = 3;

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { activeMart } = useMartStore();
  const { wishlistedIds, toggleWishlist } = useWishlistStore();

  const [showAll, setShowAll] = useState(false);

  const { data: kategoriRes, isLoading: isKatLoading } = useKategori();
  const { data: produkRes, isLoading: isProdLoading } = useProdukList({ per_page: 100 });
  const { data: bannersRes } = useBanners();

  const isLoading = isKatLoading || isProdLoading;

  const wishlistedSet = new Set(wishlistedIds);

  const handleAddToCart = (produk: Produk) => {
    addToCart({ produkId: produk.id, quantity: 1 });
  };

  const handleToggleWishlist = async (produk: Produk) => {
    const isWishlisted = wishlistedIds.includes(produk.id);
    toggleWishlist(produk.id);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${produk.id}`);
      } else {
        await api.post('/wishlist', { produk_id: produk.id });
      }
    } catch (err) {
      // Revert if API request fails
      toggleWishlist(produk.id);
    }
  };

  const handleViewAll = (kategoriId: number) => {
    navigate(`/produk?kategori=${kategoriId}`);
  };

  // Safe database lists resolve with fallback to mock data
  const dbKategori = kategoriRes?.data && kategoriRes.data.length > 0 ? kategoriRes.data : MOCK_KATEGORI;
  const dbProduk = produkRes?.data?.data && produkRes.data.data.length > 0 ? produkRes.data.data : MOCK_PRODUK;
  const dbBanners = bannersRes?.data && bannersRes.data.length > 0 ? bannersRes.data : MOCK_BANNERS;

  // Display order: Makanan → Minuman → Snack → Kebersihan → Alat Tulis → Elektronik → Lainnya
  const KATEGORI_ORDER: Record<number, number> = {
    1: 1, // Makanan
    2: 2, // Minuman
    4: 3, // Snack
    5: 4, // Perlengkapan Kebersihan
    3: 5, // Alat Tulis
    6: 6, // Elektronik
    9: 7, // Lainnya
  };

  // Filter products by active mart availability, then sort by defined display order
  const kategoriProduk = dbKategori.map(kat => {
    const filtered = dbProduk.filter(p => {
      const matchKategori = p.kategori_id === kat.id;
      const matchMart = !activeMart || p.produk_marts?.some((pm: any) => pm.mart_id === activeMart.id);
      return matchKategori && matchMart;
    });

    return {
      ...kat,
      produk: filtered,
    };
  })
  .filter(kat => kat.produk.length > 0)
  .sort((a, b) => {
    const orderA = KATEGORI_ORDER[a.id] ?? 99;
    const orderB = KATEGORI_ORDER[b.id] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.nama_kategori.localeCompare(b.nama_kategori, 'id');
  });

  const visibleKategori = showAll ? kategoriProduk : kategoriProduk.slice(0, INITIAL_SHOW);

  const filteredLatestProducts = dbProduk
    .filter(p => !activeMart || p.produk_marts?.some((pm: any) => pm.mart_id === activeMart.id))
    .slice(0, 8);

  return (
    <>
      <Header />
      <SubHeader />

      <div className="pt-32 pb-24 bg-white min-h-screen">
        <MainFeatures
          banners={dbBanners}
          latestProducts={filteredLatestProducts}
        />

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 mt-2">
          {isLoading ? (
            <>
              <div className="mt-10 h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <ProductLoadingSkeleton count={6} />
            </>
          ) : (
            <>
              {visibleKategori.map(kat => (
                <ProductCategorySection
                  key={kat.id}
                  kat={kat}
                  wishlistedIds={wishlistedSet}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onViewAll={handleViewAll}
                />
              ))}
              {!showAll && kategoriProduk.length > INITIAL_SHOW && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setShowAll(true)}
                    style={{
                      background: 'linear-gradient(135deg, #5B000B, #dc2626, #b91c1c, #5B000B)',
                      backgroundSize: '300% 300%',
                      animation: 'gradientAnimation 8s ease infinite',
                      border: '1px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 4px 15px rgba(213,13,39,0.4)',
                    }}
                    className="px-8 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    Lihat Semua Kategori ({kategoriProduk.length - INITIAL_SHOW} lainnya)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;