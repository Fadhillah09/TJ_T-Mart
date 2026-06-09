import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Step1, { GalonOption } from '@/components/galon/Step1';

const MOCK_GALONS: GalonOption[] = [
  { nama: 'Isi Ulang Galon Aqua', harga: 18000 },
  { nama: 'Galon Baru + Isi Aqua', harga: 50000 }
];

const GalonPage = () => {
  const { user } = useAuthStore(); // Ambil data user login asrama di sini

  const [hasGalon, setHasGalon] = useState<boolean>(true);
  const [pilihanGalon, setPilihanGalon] = useState<string>('');
  const [hargaSatuan, setHargaSatuan] = useState<number>(0);
  const [jumlah, setJumlah] = useState<number>(1);
  const [pengiriman, setPengiriman] = useState<'ambil' | 'antar'>('ambil');
  const [catatan, setCatatan] = useState<string>('');
  const ongkir = 2000; 

  const handlePilihanChange = (nama: string, harga: number) => {
    setPilihanGalon(nama);
    setHargaSatuan(harga);
  };

  const handleNextStep = () => {
    console.log({ pilihanGalon, jumlah, pengiriman, catatan, hargaSatuan });
  };

  // Susunan item informasi penghuni asrama
  const infoItems = [
    { label: 'Nama Lengkap', value: user?.name ?? 'Fadhillah', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Gedung Asrama', value: user?.lokasi?.nama_lokasi ?? 'Gedung 6', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m-5 0v-2a2 2 0 012-2h10a2 2 0 012 2v2M7 5h10' },
    { label: 'Nomor Kamar', value: user?.nomor_kamar ?? '205', icon: 'M8 7h.01M12 7h.01M16 7h.01M21 12v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3m18-4a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0h.01M19 19H5' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-6">
      {/* max-w-xl membuat ukuran container card jauh lebih kecil, pas di tengah monitor */}
      <div className="w-full max-w-xl space-y-4">
        
        {/* ── CARD 1: INFORMASI PENGHUNI ASRAMA (DIKECILKAN & DIPADATKAN) ── */}
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
                <p className="text-[9px] font-bold uppercase tracking-tight text-gray-400 mb-0.5">
                  {item.label}
                </p>
                <p className="font-extrabold text-gray-800 text-xs truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARD 2: FORM BELI GALON STEP 1 ── */}
        <Step1
          galons={MOCK_GALONS}
          hasGalon={hasGalon}
          pilihanGalon={pilihanGalon}
          jumlah={jumlah}
          pengiriman={pengiriman}
          catatan={catatan}
          ongkir={ongkir}
          onHasGalonChange={setHasGalon}
          onPilihanChange={handlePilihanChange}
          onJumlahChange={setJumlah}
          onPengirimanChange={setPengiriman}
          onCatatanChange={setCatatan}
          onNext={handleNextStep}
        />
        
      </div>
    </div>
  );
};

export default GalonPage;