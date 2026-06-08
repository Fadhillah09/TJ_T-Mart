/**
 * Product Type Definition
 */
export interface Product {
  id: number;
  nama_produk: string;
  harga: number;
  stok: number;
  gambar_url?: string;
  kategori: string;
  lokasi: string[];
  rating?: number;
  deskripsi?: string;
  status_ketersediaan?: 'Tersedia' | 'Terbatas' | 'Habis';
  created_at?: string;
  updated_at?: string;
}

/**
 * Banner Type Definition
 */
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  image_path?: string;
  gradient?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * User Type Definition
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'kurir' | 'admin';
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Cart Item Type Definition
 */
export interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  product?: Product;
}

/**
 * Order Type Definition
 */
export interface Order {
  id: string;
  user_id: number;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  payment_method: 'bank_transfer' | 'e_wallet' | 'cash';
  created_at: string;
  updated_at: string;
}

/**
 * Order Item Type Definition
 */
export interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * Address Type Definition
 */
export interface Address {
  id?: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

/**
 * Review Type Definition
 */
export interface Review {
  id: string;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Mart/Store Type Definition
 */
export interface Mart {
  id: number;
  nama_mart: string;
  alamat: string;
  kota: string;
  province: string;
  phone?: string;
  email?: string;
  jam_operasional?: string;
  lokasi_koordinat?: {
    lat: number;
    lng: number;
  };
}

/**
 * Wishlist Item Type Definition
 */
export interface WishlistItem {
  id: string;
  user_id: number;
  product_id: number;
  product?: Product;
  created_at: string;
}

/**
 * Notification Type Definition
 */
export interface Notification {
  id: string;
  user_id: number;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'review';
  is_read: boolean;
  link?: string;
  created_at: string;
}

/**
 * Response Type Definition
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Pagination Type Definition
 */
export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
  has_more: boolean;
}

/**
 * Paginated Response Type Definition
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Filter Type Definition
 */
export interface ProductFilter {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  in_stock?: boolean;
  sort?: 'newest' | 'price_low' | 'price_high' | 'rating';
  page?: number;
  limit?: number;
}

/**
 * Statistics Type Definition
 */
export interface Statistics {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  new_orders_today: number;
  pending_orders: number;
}