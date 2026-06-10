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

  // ── MAKANAN (tambahan) ────────────────────────────────────────────────
{ id: 15, kategori_id: 1, is_active: true, nama_produk: 'Garam Dapur Refina 500g',        harga: 4500,  stok: 40, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_garam.jpg'),   kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: KEDUANYA },
{ id: 16, kategori_id: 1, is_active: true, nama_produk: 'Minyak Goreng Filma 2L',         harga: 38000, stok: 25, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_minyak.jpg'),  kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: KETIGANYA },
{ id: 17, kategori_id: 1, is_active: true, nama_produk: 'Tepung Terigu Segitiga 1kg',     harga: 12000, stok: 35, status_ketersediaan: 'Tersedia', gambar_url: img('makanan_tepung.jpg'),  kategori: { id: 1, nama_kategori: 'Makanan' }, produk_marts: PUTRA },

// ── MINUMAN (tambahan) ────────────────────────────────────────────────
{ id: 18, kategori_id: 2, is_active: true, nama_produk: 'Aqua Air Mineral 600ml',         harga: 4000,  stok: 100,status_ketersediaan: 'Tersedia', gambar_url: img('minuman_aqua.jpg'),    kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: KETIGANYA },
{ id: 19, kategori_id: 2, is_active: true, nama_produk: 'Bear Brand Susu Steril 189ml',   harga: 10500, stok: 40, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_bearbrand.jpg'),kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: KEDUANYA },
{ id: 20, kategori_id: 2, is_active: true, nama_produk: 'Milo Activ-Go Cokelat 22g x 11', harga: 32000, stok: 15, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_milo.jpg'),    kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: PUTRI },
{ id: 21, kategori_id: 2, is_active: true, nama_produk: 'Teh Botol Sosro Kotak 200ml',    harga: 5000,  stok: 55, status_ketersediaan: 'Tersedia', gambar_url: img('minuman_tehbot.jpg'),  kategori: { id: 2, nama_kategori: 'Minuman' }, produk_marts: KEDUANYA },

// ── SNACK (tambahan) ──────────────────────────────────────────────────
{ id: 31, kategori_id: 4, is_active: true, nama_produk: 'SilverQueen Chocolate Bar',      harga: 15000, stok: 25, status_ketersediaan: 'Tersedia', gambar_url: img('snack_chocolate.jpg'), kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KEDUANYA },
{ id: 32, kategori_id: 4, is_active: true, nama_produk: 'Potabee Snack Kentang 60g',      harga: 9500,  stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('snack_potabee.jpg'),   kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: PUTRA },
{ id: 34, kategori_id: 4, is_active: true, nama_produk: 'Qtela Kerupuk Singkong 105g',    harga: 11000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('snack_qtela.jpg'),     kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KETIGANYA },
{ id: 36, kategori_id: 4, is_active: true, nama_produk: 'Roma Kelapa Biskuit 135g',       harga: 8000,  stok: 45, status_ketersediaan: 'Tersedia', gambar_url: img('snack_roma.jpg'),      kategori: { id: 4, nama_kategori: 'Snack' }, produk_marts: KEDUANYA },

// ── KEBERSIHAN (tambahan) ─────────────────────────────────────────────
{ id: 43, kategori_id: 5, is_active: true, nama_produk: 'Gillette Blue3 Razor 2pcs',      harga: 22000, stok: 15, status_ketersediaan: 'Tersedia', gambar_url: img('clean_gillete.jpg'),   kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: PUTRA },
{ id: 44, kategori_id: 5, is_active: true, nama_produk: 'Harpic Pembersih Toilet 450ml',  harga: 28000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('clean_harpic.jpg'),    kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: KEDUANYA },
{ id: 45, kategori_id: 5, is_active: true, nama_produk: 'Mama Lemon Pencuci Piring 750ml',harga: 16500, stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('clean_mamalemon.jpg'), kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: KETIGANYA },
{ id: 46, kategori_id: 5, is_active: true, nama_produk: 'Molto Pelembut Pakaian 900ml',   harga: 21000, stok: 18, status_ketersediaan: 'Tersedia', gambar_url: img('clean_molto.jpg'),     kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: PUTRI },
{ id: 47, kategori_id: 5, is_active: true, nama_produk: 'Stella Pengharum Ruangan 42g',   harga: 19000, stok: 22, status_ketersediaan: 'Tersedia', gambar_url: img('clean_stella.jpg'),    kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: KEDUANYA },
{ id: 56, kategori_id: 5, is_active: true, nama_produk: 'Wipol Karbol Wangi 770ml',       harga: 14000, stok: 25, status_ketersediaan: 'Tersedia', gambar_url: img('clean_wipol.jpg'),     kategori: { id: 5, nama_kategori: 'Perlengkapan Kebersihan' }, produk_marts: KETIGANYA },

// ── ELEKTRONIK (tambahan) ─────────────────────────────────────────────
{ id: 49, kategori_id: 6, is_active: true, nama_produk: 'Earphone Handsfree Stereo',      harga: 35000, stok: 15, status_ketersediaan: 'Tersedia', gambar_url: img('electro_earphone.jpg'),kategori: { id: 6, nama_kategori: 'Elektronik' }, produk_marts: PUTRA },
{ id: 50, kategori_id: 6, is_active: true, nama_produk: 'Flashdisk SanDisk 32GB',         harga: 65000, stok: 10, status_ketersediaan: 'Tersedia', gambar_url: img('electro_flashdisk.jpg'),kategori:{ id: 6, nama_kategori: 'Elektronik' }, produk_marts: KEDUANYA },
{ id: 51, kategori_id: 6, is_active: true, nama_produk: 'Mouse Wireless Silent Click',    harga: 85000, stok: 8,  status_ketersediaan: 'Tersedia', gambar_url: img('electro_mouse.jpg'),   kategori: { id: 6, nama_kategori: 'Elektronik' }, produk_marts: KETIGANYA },

// ── ALAT TULIS (tambahan) ─────────────────────────────────────────────
{ id: 60, kategori_id: 3, is_active: true, nama_produk: 'Binder Clip Besar 12pcs',        harga: 7500,  stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('atk_binder.jpg'),     kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: KEDUANYA },
{ id: 61, kategori_id: 3, is_active: true, nama_produk: 'Kertas HVS A4 70gr 500 lembar',  harga: 45000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('atk_kertas.jpg'),     kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: PUTRA },
{ id: 62, kategori_id: 3, is_active: true, nama_produk: 'Map Plastik Folio',               harga: 4000,  stok: 50, status_ketersediaan: 'Tersedia', gambar_url: img('atk_map.jpg'),        kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: KETIGANYA },
{ id: 63, kategori_id: 3, is_active: true, nama_produk: 'Penggaris Besi 30cm',             harga: 6000,  stok: 25, status_ketersediaan: 'Tersedia', gambar_url: img('atk_penggaris.jpg'),  kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: KEDUANYA },
{ id: 64, kategori_id: 3, is_active: true, nama_produk: 'Penghapus Karet Steadler',        harga: 3500,  stok: 40, status_ketersediaan: 'Tersedia', gambar_url: img('atk_penghapus.jpg'),  kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: PUTRA },
{ id: 65, kategori_id: 3, is_active: true, nama_produk: 'Post-It Note 3x3 100 lembar',    harga: 12000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('atk_postit.jpg'),     kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: KEDUANYA },
{ id: 66, kategori_id: 3, is_active: true, nama_produk: 'Stabilo Boss Highlight 4 warna', harga: 18000, stok: 15, status_ketersediaan: 'Tersedia', gambar_url: img('atk_stabilo.jpg'),    kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: KETIGANYA },
{ id: 67, kategori_id: 3, is_active: true, nama_produk: 'Tipe-X Joyko Correction Pen',    harga: 5000,  stok: 35, status_ketersediaan: 'Tersedia', gambar_url: img('atk_tipex.jpg'),      kategori: { id: 3, nama_kategori: 'Alat Tulis' }, produk_marts: PUTRI },

// ── LAINNYA (tambahan) ────────────────────────────────────────────────
{ id: 68, kategori_id: 9, is_active: true, nama_produk: 'Gunting Serbaguna 20cm',         harga: 15000, stok: 20, status_ketersediaan: 'Tersedia', gambar_url: img('misc_gunting.jpg'),   kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: KEDUANYA },
{ id: 69, kategori_id: 9, is_active: true, nama_produk: 'Hanger Baju Plastik 6pcs',       harga: 8000,  stok: 40, status_ketersediaan: 'Tersedia', gambar_url: img('misc_hanger.jpg'),    kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: PUTRA },
{ id: 70, kategori_id: 9, is_active: true, nama_produk: 'Kapas Kecantikan 100 lembar',    harga: 9000,  stok: 30, status_ketersediaan: 'Tersedia', gambar_url: img('misc_kapas.jpg'),     kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: KETIGANYA },
{ id: 71, kategori_id: 9, is_active: true, nama_produk: 'Kayu Putih Cap Lang 60ml',       harga: 22000, stok: 25, status_ketersediaan: 'Tersedia', gambar_url: img('misc_kayuputih.jpg'), kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: KEDUANYA },
{ id: 72, kategori_id: 9, is_active: true, nama_produk: 'Korek Api Gas Besar',            harga: 5000,  stok: 50, status_ketersediaan: 'Tersedia', gambar_url: img('misc_korek.jpg'),     kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: PUTRI },
{ id: 73, kategori_id: 9, is_active: true, nama_produk: 'Plester Luka Hansaplast 10pcs',  harga: 7000,  stok: 35, status_ketersediaan: 'Tersedia', gambar_url: img('misc_plester.jpg'),   kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: KETIGANYA },
{ id: 74, kategori_id: 9, is_active: true, nama_produk: 'Sandal Jepit Swallow',           harga: 18000, stok: 15, status_ketersediaan: 'Tersedia', gambar_url: img('misc_sandal.jpg'),    kategori: { id: 9, nama_kategori: 'Lainnya' }, produk_marts: KEDUANYA },
];

export const MOCK_LATEST_PRODUCTS: Produk[] = MOCK_PRODUK.slice(0, 8);