import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useNotifStore } from "@/store/notifStore";
import { User } from "@/types/index";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
// @ts-ignore
import "@styles/header.css";

interface HeaderProps {
  isUser?: boolean;
}

export default function Header({ isUser = true }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = useAuthStore((state: any) => state.user) as User | null;
  const { totalItems } = useCartStore();
  const { unreadCount } = useNotifStore();
  const { logout } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-[#930014]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full
                hover:bg-[#fee2e2] hover:text-[#dc2626] transition-all btn-active-scale shine-mobile"
            >
              ☰
            </button>

            {/* LOGO */}
            <Link to="/" className="text-2xl font-extrabold tracking-tighter">
              <span className="logo-animate">TJ-T Mart</span>
            </Link>
          </div>

          {/* SEARCH */}
          {isUser && (
            <div className="hidden md:block flex-1 mx-4 max-w-xl">
              <input
                type="text"
                placeholder="Cari produk di TJ-T Mart"
                className="w-full h-11 px-5 rounded-full border
                  focus:ring-4 focus:ring-[#930013]/20
                  border-[#5b000b]/70"
              />
            </div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {isUser && (
              <>
                {/* WISHLIST */}
                <Link to="/wishlist" className="nav-icon-btn">
                  ❤️
                </Link>

                {/* CART */}
                <Link to="/cart" className="nav-icon-btn relative">
                  🛒
                  {totalItems > 0 && (
                    <span className="nav-badge">{totalItems}</span>
                  )}
                </Link>

                {/* NOTIF */}
                <Link to="/notifications" className="nav-icon-btn relative">
                  🔔
                  {unreadCount > 0 && (
                    <span className="nav-badge">{unreadCount}</span>
                  )}
                </Link>
              </>
            )}

            {/* PROFILE */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 h-11 rounded-full profile-btn-idle hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <span className="text-sm font-bold">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    {user?.foto_url ? (
                      <img
                        src={user.foto_url}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <span className="flex items-center justify-center h-full">
                        👤
                      </span>
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                    <div className="py-1">
                      <Link
                        to="/profil"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-2 shadow-xl">
          <Link to="/wishlist" className="mobile-link block py-2">
            Wishlist
          </Link>
          <Link to="/cart" className="mobile-link block py-2">
            Cart ({totalItems})
          </Link>
          <Link to="/notifications" className="mobile-link block py-2">
            Notifikasi ({unreadCount})
          </Link>
        </div>
      )}
    </nav>
  );
}
