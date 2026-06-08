import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useNotifStore } from '@/store/notifStore';
import { useAuth } from '@/hooks/useAuth';

interface HomeHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  onMartPickerOpen: () => void;
  activeMartName: string;
}

export default function HomeHeader({ search, onSearchChange, onMartPickerOpen, activeMartName }: HomeHeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { totalItems } = useCartStore();
  const { unreadCount } = useNotifStore();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ── TOP BAR ── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-extrabold text-[#ba0015] shrink-0 tracking-tight hover:opacity-80 transition-opacity"
        >
          TJ-T Mart
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari produk di TJ-T Mart"
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-[#ba0015] focus:ring-2 focus:ring-[#ba0015]/10 outline-none text-sm bg-gray-50 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-1">
          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ba0015] text-white text-[9px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ba0015] text-white text-[9px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* User */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                  {user.name?.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-sm text-gray-500">expand_more</span>
                <img
                  src={user.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=ba0015&color=fff&size=64`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ba0015]/20"
                />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { navigate('/profile'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">person</span>Profil Saya
                    </button>
                    <button onClick={() => { navigate('/orders'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">receipt_long</span>Pesanan Saya
                    </button>
                    <div className="border-t border-gray-100">
                      <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-[#ba0015] font-semibold hover:bg-red-50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">logout</span>Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-[#ba0015] text-white text-sm font-bold rounded-full hover:bg-[#9c0012] transition-colors"
            >
              Masuk
            </button>
          )}
        </div>
      </div>

      {/* ── RED NAV BAR ── */}
      <div className="bg-[#9c0012] hidden md:block">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-11 flex items-center justify-between">
          <nav className="flex items-center gap-7 text-sm font-semibold text-white/90">
            <a href="/" className="hover:text-white transition-colors py-3 border-b-2 border-transparent hover:border-white/60">Beranda</a>
            <a href="#produk" className="hover:text-white transition-colors py-3 border-b-2 border-transparent hover:border-white/60">Produk</a>
            <a href="#" className="hover:text-white transition-colors py-3 border-b-2 border-transparent hover:border-white/60">Kontak</a>
            <a href="#" className="hover:text-white transition-colors py-3 border-b-2 border-transparent hover:border-white/60">Tentang Kami</a>
          </nav>
          <button
            onClick={onMartPickerOpen}
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
          >
            <span className="text-[10px] font-black tracking-widest opacity-70 uppercase">PRIORITAS TOKO</span>
            <span className="w-px h-4 bg-white/30" />
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span className="font-semibold">{activeMartName}</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg px-4 py-3 space-y-1">
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:border-[#ba0015] outline-none"
            />
          </div>
          <button onClick={() => navigate('/wishlist')} className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#ba0015]">favorite</span>Wishlist
          </button>
          <button onClick={() => navigate('/cart')} className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#ba0015]">shopping_cart</span>Keranjang {totalItems > 0 && <span className="ml-auto bg-[#ba0015] text-white text-[10px] px-1.5 py-0.5 rounded-full">{totalItems}</span>}
          </button>
          {isAuthenticated ? (
            <button onClick={() => logout()} className="w-full text-left px-3 py-2.5 text-sm text-[#ba0015] font-semibold hover:bg-red-50 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">logout</span>Keluar
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="w-full text-left px-3 py-2.5 text-sm text-[#ba0015] font-semibold hover:bg-red-50 rounded-lg">Masuk</button>
          )}
        </div>
      )}
    </header>
  );
}
