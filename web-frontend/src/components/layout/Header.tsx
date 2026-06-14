import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useNotifStore } from "@/store/notifStore";
import { User } from "@/types/index";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/store/wishlistStore";
import { useOrderTrackingStore } from "@/store/orderTrackingStore";
// @ts-ignore
import "@styles/header.css";

interface HeaderProps {
  isUser?: boolean;
}

const BACKEND_URL = 'http://127.0.0.1:8000';

const resolveFotoUrl = (foto?: string, foto_url?: string): string | null => {
  if (foto_url) return foto_url;
  if (foto) {
    if (foto.startsWith('http')) return foto;
    return `${BACKEND_URL}/storage/${foto}`;
  }
  return null;
};

export default function Header({ isUser = true }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const user = useAuthStore((state: any) => state.user) as User | null;
  const { totalItems } = useCartStore();
  const { unreadCount } = useNotifStore();
  const { logout } = useAuth();
  const { notifications, markNotificationsAsRead, sessions } = useOrderTrackingStore();

  const userPhoto = resolveFotoUrl(user?.foto, user?.foto_url);
  const inisialNama = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const { wishlistedIds } = useWishlistStore();
  const wishlistCount = wishlistedIds.length;

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-[#930014]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-20 items-center justify-between">

          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#fee2e2] hover:text-[#dc2626] transition-all btn-active-scale shine-mobile border border-transparent hover:border-[#fecaca]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/" className="text-2xl font-extrabold tracking-tighter btn-active-scale transition-all duration-300">
              <span className="logo-animate">TJ-T Mart</span>
            </Link>
          </div>

          {isUser && (
            <div className="hidden md:block flex-1 mx-4 max-w-xl">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#dc2626] transition-colors z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari produk di TJ-T Mart"
                  className="w-full h-11 pl-11 pr-4 rounded-full border border-[#5b000b]/70 bg-gray-50 text-sm focus:outline-none focus:ring-4 focus:ring-[#930013]/20 focus:border-[#930013] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {isUser && (
              <>
                <Link
                  to="/wishlist"
                  className="nav-icon-btn btn-active-scale relative shrink-0 hidden md:flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:bg-[#930014]/10 text-black hover:text-[#930014]"
                >
                  <span className="shine-layer"></span>
                  <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="animate-badge-pulse absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-sub-header text-white text-[9px] font-bold rounded-full ring-1 ring-white">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="nav-icon-btn btn-active-scale relative shrink-0 flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:bg-[#930014]/10 text-black hover:text-[#930014]"
                >
                  <span className="shine-layer"></span>
                  <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100-4h10m-8 2a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="animate-badge-pulse absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-sub-header text-white text-[9px] font-bold rounded-full ring-1 ring-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setDropdownOpen(false);
                      if (!notifDropdownOpen) {
                        markNotificationsAsRead();
                      }
                    }}
                    className="nav-icon-btn btn-active-scale relative shrink-0 hidden md:flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:bg-[#930014]/10 text-black hover:text-[#930014] cursor-pointer"
                  >
                    <span className="shine-layer"></span>
                    <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="animate-badge-pulse absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-sub-header text-white text-[10px] font-semibold rounded-full ring-2 ring-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 divide-y divide-gray-100 z-50 overflow-hidden animate-scale-pop">
                      <div className="px-4 py-3 bg-gradient-to-r from-[#5B000B] to-[#dc2626] text-white flex justify-between items-center">
                        <p className="text-xs uppercase font-black tracking-widest">Pusat Notifikasi</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationsAsRead();
                          }}
                          className="text-[10px] font-bold text-red-100 hover:text-white underline cursor-pointer"
                        >
                          Tandai Semua Dibaca
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400 space-y-2">
                            <svg className="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-xs font-semibold">Tidak ada notifikasi pelacakan</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setNotifDropdownOpen(false);
                                navigate(`/order/success?order_id=${notif.orderId}`);
                              }}
                              className={`p-3 text-xs hover:bg-[#fee2e2]/30 cursor-pointer transition-all ${!notif.read ? 'bg-red-50/60 font-bold' : ''}`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <p className="font-extrabold text-[#5B000B]">{notif.title}</p>
                                <span className="text-[9px] text-gray-400 font-medium">
                                  {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-0.5 leading-snug font-medium line-clamp-2">{notif.message}</p>
                              <span className="text-[9px] text-red-500 font-extrabold mt-1 block">Lacak Pesanan ➔</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="shrink-0 flex items-center gap-2 px-3 h-11 rounded-full profile-btn-idle border border-transparent transition-all duration-300 btn-active-scale shine-mobile"
                >
                  <svg className="fill-current h-4 w-4 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold tracking-tight">{user.name}</span>
                  <div className="relative shrink-0 w-8 h-8 rounded-full overflow-hidden bg-[#fee2e2] text-[#930014] flex items-center justify-center border border-[#930014]/10">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        className="w-full h-full object-cover"
                        alt="Profile"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-xs font-bold uppercase text-[#930014]">${inisialNama}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-xs font-bold uppercase text-[#930014]">
                        {inisialNama}
                      </span>
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black/5 divide-y divide-gray-100 z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-white to-[#fee2e2]/30">
                      <p className="text-[10px] text-[#b91c1c] uppercase font-black tracking-widest">Manajemen Akun</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profil" onClick={() => setDropdownOpen(false)}
                        className="dropdown-item-red block px-4 py-2 text-sm font-medium">
                        Pengaturan Profil
                      </Link>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setDropdownOpen(false); logout(); }}
                        className="dropdown-logout block w-full text-left px-4 py-2 text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#fecaca] px-4 py-4 space-y-2 shadow-xl">
          <Link to="/wishlist" className="mobile-link flex items-center gap-3 py-2">
            <svg className="w-5 h-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
          </Link>
          <Link to="/cart" className="mobile-link flex items-center gap-3 py-2">
            <svg className="w-5 h-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart ({totalItems})
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              const activeSession = Object.keys(sessions)[0];
              if (activeSession) {
                navigate(`/order/success?order_id=${activeSession}`);
              } else {
                navigate('/');
              }
            }}
            className="mobile-link w-full text-left flex items-center gap-3 py-2 cursor-pointer bg-transparent border-none outline-none font-medium"
          >
            <svg className="w-5 h-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifikasi ({unreadCount})
          </button>
          {user && (
            <div className="pt-2 mt-2 border-t border-gray-100">
              <button onClick={() => logout()}
                className="mobile-link w-full text-[#b91c1c] font-bold flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}