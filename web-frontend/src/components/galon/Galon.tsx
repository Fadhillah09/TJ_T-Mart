import { useState } from 'react';
import Step1, { GalonOption } from '@/components/galon/Step1';
import InfoPenghuni from '@/components/galon/InfoPenghuni';
import { galonApi } from '@/api/galon'; // sesuaikan path api kamu

// Mock data atau ambil dari API nantinya
const MOCK_GALONS: GalonOption[] = [
  { nama: 'Isi Ulang Galon Aqua', harga: 20000 },
  { nama: 'Galon Baru + Isi Aqua', harga: 55000 },
];

const GalonPage = () => {
  // State yang dibutuhkan oleh Step1Props
  const [hasGalon, setHasGalon] = useState<boolean>(true);
  const [pilihanGalon, setPilihanGalon] = useState<string>('');
  const [hargaSatuan, setHargaSatuan] = useState<number>(0);
  const [jumlah, setJumlah] = useState<number>(1);
  const [pengiriman, setPengiriman] = useState<'ambil' | 'antar'>('ambil');
  const [catatan, setCatatan] = useState<string>('');
  const ongkir = 2000; // Contoh tarif ongkir per kamar

  const handlePilihanChange = (nama: string, harga: number) => {
    setPilihanGalon(nama);
    setHargaSatuan(harga);
  };

  const handleNextStep = () => {
    // Logika lanjut ke pembayaran (Integrasi Midtrans/COD)
    console.log({ pilihanGalon, jumlah, pengiriman, catatan, hargaSatuan });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Menampilkan Info Penghuni Asrama */}
      <InfoPenghuni />

      {/* Menyuplai semua props wajib ke Step1 */}
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
  );
};

export default GalonPage;