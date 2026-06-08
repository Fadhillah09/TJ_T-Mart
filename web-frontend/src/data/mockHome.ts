import { Produk, KategoriProduk } from '@/components/home/ProductSection';
import { BannerItem } from '@/components/common/BannerSlider';

/* ── Helper path produk_assets ───────────────────────────────────────────── */
const img = (filename: string) => `/produk_assets/${filename}`;

/* ── Banners ─────────────────────────────────────────────────────────────── */
export const MOCK_BANNERS: BannerItem[] = [
  {
    id: 1,
    title: 'Minuman Segar Tiap Hari',
    subtitle: 'Pocari, Yakult, Aqua — tersedia di semua mart asrama',
    image: 'https://images.unsplash.com/photo-1523677745891-6f3031224c94?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-orange-500/80 via-orange-600/60 to-transparent',
    redirect_url: '#',
  },
  {
    id: 2,
    title: 'Makanan Siap Saji & Snack',
    subtitle: 'Indomie, nugget, sarden, dan banyak lagi dengan harga terjangkau',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-red-600/80 via-red-700/60 to-transparent',
    redirect_url: '#',
  },
  {
    id: 3,
    title: 'Promo Spesial Malam',
    subtitle: 'Dapatkan harga terbaik untuk pembelian di atas Rp 50.000',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-yellow-600/80 via-orange-500/60 to-transparent',
    redirect_url: '#',
  },
  {
    id: 4,
    title: 'Belanja Hemat Setiap Hari',
    subtitle: 'Diskon hingga 50% untuk kategori pilihan setiap minggu',
    image: 'https://images.unsplash.com/photo-1488459716781-6918f6066d5f?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-pink-600/80 via-red-500/60 to-transparent',
    redirect_url: '#',
  },
];

/* ── Kategori ────────────────────────────────────────────────────────────── */
export const MOCK_KATEGORI: (KategoriProduk & { slug: string })[] = [
  { id: 1, nama_kategori: 'Makanan',   slug: 'makanan'  },
  { id: 2, nama_kategori: 'Minuman',   slug: 'minuman'  },
  { id: 3, nama_kategori: 'Snack',     slug: 'snack'    },
  { id: 4, nama_kategori: 'Kebersihan', slug: 'clean'   },
  { id: 5, nama_kategori: 'ATK',       slug: 'atk'      },
  { id: 6, nama_kategori: 'Elektronik', slug: 'electro' },
  { id: 7, nama_kategori: 'Lainnya',   slug: 'misc'     },
];

/* ── Semua produk ────────────────────────────────────────────────────────── */
export const MOCK_PRODUK: Produk[] = [
  // ── MAKANAN ──
  { id: 1,  nama_produk: 'Indomie Goreng Spesial',   harga: 15500, stok: 40, kategori: 'makanan',
    gambar_url: img('makanan_indomie.jpg'),  lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.8 },
  { id: 2,  nama_produk: 'Beras Setra Ramos 5kg',    harga: 78000, stok: 10, kategori: 'makanan',
    gambar_url: img('makanan_beras.jpg'),    lokasi: ['TJ Mart Putra'], rating: 4.6 },
  { id: 3,  nama_produk: 'Sarden ABC Tomat 155g',    harga: 10500, stok: 6,  kategori: 'makanan',
    gambar_url: img('makanan_sarden.jpg'),   lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.5 },
  { id: 4,  nama_produk: 'Telur Ayam Negeri 10 Butir', harga: 28000, stok: 13, kategori: 'makanan',
    gambar_url: img('makanan_telur.jpg'),    lokasi: ['TJ Mart Putri'], rating: 4.7 },
  { id: 5,  nama_produk: 'Kecap Manis Bango 520ml',  harga: 22000, stok: 10, kategori: 'makanan',
    gambar_url: img('makanan_kecap.jpg'),    lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.4 },
  { id: 6,  nama_produk: 'Kornet Sapi Pronas 198g',  harga: 24500, stok: 15, kategori: 'makanan',
    gambar_url: img('makanan_kornet.jpg'),   lokasi: ['TJ Mart Putri'], rating: 4.6 },
  { id: 7,  nama_produk: 'Minyak Goreng Tropical 1L', harga: 19000, stok: 20, kategori: 'makanan',
    gambar_url: img('makanan_minyak.jpg'),   lokasi: ['TJ Mart Putra'], rating: 4.5 },
  { id: 8,  nama_produk: 'Nugget So Good 500g',      harga: 32000, stok: 8,  kategori: 'makanan',
    gambar_url: img('makanan_nugget.jpg'),   lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.3 },
  { id: 9,  nama_produk: 'Garam Dapur Cap Kapal',    harga: 3500,  stok: 50, kategori: 'makanan',
    gambar_url: img('makanan_garam.jpg'),    lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.2 },
  { id: 10, nama_produk: 'Tepung Terigu Segitiga Biru', harga: 12000, stok: 25, kategori: 'makanan',
    gambar_url: img('makanan_tepung.jpg'),   lokasi: ['TJ Mart Putra'], rating: 4.4 },

  // ── MINUMAN ──
  { id: 11, nama_produk: 'Pocari Sweat Isotonik 500ml', harga: 7500,  stok: 56, kategori: 'minuman',
    gambar_url: img('minuman_pocari.jpg'),   lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.7 },
  { id: 12, nama_produk: 'Teh Botol Sosro 450ml',    harga: 6000,  stok: 73, kategori: 'minuman',
    gambar_url: img('minuman_tehbotol.jpg'), lokasi: ['TJ Mart Putri'], rating: 4.5 },
  { id: 13, nama_produk: 'Ultra Milk Full Cream 1L', harga: 19500, stok: 21, kategori: 'minuman',
    gambar_url: img('minuman_susu.jpg'),     lokasi: ['TJ Mart Putra'], rating: 4.6 },
  { id: 14, nama_produk: 'Kopi Kapal Api 165g',      harga: 14500, stok: 42, kategori: 'minuman',
    gambar_url: img('minuman_kopi.jpg'),     lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.8 },
  { id: 15, nama_produk: 'Yakult Probiotik 80ml',    harga: 10500, stok: 7,  kategori: 'minuman',
    gambar_url: img('minuman_yakult.jpg'),   lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.9 },
  { id: 16, nama_produk: 'Coca-Cola Zero Sugar 330ml', harga: 7000, stok: 35, kategori: 'minuman',
    gambar_url: img('minuman_coke.jpg'),     lokasi: ['TJ Mart Putri'], rating: 4.6 },
  { id: 17, nama_produk: 'Milo Activ-Go 200ml',      harga: 8500,  stok: 30, kategori: 'minuman',
    gambar_url: img('minuman_milo.jpg'),     lokasi: ['TJ Mart Putra'], rating: 4.5 },
  { id: 18, nama_produk: 'Aqua Galon 19L',           harga: 22000, stok: 15, kategori: 'minuman',
    gambar_url: img('minuman_aqua.jpg'),     lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.7 },
  { id: 19, nama_produk: 'Bear Brand Susu Steril',   harga: 9500,  stok: 40, kategori: 'minuman',
    gambar_url: img('minuman_bearbrand.jpg'),lokasi: ['TJ Mart Putri'], rating: 4.6 },
  { id: 20, nama_produk: 'Buavita Juice Mangga 250ml', harga: 6500, stok: 28, kategori: 'minuman',
    gambar_url: img('minuman_buavita.jpg'),  lokasi: ['TJ Mart Putra'], rating: 4.3 },

  // ── SNACK ──
  { id: 21, nama_produk: 'Oreo Sandwich Cookies',    harga: 8500,  stok: 60, kategori: 'snack',
    gambar_url: img('snack_oreo.jpg'),       lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.7 },
  { id: 22, nama_produk: 'Pringles Original 107g',   harga: 28000, stok: 20, kategori: 'snack',
    gambar_url: img('snack_pringles.jpg'),   lokasi: ['TJ Mart Putra'], rating: 4.8 },
  { id: 23, nama_produk: 'Chitato Sapi Panggang',    harga: 12000, stok: 35, kategori: 'snack',
    gambar_url: img('snack_chitato.jpg'),    lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.5 },
  { id: 24, nama_produk: 'Beng-Beng Wafer Coklat',  harga: 4500,  stok: 80, kategori: 'snack',
    gambar_url: img('snack_bengbeng.jpg'),   lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.6 },
  { id: 25, nama_produk: 'Popmie Cup Noodle',        harga: 5500,  stok: 45, kategori: 'snack',
    gambar_url: img('snack_popmie.jpg'),     lokasi: ['TJ Mart Putri'], rating: 4.4 },
  { id: 26, nama_produk: 'Kacang Garuda Asin',       harga: 9000,  stok: 30, kategori: 'snack',
    gambar_url: img('snack_kacang.jpg'),     lokasi: ['TJ Mart Putra'], rating: 4.3 },
  { id: 27, nama_produk: 'Potabee Kentang Chips',    harga: 11000, stok: 25, kategori: 'snack',
    gambar_url: img('snack_potabee.jpg'),    lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.5 },
  { id: 28, nama_produk: 'Roma Kelapa Cookies',      harga: 7500,  stok: 40, kategori: 'snack',
    gambar_url: img('snack_roma.jpg'),       lokasi: ['TJ Mart Putri'], rating: 4.4 },
  { id: 29, nama_produk: 'Qtela Cassava Chips',      harga: 13000, stok: 18, kategori: 'snack',
    gambar_url: img('snack_qtela.jpg'),      lokasi: ['TJ Mart Putra'], rating: 4.6 },
  { id: 30, nama_produk: 'Coklat SilverQueen 58g',   harga: 16000, stok: 22, kategori: 'snack',
    gambar_url: img('snack_chocolate.jpg'),  lokasi: ['TJ Mart Putri'], rating: 4.7 },

  // ── KEBERSIHAN ──
  { id: 31, nama_produk: 'Detergen Rinso 900g',      harga: 24000, stok: 15, kategori: 'clean',
    gambar_url: img('clean_detergen.jpg'),   lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.6 },
  { id: 32, nama_produk: 'Sabun Lifebuoy 110g',      harga: 5500,  stok: 50, kategori: 'clean',
    gambar_url: img('clean_soap.jpg'),       lokasi: ['TJ Mart Putra'], rating: 4.7 },
  { id: 33, nama_produk: 'Shampoo Pantene 170ml',    harga: 18000, stok: 20, kategori: 'clean',
    gambar_url: img('clean_shampoo.jpg'),    lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.5 },
  { id: 34, nama_produk: 'Odol Pepsodent 190g',      harga: 12000, stok: 30, kategori: 'clean',
    gambar_url: img('clean_odol.jpg'),       lokasi: ['TJ Mart Putri'], rating: 4.6 },
  { id: 35, nama_produk: 'Molto Pelembut Pakaian',   harga: 15000, stok: 12, kategori: 'clean',
    gambar_url: img('clean_molto.jpg'),      lokasi: ['TJ Mart Putra'], rating: 4.4 },
  { id: 36, nama_produk: 'Harpic Pembersih WC',      harga: 22000, stok: 8,  kategori: 'clean',
    gambar_url: img('clean_harpic.jpg'),     lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.3 },

  // ── ATK ──
  { id: 37, nama_produk: 'Pulpen Pilot G2 Hitam',    harga: 8500,  stok: 40, kategori: 'atk',
    gambar_url: img('atk_pulpen.jpg'),       lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.8 },
  { id: 38, nama_produk: 'Pensil 2B Faber Castell',  harga: 5000,  stok: 60, kategori: 'atk',
    gambar_url: img('atk_pensil.jpg'),       lokasi: ['TJ Mart Putra'], rating: 4.7 },
  { id: 39, nama_produk: 'Binder A4 Ring 25mm',      harga: 35000, stok: 10, kategori: 'atk',
    gambar_url: img('atk_binder.jpg'),       lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.5 },
  { id: 40, nama_produk: 'Kertas HVS A4 80gr 100lbr', harga: 18000, stok: 20, kategori: 'atk',
    gambar_url: img('atk_kertas.jpg'),       lokasi: ['TJ Mart Putra'], rating: 4.6 },
  { id: 41, nama_produk: 'Stabilo Boss Highlighter',  harga: 12000, stok: 25, kategori: 'atk',
    gambar_url: img('atk_stabilo.jpg'),      lokasi: ['TJ Mart Putri'], rating: 4.7 },
  { id: 42, nama_produk: 'Penghapus Steadler',        harga: 4000,  stok: 35, kategori: 'atk',
    gambar_url: img('atk_penghapus.jpg'),    lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.5 },

  // ── ELEKTRONIK ──
  { id: 43, nama_produk: 'Baterai AA Energizer 2pc', harga: 18000, stok: 30, kategori: 'electro',
    gambar_url: img('electro_baterai.jpg'),  lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.6 },
  { id: 44, nama_produk: 'Earphone Basic 3.5mm',     harga: 25000, stok: 15, kategori: 'electro',
    gambar_url: img('electro_earphone.jpg'), lokasi: ['TJ Mart Putra'], rating: 4.2 },
  { id: 45, nama_produk: 'Kabel USB Type-C 1m',      harga: 35000, stok: 12, kategori: 'electro',
    gambar_url: img('electro_kabel.jpg'),    lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.4 },
  { id: 46, nama_produk: 'Colokan 3 Lubang + USB',   harga: 45000, stok: 8,  kategori: 'electro',
    gambar_url: img('electro_colokan.jpg'),  lokasi: ['TJ Mart Putri'], rating: 4.5 },

  // ── MISC ──
  { id: 47, nama_produk: 'Gunting Besar Joyko',      harga: 15000, stok: 20, kategori: 'misc',
    gambar_url: img('misc_gunting.jpg'),     lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.4 },
  { id: 48, nama_produk: 'Tissue Passeo 250 lembar', harga: 12000, stok: 35, kategori: 'misc',
    gambar_url: img('misc_tissue.jpg'),      lokasi: ['TJ Mart Putra'], rating: 4.6 },
  { id: 49, nama_produk: 'Sandal Jepit Swallow',     harga: 20000, stok: 15, kategori: 'misc',
    gambar_url: img('misc_sandal.jpg'),      lokasi: ['TJ Mart Putra', 'TJ Mart Putri'], rating: 4.3 },
  { id: 50, nama_produk: 'Plester Hansaplast 10pcs', harga: 8000,  stok: 40, kategori: 'misc',
    gambar_url: img('misc_plester.jpg'),     lokasi: ['TJ Mart Putri'], rating: 4.5 },
];

/* ── Latest Products — 8 produk terbaru untuk katalog di MainFeatures ─── */
export const MOCK_LATEST_PRODUCTS: Produk[] = MOCK_PRODUK.slice(0, 8);
