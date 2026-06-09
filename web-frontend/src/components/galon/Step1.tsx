import React from 'react';

export interface GalonOption {
  nama: string;
  harga: number;
}

interface Step1Props {
  galons: GalonOption[];
  hasGalon: boolean;
  pilihanGalon: string;
  jumlah: number;
  pengiriman: 'ambil' | 'antar';
  catatan: string;
  ongkir: number;
  onHasGalonChange: (val: boolean) => void;
  onPilihanChange: (nama: string, harga: number) => void;
  onJumlahChange: (val: number) => void;
  onPengirimanChange: (val: 'ambil' | 'antar') => void;
  onCatatanChange: (val: string) => void;
  onNext: () => void;
}

const Step1 = ({
  galons = [],
  hasGalon,
  pilihanGalon,
  jumlah = 1,
  pengiriman,
  catatan,
  ongkir = 0,
  onHasGalonChange,
  onPilihanChange,
  onJumlahChange,
  onPengirimanChange,
  onCatatanChange,
  onNext,
}: Step1Props) => {

  const handleSelectGalon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = galons.find(g => g.nama === e.target.value);
    onPilihanChange(e.target.value, found?.harga ?? 0);
  };

  const canProceed = pilihanGalon !== '' && jumlah >= 1;
  const totalOngkir = (Number(ongkir) || 0) * (Number(jumlah) || 1);

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-lg shadow-gray-100/40 space-y-5 max-w-2xl mx-auto">

      {/* ── Header Utama ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 18v2M12 4v2" />
          </svg>
        </div>
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          <span className="text-[#dc2626]">Beli</span> Galon
        </h3>
      </div>
      <div className="h-0.5 w-12 bg-[#dc2626] -mt-3.5 ml-10 rounded-full" />

      {/* ── Langkah 1 ───────────────────────────────────── */}
      <div className="space-y-2.5 pt-1">
        <label className="block text-gray-800 font-bold text-xs tracking-tight">
          <span className="text-[#dc2626]">Langkah 1:</span> Apakah Anda sudah memiliki galon sebelumnya?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              val: true,
              label: 'Ya, Isi Ulang',
              sub: 'Tukar dengan galon kosong',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
            },
            {
              val: false,
              label: 'Belum Ada, Botol Baru',
              sub: 'Beli galon baru + isi air',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
            },
          ].map(({ val, label, sub, icon }) => {
            const active = hasGalon === val;
            return (
              <label key={String(val)}
                onClick={() => { onHasGalonChange(val); if (!val) onPilihanChange('', 0); }}
                className={`flex items-center p-3 rounded-xl cursor-pointer border-2 transition-all duration-200
                            ${active
                              ? 'border-[#dc2626] shadow-sm shadow-red-50 bg-white'
                              : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg mr-3 shadow-sm transition-colors
                                 ${active ? 'bg-[#dc2626] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-xs block">{label}</span>
                  <span className="text-[10px] text-gray-400 block">{sub}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── Jenis & Jumlah ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card Pilih Jenis Galon */}
        <div className="space-y-1 p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-100/30">
          <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0h10" />
            </svg>
            Pilih Jenis Galon
          </label>
          <span className="text-[10px] text-gray-400 block pb-1">
            Pilih sesuai kebutuhan (Isi Ulang/Botol Baru).
          </span>
          <select
            value={pilihanGalon}
            onChange={handleSelectGalon}
            className="w-full border border-gray-200 rounded-lg p-2 bg-white text-gray-700 text-xs font-semibold focus:outline-none focus:border-[#dc2626]">
            <option value="" disabled>-- Pilih Paket Galon --</option>
            {galons.map(g => {
              const isIsiUlang = g.nama.toLowerCase().includes('isi ulang');
              if (isIsiUlang && !hasGalon) return null;
              return (
                <option key={g.nama} value={g.nama}>
                  {g.nama} — Rp{g.harga.toLocaleString('id-ID')}
                </option>
              );
            })}
          </select>
        </div>

        {/* Card Jumlah Pesanan */}
        <div className="space-y-1 p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-100/30">
          <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Jumlah Pesanan
          </label>
          <span className="text-[10px] text-gray-400 block pb-1">
            Masukkan jumlah galon yang ingin Anda pesan.
          </span>
          <input
            type="number" min={1} value={jumlah}
            onChange={e => onJumlahChange(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg p-1.5 bg-white text-gray-800 font-bold text-center text-xs focus:outline-none focus:border-[#dc2626]"
            placeholder="Min. 1" />
        </div>
      </div>

      {/* ── Metode Pengambilan ────────────────────────────── */}
      <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-100/30">
        <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          Pilih Metode Pengambilan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
          {[
            {
              val: 'ambil' as const,
              label: 'Ambil Sendiri',
              sub: 'Gratis Tanpa Biaya',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />,
            },
            {
              val: 'antar' as const,
              label: 'Antar ke Kamar',
              sub: `+ Rp${totalOngkir.toLocaleString('id-ID')}`,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
            },
          ].map(({ val, label, sub, icon }) => {
            const active = pengiriman === val;
            return (
              <label key={val}
                onClick={() => onPengirimanChange(val)}
                className={`flex items-center p-2.5 rounded-xl cursor-pointer border-2 transition-all text-xs
                            ${active
                              ? 'border-[#dc2626] bg-red-50/5 font-bold'
                              : 'border-gray-100 bg-gray-50/30 hover:border-gray-200'}`}>
                <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg mr-2 transition-colors
                                 ${active ? 'bg-[#dc2626] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <div>
                  <span className="text-gray-900 block font-bold text-[11px]">{label}</span>
                  <span className="text-[9px] text-gray-400 block">{sub}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── Catatan ───────────────────────────────────────── */}
      <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-100/30">
        <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Catatan Tambahan <span className="text-gray-400 font-normal text-[10px]">(Opsional)</span>
        </label>
        <textarea
          value={catatan}
          onChange={e => onCatatanChange(e.target.value)}
          rows={2}
          placeholder="Contoh: titip di depan kamar, tolong tukar 2 botol"
          className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-xs text-gray-700 focus:outline-none focus:border-[#dc2626] resize-none" />
        <p className="text-[9px] text-gray-400 ml-0.5">
          Catatan ini akan diteruskan ke petugas pengantar galon.
        </p>
      </div>

      {/* ── Tombol Lanjut ─────────────────────────────────── */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="group relative w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/10 hover:bg-[#b91c1c] active:scale-[0.99] transition-all disabled:opacity-40 disabled:bg-red-200 disabled:cursor-not-allowed">
        <span className="flex items-center justify-center gap-1.5">
          Lanjut ke Pembayaran
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default Step1;