import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { createSnapToken, saveTransaksiToken } from '@/api/token';

const MOCK_TOKENS = [
  { nominal: 25000,  harga: 25500  },
  { nominal: 50000,  harga: 51000  },
  { nominal: 100000, harga: 101000 },
  { nominal: 200000, harga: 201000 },
];

const TokenPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [selectedHarga, setSelectedHarga]     = useState<number | null>(null);

  const snapMutation = useMutation({
    mutationFn: createSnapToken,
    onSuccess: async (data) => {
      window.snap.pay(data.snap_token, {
        onSuccess: async (result: any) => {
          try {
            const res = await saveTransaksiToken({
              transaction_id: data.transaction_id,
              nominal: selectedNominal!,
              harga: selectedHarga!,
              metode: result.payment_type,
              order_id: result.order_id,
            });
            navigate(`/token/result/${res.id}`);
          } catch {
            alert('Pembayaran berhasil, tapi gagal memproses token. Silakan cek riwayat.');
          }
        },
        onPending: () => alert('Pembayaran pending, silakan selesaikan pembayaran.'),
        onError:   () => alert('Pembayaran gagal.'),
        onClose:   () => {},
      });
    },
  });

  const handleBayar = () => {
    if (!selectedNominal || !selectedHarga) return;
    snapMutation.mutate({ total_amount: selectedHarga, type: 'token', nominal: selectedNominal });
  };

  const currency = (val: number) => 'Rp' + val.toLocaleString('id-ID');
  const biayaLayanan = selectedHarga && selectedNominal ? selectedHarga - selectedNominal : 0;

  const infoItems = [
    { label: 'Nama Lengkap',  value: user?.name ?? '-' },
    { label: 'Gedung Asrama', value: user?.lokasi?.nama_lokasi ?? '-' },
    { label: 'Nomor Kamar',   value: user?.nomor_kamar ?? '-' },
  ];

  return (
    <>
      <Header />
      <SubHeader />

      <div className="pt-[136px] pb-24 bg-white min-h-screen px-4">
        <div className="w-full max-w-xl mx-auto space-y-4">

          {/* Card Info Penghuni */}
          <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-md">
            <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
              <div className="p-1.5 rounded-full mr-2 bg-[#dc2626] text-white shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5.121 17.804A13.935 13.935 0 0112 16c2.585 0 5.013.84 6.942 2.227M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                Informasi Penghuni Asrama
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {infoItems.map((item) => (
                <div key={item.label} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-tight text-gray-400 mb-0.5">{item.label}</p>
                  <p className="font-extrabold text-gray-800 text-xs truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Beli Token */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-lg shadow-gray-100/40 space-y-5">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  <span className="text-[#dc2626]">Beli</span> Token
                </h3>
              </div>
              <div className="h-0.5 w-12 bg-[#dc2626] mt-1 ml-10 rounded-full" />
            </div>

            {/* Pilihan Paket */}
            <div className="space-y-2.5">
              <label className="block text-gray-800 font-bold text-xs tracking-tight">
                <span className="text-[#dc2626]">Pilih</span> Nominal Token
              </label>
              <div className="grid grid-cols-2 gap-3">
                {MOCK_TOKENS.map((t) => {
                  const active = selectedNominal === t.nominal;
                  return (
                    <div key={t.nominal}
                      onClick={() => { setSelectedNominal(t.nominal); setSelectedHarga(t.harga); }}
                      className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 active:scale-[0.98]
                        ${active
                          ? 'border-[#dc2626] shadow-sm shadow-red-50 bg-white'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}>
                      <p className="text-[10px] font-bold uppercase tracking-tight text-gray-400">Nominal</p>
                      <h5 className="text-base font-extrabold text-[#dc2626]">{currency(t.nominal)}</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Total: <span className="font-bold text-gray-700">{currency(t.harga)}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-100/30">
              <p className="text-[11px] font-bold text-gray-800 uppercase tracking-tight mb-2">Ringkasan Pembayaran</p>
              {[
                { label: 'Nominal Token', value: selectedNominal ? currency(selectedNominal) : 'Rp0' },
                { label: 'Biaya Layanan', value: currency(biayaLayanan) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center text-xs border-b border-dashed border-gray-100 pb-1.5">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-bold text-gray-800">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Total</span>
                <span className="text-lg font-black text-[#dc2626]">
                  {selectedHarga ? currency(selectedHarga) : 'Rp0'}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 p-3 bg-[#fee2e2] border border-red-200 rounded-xl">
              <div className="bg-red-100 text-[#dc2626] rounded-full p-1.5 shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-[#dc2626]">Transaksi Instan</p>
                <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                  Token muncul otomatis di <b>Riwayat Transaksi</b> setelah pembayaran terverifikasi.
                </p>
              </div>
            </div>

            {/* Tombol Bayar */}
            <button
              onClick={handleBayar}
              disabled={!selectedNominal || snapMutation.isPending}
              className="group relative w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/10 hover:bg-[#b91c1c] active:scale-[0.99] transition-all disabled:opacity-40 disabled:bg-red-200 disabled:cursor-not-allowed">
              <span className="flex items-center justify-center gap-1.5">
                {snapMutation.isPending ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12c0-4.418-3.582-8-8-8z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Bayar Sekarang
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              Secure Payment by Midtrans
            </p>
          </div>

          <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] pb-2">
            &copy; 2025 TJ-T MART SMART ENERGY
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TokenPage;