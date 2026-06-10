import { useParams, useNavigate, Link } from "react-router-dom";
import { useProdukDetail, useProdukList } from "@/hooks/useProduk";
import { useCartStore } from "@/store/cartStore";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/common/ProductCard";
import ProdukFoto from "@/components/produk/ProdukFoto";
import ProdukTransaksi from "@/components/produk/ProdukTransaksi";
import ProdukRatingForm from "@/components/produk/ProdukRatingForm";
import ProdukRatingStats from "@/components/produk/ProdukRatingStats";
import { currency } from "@/utils/produkUtils";
import StarIcon from "@/utils/StarIcon";
import { Produk } from "@/types";
import { MOCK_PRODUK } from '@/data/mockHome';
import { ProductItem } from "@/components/home/ProductSection";

const ProdukDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartStore() as any;

  const { data: produkRes, isLoading } = useProdukDetail(Number(id));
  const produk = produkRes?.data as any;

  const rekomendasi: Produk[] = MOCK_PRODUK
  .filter(p => p.kategori_id === produk?.kategori_id && p.id !== Number(id))
  .slice(0, 8);

  const fotoUtama: string = produk?.gambar_url || "";
  const hargaAsli: number = produk?.harga ?? 0;
  const hargaDiskon =
    produk?.persentase_diskon > 0
      ? hargaAsli - hargaAsli * (produk.persentase_diskon / 100)
      : null;
  const hargaTampil = hargaDiskon ?? hargaAsli;
  const avgRating: number = produk?.avg_rating ?? 0;
  const ulasanList: any[] =
    produk?.reviews ?? produk?.ulasans ?? produk?.ratings ?? [];

  if (isLoading)
    return (
      <>
        <Header />
        <SubHeader />
        <div className="pt-[136px] min-h-screen flex items-center justify-center bg-white">
          <svg
            className="w-8 h-8 animate-spin text-[#dc2626]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12c0-4.418-3.582-8-8-8z"
            />
          </svg>
        </div>
        <Footer />
      </>
    );

  if (!produk)
    return (
      <>
        <Header />
        <SubHeader />
        <div className="pt-[136px] min-h-screen flex items-center justify-center bg-white">
          <p className="text-gray-500 font-bold">Produk tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <SubHeader />

      <div className="pt-[136px] pb-24 bg-white min-h-screen text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb — Beranda / Nama Produk */}
          <div className="mb-4">
            <nav className="flex text-[10px] font-semibold text-gray-500 mb-1 gap-1 items-center">
              <Link to="/" className="hover:text-[#dc2626] transition-colors">
                Beranda
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#dc2626] font-extrabold truncate max-w-[300px]">
                {produk.nama_produk}
              </span>
            </nav>
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-1 rounded-full mr-1 -ml-1 text-gray-500 hover:text-[#dc2626] hover:-translate-x-1 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                <span className="text-[#dc2626]">Detail</span> Produk
              </h1>
            </div>
          </div>

          {/* Grid utama */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-start">
            {/* Foto */}
            <div className="lg:col-span-2">
              <ProdukFoto src={fotoUtama} alt={produk.nama_produk} />
            </div>

            {/* Info produk */}
            <div className="lg:col-span-3 space-y-4">
              <h1 className="text-2xl font-black leading-tight text-gray-900 tracking-tight">
                {produk.nama_produk}
              </h1>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 shadow-sm">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl font-black text-[#dc2626]">
                    {currency(hargaTampil)}
                  </span>
                  {produk.persentase_diskon > 0 && (
                    <>
                      <span className="text-xs text-gray-400 line-through font-bold">
                        {currency(hargaAsli)}
                      </span>
                      <span className="text-[9px] font-black text-white bg-[#dc2626] px-1.5 py-0.5 rounded-full">
                        {produk.persentase_diskon}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">
                      Status Ketersediaan
                    </p>
                    <p
                      className={`font-black text-xs ${produk.stok > 0 ? "text-green-600" : "text-[#dc2626]"}`}
                    >
                      {produk.stok > 0 ? `${produk.stok} Stok` : "Stok Habis"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">
                      Penilaian Global
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="font-black text-gray-800 text-xs">
                        {avgRating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <StarIcon
                            key={i}
                            filled={avgRating >= i}
                            size="w-3 h-3"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {produk.produk_marts && produk.produk_marts.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Lokasi Ketersediaan Produk:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {produk.produk_marts.map((pm: any, i: number) => (
                      <span
                        key={i}
                        className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                          pm.is_active
                            ? "bg-white text-[#dc2626] border-[#dc2626] shadow-sm"
                            : "bg-gray-100 text-gray-400 border-transparent"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${pm.is_active ? "bg-[#dc2626] animate-pulse" : "bg-gray-300"}`}
                        />
                        {pm.nama_mart ?? pm.mart?.nama_mart}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-1.5">
                <h3 className="font-black text-gray-800 flex items-center uppercase tracking-tight text-xs">
                  <svg
                    className="w-4 h-4 mr-1.5 text-[#dc2626]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Deskripsi Produk
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium pl-1 text-xs">
                  {produk.deskripsi ?? "Tidak ada deskripsi produk."}
                </p>
              </div>
            </div>

            {/* Transaksi */}
            <div className="lg:col-span-2">
              <ProdukTransaksi produk={produk} />
            </div>
          </div>

          {/* Rating section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProdukRatingForm produkId={id} />
            <ProdukRatingStats avgRating={avgRating} ulasanList={ulasanList} />
          </div>

          {/* Produk serupa — sama persis dengan card di Home, bisa diklik */}
          {rekomendasi.length > 0 && (
            <div className="mt-10 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black text-[#5B000B] uppercase tracking-wide">
                  Produk Serupa
                </h2>
                <Link
                  to={`/produk?kategori=${produk.kategori_id}`}
                  className="text-[10px] font-bold text-[#dc2626] hover:underline"
                >
                  Lihat semua →
                </Link>
              </div>
              <div
                className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#dc2626 #f3f4f6",
                }}
              >
                {rekomendasi.map((p) => (
                  <ProductItem
                    key={p.id}
                    produk={p}
                    wishlistedIds={new Set()}
                    onAddToCart={(prod) => {
                      addToCart({ ...prod, quantity: 1 });
                    }}
                    onToggleWishlist={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProdukDetail;
