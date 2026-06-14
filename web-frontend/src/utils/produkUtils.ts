export const resolveGambar = (produkData: any): string => {
  if (produkData?.gambar_url) return produkData.gambar_url;
  
  const raw: string = produkData?.gambar ?? produkData?.foto ?? '';
  if (!raw || raw.trim() === '') return '/produk_assets/no-image.png';

  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('/storage/')) return raw;
  if (raw.startsWith('storage/')) return `/${raw}`;

  return '/produk_assets/no-image.png';
};

export const currency = (val: number | string | undefined | null) => {
  if (val === undefined || val === null) return 'Rp 0';
  const numericVal = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(numericVal)) return 'Rp 0';
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(numericVal).replace(/\u00a0/g, ' ');
};