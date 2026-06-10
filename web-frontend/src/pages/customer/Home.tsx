import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import MainFeatures from '@/components/home/MainFeatures';
import { ProductCategorySection, ProductLoadingSkeleton } from '@/components/home/ProductSection';
import { Produk, KategoriProduk } from '@/types';
import { MOCK_PRODUK, MOCK_KATEGORI, MOCK_BANNERS, MOCK_LATEST_PRODUCTS } from '@/data/mockHome';

const INITIAL_SHOW = 3;

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore() as any;

  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
  const [isLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleAddToCart = (produk: Produk) => {
    addToCart(produk as any);
  };

  const handleToggleWishlist = (produk: Produk) => {
    setWishlistedIds(prev => {
      const next = new Set(prev);
      next.has(produk.id) ? next.delete(produk.id) : next.add(produk.id);
      return next;
    });
  };

  const handleViewAll = (kategoriId: number) => {
    navigate(`/produk?kategori=${kategoriId}`);
  };

  const kategoriProduk: (KategoriProduk & { produk: Produk[]; slug?: string })[] =
    MOCK_KATEGORI.map(kat => ({
      ...kat,
      produk: MOCK_PRODUK.filter(p => p.kategori_id === kat.id),
    }));

  const visibleKategori = showAll ? kategoriProduk : kategoriProduk.slice(0, INITIAL_SHOW);

  return (
    <>
      <Header />
      <SubHeader />

      <div className="pt-32 pb-24 bg-white min-h-screen">
        <MainFeatures
          banners={MOCK_BANNERS}
          latestProducts={MOCK_LATEST_PRODUCTS}
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
                  wishlistedIds={wishlistedIds}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onViewAll={handleViewAll}
                />
              ))}

              {!showAll && kategoriProduk.length > INITIAL_SHOW && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-8 py-3 rounded-xl bg-[#d50d27] text-white font-bold text-sm hover:bg-[#ba0015] transition-all shadow-lg shadow-[#d50d27]/30"
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