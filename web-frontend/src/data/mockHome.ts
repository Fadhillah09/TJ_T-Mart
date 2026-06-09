import { Produk, KategoriProduk, Banner } from '@/types';

const img = (filename: string) => `/produk_assets/${filename}`;

const PUTRA   = [{ mart_id: 1, mart: { nama_mart: 'TJ Mart Putra' } }];
const TPUTRA   = [{ mart_id: 2, mart: { nama_mart: 'T Mart Putra' } }];
const PUTRI   = [{ mart_id: 3, mart: { nama_mart: 'TJ Mart Putri' } }];
const KEDUANYA = [
  { mart_id: 1, mart: { nama_mart: 'TJ Mart Putra' } },
  { mart_id: 3, mart: { nama_mart: 'TJ Mart Putri' } },
];
const KETIGANYA = [
  { mart_id: 1, mart: { nama_mart: 'TJ Mart Putra' } },
  { mart_id: 2, mart: { nama_mart: 'T Mart Putra' } },
  { mart_id: 3, mart: { nama_mart: 'TJ Mart Putri' } },
];

/* ── Banners ─────────────────────────────────────────────────────────── */
export const MOCK_BANNERS: Banner[] = [
  { id: 1, title: 'Minuman Segar Tiap Hari',   image_path: 'https://i.pinimg.com/originals/1a/20/2f/1a202f71e3e6f3a0bd686e2bb26e0be8.jpg', order: 1, is_active: true },
  { id: 2, title: 'Makanan Siap Saji', image_path: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=500&fit=crop&q=80', order: 2, is_active: true },
  { id: 3, title: 'Promo Akhir Pekan',         image_path: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=500&fit=crop&q=80', order: 3, is_active: true },
  { id: 4, title: 'Belanja Hemat Setiap Hari', image_path: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=1400&h=500&fit=crop&q=80', order: 4, is_active: true },
];

/* ── Kategori ────────────────────────────────────────────────────────── */
export const MOCK_KATEGORI: (KategoriProduk & { slug: string })[] = [
  { id: 1, nama_kategori: 'Makanan',                 slug: 'makanan'    },
  { id: 2, nama_kategori: 'Minuman',                 slug: 'minuman'    },
  { id: 4, nama_kategori: 'Snack',                   slug: 'snack'      },
  { id: 5, nama_kategori: 'Perlengkapan Kebersihan', slug: 'kebersihan' },
  { id: 3, nama_kategori: 'Alat Tulis',              slug: 'atk'        },
  { id: 6, nama_kategori: 'Elektronik',              slug: 'elektronik' },
  { id: 9, nama_kategori: 'Lainnya',                 slug: 'lainnya'    },
];

/* ── Produk ──────────────────────────────────────────────────────────── */
export const MOCK_PRODUK: Produk[] = [

  // ── MAKANAN ──────────────────────────────────────────────────────────
  { id: 1,  kategori_id: 1, is_active: true, nama_produk: 'Indomie Goreng Spesial isi 5',      harga: 15500, stok: 50, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_indomie.jpg'), kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: KEDUANYA },
  { id: 2,  kategori_id: 1, is_active: true, nama_produk: 'Beras Setra Ramos Super 5kg',       harga: 78000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_beras.jpg'),   kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: TPUTRA },
  { id: 3,  kategori_id: 1, is_active: true, nama_produk: 'Sarden ABC Tomat 155g',             harga: 10500, stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_sarden.jpg'),  kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: KETIGANYA },
  { id: 4,  kategori_id: 1, is_active: true, nama_produk: 'Telur Ayam Negeri 10 butir',        harga: 28000, stok: 15, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_telur.jpg'),   kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: PUTRI },
  { id: 5,  kategori_id: 1, is_active: true, nama_produk: 'Kecap Manis Bango 520ml',           harga: 22000, stok: 25, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_kecap.jpg'),   kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: KEDUANYA },
  { id: 6,  kategori_id: 1, is_active: true, nama_produk: 'Kornet Sapi Pronas 198g',           harga: 24500, stok: 18, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_kornet.jpg'),  kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: PUTRI },
  { id: 7,  kategori_id: 1, is_active: true, nama_produk: 'Nugget Ayam Fiesta 500g',           harga: 45000, stok: 12, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_nugget.jpg'),  kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: KETIGANYA },

  // ── MINUMAN ──────────────────────────────────────────────────────────
  { id: 8,  kategori_id: 2, is_active: true, nama_produk: 'Pocari Sweat Isotonik 500ml',       harga: 7500,  stok: 60, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_pocari.jpg'),    kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: KEDUANYA },
  { id: 9,  kategori_id: 2, is_active: true, nama_produk: 'Teh Botol Sosro Original 450ml',    harga: 6000,  stok: 80, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_tehbotol.jpg'),  kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: PUTRI },
  { id: 10, kategori_id: 2, is_active: true, nama_produk: 'Ultra Milk Full Cream 1000ml',      harga: 19500, stok: 24, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_susu.jpg'),      kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: PUTRA },
  { id: 11, kategori_id: 2, is_active: true, nama_produk: 'Kopi Kapal Api Mantap 165g',        harga: 14500, stok: 45, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_kopi.jpg'),      kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: KEDUANYA },
  { id: 12, kategori_id: 2, is_active: true, nama_produk: 'Yakult Minuman Probiotik',          harga: 10500, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_yakult.jpg'),    kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: KETIGANYA },
  { id: 13, kategori_id: 2, is_active: true, nama_produk: 'Coca-Cola Zero Sugar 330ml',        harga: 7000,  stok: 36, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_coke.jpg'),      kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: PUTRI },
  { id: 14, kategori_id: 2, is_active: true, nama_produk: 'Buavita Orange Juice 250ml',        harga: 8500,  stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_buavita.jpg'),   kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: TPUTRA },

  // ── SNACK ─────────────────────────────────────────────────────────────
  { id: 28, kategori_id: 4, is_active: true, nama_produk: 'Oreo Sandwich Cookies',             harga: 8500,  stok: 60, status_ketersediaan: 'Tersedia', gambar_url: img('snack_oreo.jpg'),      kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KEDUANYA },
  { id: 29, kategori_id: 4, is_active: true, nama_produk: 'Pringles Original 107g',            harga: 28000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('snack_pringles.jpg'),  kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KETIGANYA },
  { id: 30, kategori_id: 4, is_active: true, nama_produk: 'Chitato Sapi Panggang',             harga: 12000, stok: 35, status_ketersediaan: 'Tersedia', gambar_url: img('snack_chitato.jpg'),   kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KEDUANYA },
  { id: 33, kategori_id: 4, is_active: true, nama_produk: 'Beng-Beng Share It 10x9.5g',        harga: 12500, stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('snack_bengbeng.jpg'),  kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KEDUANYA },
  { id: 37, kategori_id: 4, is_active: true, nama_produk: 'Pop Mie Rasa Ayam 75g',             harga: 5500,  stok: 100,status_ketersediaan: 'Tersedia', gambar_url: img('snack_popmie.jpg'),    kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KETIGANYA },
  { id: 35, kategori_id: 4, is_active: true, nama_produk: 'Garuda Kacang Atom 130g',           harga: 9000,  stok: 40, status_ketersediaan: 'Tersedia', gambar_url: img('snack_kacang.jpg'),    kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KETIGANYA },

  // ── KEBERSIHAN ───────────────────────────────────────────────────────
  { id: 42, kategori_id: 5, is_active: true, nama_produk: 'So Klin Liquid Deterjen 750ml',     harga: 18500, stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('clean_detergen.jpg'), kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: KEDUANYA },
  { id: 38, kategori_id: 5, is_active: true, nama_produk: 'Lifebuoy Sabun Cair 450ml',         harga: 24000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('clean_soap.jpg'),     kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: PUTRA },
  { id: 40, kategori_id: 5, is_active: true, nama_produk: 'Clear Shampoo Anti Ketombe 160ml',  harga: 26000, stok: 25, status_ketersediaan: 'Tersedia', gambar_url: img('clean_shampoo.jpg'),  kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: KEDUANYA },
  { id: 39, kategori_id: 5, is_active: true, nama_produk: 'Pepsodent Pasta Gigi 190g',         harga: 13500, stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('clean_odol.jpg'),     kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: KETIGANYA },

  // ── ALAT TULIS ───────────────────────────────────────────────────────
  { id: 58, kategori_id: 3, is_active: true, nama_produk: 'Pulpen Pilot G2 Hitam',             harga: 8500,  stok: 40, status_ketersediaan: 'Tersedia', gambar_url: img('atk_pulpen.jpg'),     kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: KEDUANYA },
  { id: 59, kategori_id: 3, is_active: true, nama_produk: 'Pensil 2B Faber Castell',           harga: 5000,  stok: 60, status_ketersediaan: 'Tersedia', gambar_url: img('atk_pensil.jpg'),     kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: PUTRA },

  // ── ELEKTRONIK ───────────────────────────────────────────────────────
  { id: 48, kategori_id: 6, is_active: true, nama_produk: 'Kabel Data Robot Type-C 1M',        harga: 25000, stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('electro_kabel.jpg'),   kategori: { id: 6, nama_kategori: 'Elektronik' }, produk_marts: KEDUANYA },
  { id: 52, kategori_id: 6, is_active: true, nama_produk: 'Baterai Alkaline AA 2+1 Pack',      harga: 18000, stok: 40, status_ketersediaan: 'Tersedia', gambar_url: img('electro_baterai.jpg'), kategori: { id: 6, nama_kategori: 'Elektronik' }, produk_marts: KEDUANYA },
  { id: 53, kategori_id: 6, is_active: true, nama_produk: 'Terminal Colokan 3 Lubang 3M',      harga: 48000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('electro_colokan.jpg'), kategori: { id: 6, nama_kategori: 'Elektronik' }, produk_marts: KETIGANYA },

  // ── LAINNYA ──────────────────────────────────────────────────────────
  { id: 54, kategori_id: 9, is_active: true, nama_produk: 'Tissue Paseo Soft Pack 250 Sheets', harga: 12500, stok: 60, status_ketersediaan: 'Tersedia', gambar_url: img('misc_tissue.jpg'),    kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: PUTRA },
  { id: 55, kategori_id: 9, is_active: true, nama_produk: 'Payung Lipat Anti-UV Hitam',        harga: 48000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('misc_payung.jpg'),    kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: KEDUANYA },
];

export const MOCK_LATEST_PRODUCTS: Produk[] = MOCK_PRODUK.slice(0, 8);