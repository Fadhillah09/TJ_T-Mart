import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';

/* ── Komponen Tambahan ── */
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';

/* ── Komponen ── */
import MainFeatures from '@/components/home/MainFeatures';
import {
  ProductCategorySection,
  ProductLoadingSkeleton,
  Produk,
  KategoriProduk,
} from '@/components/home/ProductSection';

/* ── Mock data (nanti diganti API call) ── */
import { MOCK_PRODUK, MOCK_KATEGORI, MOCK_BANNERS, MOCK_LATEST_PRODUCTS } from '@/data/mockHome';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore() as any;

  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
  const [isLoading] = useState(false);

  /* ── Handlers ── */
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
      produk: MOCK_PRODUK.filter(p => p.kategori === kat.slug),
    }));

  return (
    <>
      {/* ── BAGIAN ATAS ── */}
      <Header />
      <SubHeader />

      <div className="pt-32 py-2 mb-24 bg-gray-50 min-h-screen">
        {/* ── SECTION 1: Welcome + Banner + Katalog Terbaru ── */}
        <MainFeatures
          banners={MOCK_BANNERS}
          latestProducts={MOCK_LATEST_PRODUCTS}
        />

        {/* ── SECTION 2: Grid Produk per Kategori ── */}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 -mt-[150px] relative z-10">
          {isLoading ? (
            <>
              <div className="mt-10 h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <ProductLoadingSkeleton count={6} />
            </>
          ) : (
            kategoriProduk.map(kat => (
              <ProductCategorySection
                key={kat.id}
                kat={kat}
                wishlistedIds={wishlistedIds}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onViewAll={handleViewAll}
              />
            ))
          )}
        </div>
      </div>

      {/* ── BAGIAN BAWAH ── */}
      <Footer />
    </>
  );
};

export default Home;