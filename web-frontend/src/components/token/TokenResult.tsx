import { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { getTransaksiById } from '@/api/token';

const TokenResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  const { data: transaksi, isLoading } = useQuery({
    queryKey: ['transaksi-token', id],
    queryFn: () => getTransaksiById(id!),
    enabled: !!id,
  });

  const currency = (val: number) => 'Rp' + val.toLocaleString('id-ID');

  const handleCopy = () => {
    if (!transaksi?.kode_token) return;
    const clean = transaksi.kode_token.replace(/[-\s]/g, '');
    navigator.clipboard.writeText(clean);
    if (copyBtnRef.current) {
      copyBtnRef.current.textContent = 'Tersalin!';
      setTimeout(() => {
        if (copyBtnRef.current) copyBtnRef.current.textContent = 'Salin Kode Token';
      }, 2000);
    }
  };

  const biayaLayanan = transaksi
    ? transaksi.total_harga - transaksi.nominal
    : 0;

  return (
    <>
      <Header />
      <SubHeader />

      <div className="pt-[136px] pb-24 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="flex mb-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Link to="/" className="hover:text-[#dc2626] transition-colors">Dashboard</Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link to="/token" className="hover:text-[#dc2626] transition-colors">Beli Token</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-[#dc2626] font-extrabold">Hasil Transaksi</span>
          </nav>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <svg className="w-8 h-8 animate-spin text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12c0-4.418-3.582-8-8-8z" />
              </svg>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] text-center shadow-xl border-2 border-[#dc2626]/10">

              {/* Icon sukses */}
              <div className="inline-flex p-5 bg-[#fee2e2] rounded-full mb-4 border-4 border-red-200 shadow-xl shadow-[#dc2626]/20">
                <svg className="h-10 w-10 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-4xl font-black mb-1 text-[#dc2626] tracking-tighter">TRANSAKSI BERHASIL!</h2>
              <p className="text-gray-600 text-sm mb-8 font-medium">
                Simpan dan masukkan kode di bawah ke meteran listrik Anda.
              </p>

              <div className="mb-8 border-t-2 border-dashed border-[#fca5a5] relative">
                <span className="absolute -left-10 -top-2.5 w-5 h-5 bg-gray-50 border border-[#fca5a5] rounded-full" />
                <span className="absolute -right-10 -top-2.5 w-5 h-5 bg-gray-50 border border-[#fca5a5] rounded-full" />
              </div>

              {/* Box kode token */}
              <div className="bg-white p-6 rounded-3xl border-2 border-red-200/50 mb-8 shadow-xl shadow-[#dc2626]/10">
                <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] mb-3">
                  Kode Stroom Prabayar
                </p>
                <h1 className="text-3xl font-black text-gray-900 tracking-[0.1em] break-all leading-tight mb-4">
                  {transaksi?.kode_token ?? '-'}
                </h1>
                <button
                  ref={copyBtnRef}
                  onClick={handleCopy}
                  className="text-xs font-bold text-[#dc2626] hover:text-[#b91c1c] transition uppercase tracking-widest flex items-center justify-center gap-2 mx-auto active:scale-[0.98] py-2 px-3 rounded-lg bg-red-50/50 border border-red-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7v7a2 2 0 002 2h7m-5-5l5-5m0 0h-5m5 0v5" />
                  </svg>
                  Salin Kode Token
                </button>
              </div>

              {/* Rincian pembayaran */}
              <div className="text-left p-6 rounded-2xl border-2 border-red-100 mb-8 shadow-md shadow-gray-100/50 bg-white">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Rincian Pembayaran</p>

                <div className="pb-3 border-b border-dashed border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span className="font-medium">Nominal Token</span>
                    <span className="font-extrabold text-gray-900">{transaksi ? currency(transaksi.nominal) : '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span className="font-medium">Biaya Layanan</span>
                    <span className="font-extrabold text-gray-900">{currency(biayaLayanan)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xs pt-3 text-gray-500">
                  <span className="font-light">Waktu Transaksi</span>
                  <span className="font-semibold text-gray-600">
                    {transaksi?.created_at
                      ? new Date(transaksi.created_at).toLocaleString('id-ID')
                      : '-'}
                  </span>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-[#dc2626]/50 flex justify-between items-center bg-red-50/50 p-3 -mx-3 -mb-3 rounded-b-2xl">
                  <span className="text-xl font-extrabold text-[#dc2626] uppercase tracking-tight">TOTAL:</span>
                  <span className="text-3xl font-black text-[#dc2626]">
                    {transaksi ? currency(transaksi.total_harga) : '-'}
                  </span>
                </div>
              </div>

              {/* Tombol aksi */}
              <div className="grid grid-cols-2 gap-4 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-white text-gray-700 border-2 border-gray-200 active:scale-[0.96] shadow-sm flex items-center justify-center hover:bg-gray-100 hover:shadow-md transition-all">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m0 0v1a2 2 0 002 2h6a2 2 0 002-2v-1M5 12h14M12 9V3" />
                  </svg>
                  Cetak Struk
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest bg-[#dc2626] hover:bg-[#b91c1c] shadow-xl shadow-[#dc2626]/30 active:scale-[0.96] flex items-center justify-center transition-all hover:-translate-y-0.5">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M3 12l2-2m0 0l7-7m-7 7H21" />
                  </svg>
                  Ke Dashboard
                </button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.5em]">
            &copy; 2025 TJ-T MART SMART ENERGY
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TokenResult;