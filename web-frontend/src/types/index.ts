export interface Role {
  id: number;
  name: string;
}

export interface Mart {
  id: number;
  nama_mart: string;
  alamat: string;
  status: string;
  is_active: boolean;
}

export interface LokasiDelivery {
  id: number;
  mart_id: number;
  nama_lokasi: string;
  nama_gedung: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: number;
  role_id: number;
  name: string;
  email: string;
  phone?: string;
  foto?: string;
  foto_url?: string;
  nomor_kamar?: string;
  penghuni_asrama: boolean;
  active_mart_id?: number;
  lokasi_id?: number;
  status: string;
  email_verified_at?: string;
  last_login_at?: string;
  role?: Role;
  active_mart?: Mart;
  lokasi?: LokasiDelivery;
}

export interface KategoriProduk {
  id: number;
  nama_kategori: string;
  produk_count?: number;
}

export interface Produk {
  id: number;
  kategori_id: number;
  nama_produk: string;
  deskripsi?: string;
  harga: number;
  stok: number;
  gambar?: string;
  gambar_url?: string;
  is_active: boolean;
  status_ketersediaan?: string;
  persentase_diskon?: number;
  avg_rating?: number;
  total_reviews?: number;
  is_wishlisted?: boolean;
  kategori?: KategoriProduk;
  produk_marts?: any[];
  created_at?: string;
}

export interface Banner {
  id: number;
  title: string;
  image_path: string;
  redirect_url?: string;
  order: number;
  is_active: boolean;
}

export interface BackendCartItem {
  id: number;
  cart_id: number;
  produk_id: number;
  quantity: number;
  harga?: number;
  subtotal?: number;
  produk?: Produk;
}

export interface Cart {
  id: number;
  user_id: number;
  items?: BackendCartItem[];
  created_at: string;
}

export interface CartItem {
  id           : number;
  product_id   : number;
  product_name : string;
  mart_id      : number;
  mart_name    : string;
  mart_address?: string;
  qty          : number;
  price        : number;
  image_url?   : string;
}

export interface CheckoutForm {
  type            : "delivery" | "takeaway";
  mart_id         : number;
  kamar           : string;
  payment_method  : "cod" | "transfer";
  note            : string;
}

export interface OrderPayload extends CheckoutForm {
  items: { product_id: number; qty: number; price: number }[];
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export interface DetailPembelian {
  id: number;
  nama_produk: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
}

export interface RiwayatPembelian {
  id: number;
  user_id: number;
  kurir_id?: number;
  order_id: string;
  tipe_layanan: string;
  status: string;
  total: number;
  ongkir: number;
  metode_pembayaran: string;
  alamat_pengantaran?: string;
  tanggal_pesan: string;
  details?: DetailPembelian[];
}

export interface GalonTransaction {
  id: number;
  nama_galon: string;
  jumlah: number;
  total_harga: number;
  ongkir: number;
  status: string;
  metode_pembayaran: string;
  metode_pengiriman: string;
  catatan?: string;
  created_at?: string;
}

export interface TokenTransaction {
  id: number;
  nominal: number;
  nomor_token?: string;
  status: string;
  metode_pembayaran: string;
  created_at?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count?: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: PaginatedData<T>;
}