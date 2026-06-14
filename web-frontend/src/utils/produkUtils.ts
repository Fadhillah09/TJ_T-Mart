const imageMapping: Record<string, string> = {
  'beras.jpg': 'makanan_beras.jpg',
  'nugget.jpg': 'makanan_nugget.jpg',
  'telur.jpg': 'makanan_telur.jpg',
  'indomie.jpg': 'makanan_indomie.jpg',
  'sarden.jpg': 'makanan_sarden.jpg',
  'kecap.jpg': 'makanan_kecap.jpg',
  'kornet.jpg': 'makanan_kornet.jpg',
  'pocari.jpg': 'minuman_pocari.jpg',
  'tehbotol.jpg': 'minuman_tehbotol.jpg',
  'susu.jpg': 'minuman_susu.jpg',
  'kopi.jpg': 'minuman_kopi.jpg',
  'yakult.jpg': 'minuman_yakult.jpg',
  'coke.jpg': 'minuman_coke.jpg',
  'buavita.jpg': 'minuman_buavita.jpg',
  'milo.jpg': 'minuman_milo.jpg',
  'bearbrand.jpg': 'minuman_bearbrand.jpg',
  'aqua.jpg': 'minuman_aqua.jpg',
  'kertas.jpg': 'atk_kertas.jpg',
  'pulpen.jpg': 'atk_pulpen.jpg',
  'binder.jpg': 'atk_binder.jpg',
  'stabilo.jpg': 'atk_stabilo.jpg',
  'pensil.jpg': 'atk_pensil.jpg',
  'penghapus.jpg': 'atk_penghapus.jpg',
  'penggaris.jpg': 'atk_penggaris.jpg',
  'map.jpg': 'atk_map.jpg',
  'tipex.jpg': 'atk_tipex.jpg',
  'postit.jpg': 'atk_postit.jpg',
  'potabee.jpg': 'snack_potabee.jpg',
  'chitato.jpg': 'snack_chitato.jpg',
  'pringles.jpg': 'snack_pringles.jpg',
  'oreo.jpg': 'snack_oreo.jpg',
  'chocolate.jpg': 'snack_chocolate.jpg',
  'bengbeng.jpg': 'snack_bengbeng.jpg',
  'qtela.jpg': 'snack_qtela.jpg',
  'kacang.jpg': 'snack_kacang.jpg',
  'roma.jpg': 'snack_roma.jpg',
};

export const resolveGambar = (produkData: any): string => {
  if (produkData?.gambar_url) return produkData.gambar_url;
  
  const raw: string = produkData?.gambar ?? produkData?.foto ?? '';
  if (!raw || raw.trim() === '') {
    return 'https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=400&h=400&fit=crop&q=80';
  }

  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  
  const BACKEND_URL = 'http://127.0.0.1:8000';
  if (raw.startsWith('/storage/')) return `${BACKEND_URL}${raw}`;
  if (raw.startsWith('storage/')) return `${BACKEND_URL}/${raw}`;
  if (raw.startsWith('produk/')) return `${BACKEND_URL}/storage/${raw}`;
  if (raw.startsWith('/produk/')) return `${BACKEND_URL}/storage${raw}`;

  const filename = raw.split('/').pop() ?? raw;
  if (imageMapping[filename]) {
    return `/produk_assets/${imageMapping[filename]}`;
  }

  if (raw.includes('produk_assets/')) {
    return `/${raw.substring(raw.indexOf('produk_assets/'))}`;
  }

  return `/produk_assets/${filename}`;
};

export const currency = (val: number | string | undefined | null) => {
  if (val === undefined || val === null) return 'Rp 0';
  const numericVal = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(numericVal)) return 'Rp 0';
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericVal).replace(/\u00a0/g, ' ');
};