export const resolveGambar = (produkData: any): string => {
  if (produkData?.gambar_url) return produkData.gambar_url;
  
  const raw: string = produkData?.gambar ?? produkData?.foto ?? '';
  if (!raw || raw.trim() === '') return '/produk_assets/no-image.png';

  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('/storage/')) return raw;
  if (raw.startsWith('storage/')) return `/${raw}`;

  return '/produk_assets/no-image.png';
};

export const currency = (val: number) =>
  'Rp ' + Math.round(val).toLocaleString('id-ID');