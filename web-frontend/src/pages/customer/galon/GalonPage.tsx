import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import Step1, { GalonOption } from '@/components/galon/Step1';

const MOCK_GALONS: GalonOption[] = [
  { nama: 'Isi Ulang Galon Aqua', harga: 18000 },
  { nama: 'Galon Baru + Isi Aqua', harga: 50000 },
];

const GalonPage = () => {
  const { user } = useAuthStore();

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

  const infoItems = [
    {
      label: 'Nama Lengkap',
      value: user?.name ?? 'Fadhillah',
    },
    {
      label: 'Gedung Asrama',
      value: user?.lokasi?.nama_lokasi ?? 'Gedung 6',
    },
    {
      label: 'Nomor Kamar',
      value: user?.nomor_kamar ?? '205',
    },
  ];

  return (
    <>
      <Header />
      <SubHeader />

      <div className="pt-[136px] pb-24 bg-gray-50 min-h-screen px-4">
        <div className="w-full max-w-xl mx-auto space-y-4">

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

      <Footer />
    </>
  );
};

export default GalonPage;