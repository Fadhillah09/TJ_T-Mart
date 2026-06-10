import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { getRiwayatToken } from '@/api/token';

const TokenHistory = () => {
  const navigate = useNavigate();

  const { data: riwayat = [], isLoading } = useQuery({
    queryKey: ['riwayat-token'],
    queryFn: getRiwayatToken,
  });

  const currency = (val: number) => 'Rp' + val.toLocaleString('id-ID');

  return (
    <>
      <Header />
      <SubHeader />

      <div className="pt-[136px] pb-24 bg-white min-h-screen">
        <div className="max-w-xl mx-auto px-4">

          {/* Breadcrumb + Header */}
          <div className="mb-8">
            <nav className="flex text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              <Link to="/" className="hover:text-[#dc2626] transition-colors">Dashboard</Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-[#dc2626] font-extrabold">Riwayat Transaksi</span>
            </nav>

            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full mr-2 -ml-1 text-gray-500 hover:text-[#dc2626] hover:-translate-x-1 transition-all active:scale-[0.98]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
                Riwayat <span className="text-[#dc2626]">Pembelian Token</span>
              </h1>
            </div>
          </div>

          {/* Card Daftar */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-2xl shadow-gray-300/50">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                  Daftar <span className="text-[#dc2626]">Transaksi</span>
                </h3>
                <p className="text-gray-500 mt-2 font-medium italic">
                  Pantau dan simpan kode token listrik Anda di sini.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <svg className="w-8 h-8 animate-spin text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12c0-4.418-3.582-8-8-8z" />
                </svg>
              </div>
            ) : riwayat.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex p-6 bg-[#fee2e2] rounded-full mb-4 border border-red-200/50 shadow-md shadow-red-100">
                  <svg className="h-12 w-12 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-bold text-lg uppercase tracking-widest mt-4">
                  Belum ada transaksi token.
                </p>
                <p className="text-gray-400 font-medium mt-2">Yuk, beli token pertama Anda!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {riwayat.map((r: any) => (
                  <div key={r.id}
                    className="group relative overflow-hidden bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-lg shadow-gray-100 transition-all duration-500 hover:shadow-[0_10px_25px_rgba(220,38,38,0.15)] hover:border-[#dc2626] hover:-translate-y-1">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">

                      {/* Kiri */}
                      <div className="flex gap-4 items-start">
                        <div className="h-14 w-14 flex-shrink-0 rounded-xl flex items-center justify-center bg-[#fee2e2] text-[#930014] border border-[#dc2626]/20 shadow-md">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>

                        <div>
                          <h4 className="text-3xl font-black text-gray-900 tracking-tighter">
                            {currency(r.total_harga)}
                          </h4>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
                            Tanggal: {new Date(r.created_at).toLocaleDateString('id-ID')} •{' '}
                            Pukul: {new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>

                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border
                              ${r.status === 'Lunas'
                                ? 'bg-[#fee2e2] text-[#930014] border-[#DB4B3A]/50'
                                : 'bg-yellow-100 text-[#E68757] border-[#E68757]/50'
                              }`}>
                              {r.status === 'Lunas' ? 'Berhasil' : r.status}
                            </span>
                          </div>

                          {r.kode_token && r.status === 'Lunas' && (
                            <div className="mt-4">
                              <span className="block text-xs font-extrabold uppercase tracking-widest text-[#DB4B3A] mb-1">
                                Kode Token:
                              </span>
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E7BD8A]/30 rounded-xl border-2 border-[#E7BD8A]/50 shadow-inner">
                                <span className="font-mono text-base text-[#5B000B] font-bold tracking-[0.2em]">
                                  {r.kode_token}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(r.kode_token.replace(/[-\s]/g, ''));
                                  }}
                                  className="text-xs font-bold uppercase tracking-widest text-[#930014] hover:text-[#DB4B3A] transition-colors active:scale-95 ml-2">
                                  SALIN
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Kanan: Tombol */}
                      <div className="w-full md:w-auto mt-4 md:mt-0">
                        <Link
                          to={`/token/result/${r.id}`}
                          className="group/btn flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-white text-gray-900 font-black rounded-xl border-2 border-[#DB4B3A]/50 shadow-lg shadow-[#DB4B3A]/10 active:scale-95 hover:bg-[#DB4B3A] hover:text-white transition-all duration-300">
                          Struk Digital
                          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-[#E7BD8A]/10 rounded-full blur-3xl group-hover:bg-[#DB4B3A]/10 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="mt-16 py-10 border-t border-gray-200 text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} TJ-T Mart Smart Energy System
            </p>
          </footer>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default TokenHistory;