import { useState } from "react"
import "@/styles/header.css"

interface HeaderProps {
  isUser?: boolean
  cartCount?: number
  wishlistCount?: number
  notifCount?: number
  user?: {
    name: string
    avatar?: string | null
  }
}

export default function Header({
  isUser = true,
  cartCount = 0,
  wishlistCount = 0,
  notifCount = 0,
  user,
}: HeaderProps) {
  const [open, setOpen] = useState(false)

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
            <a href="/" className="text-2xl font-extrabold tracking-tighter">
              <span className="logo-animate">TJ&TMart</span>
            </a>
          </div>

          {/* SEARCH */}
          {isUser && (
            <div className="hidden md:block flex-1 mx-4 max-w-xl">
              <input
                type="text"
                placeholder="Cari produk di TJ&TMart"
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
                <a href="/wishlist" className="nav-icon-btn">
                  ❤️
                  {wishlistCount > 0 && (
                    <span className="nav-badge">{wishlistCount}</span>
                  )}
                </a>

                {/* CART */}
                <a href="/cart" className="nav-icon-btn">
                  🛒
                  {cartCount > 0 && (
                    <span className="nav-badge">{cartCount}</span>
                  )}
                </a>

                {/* NOTIF */}
                <a href="/notifications" className="nav-icon-btn">
                  🔔
                  {notifCount > 0 && (
                    <span className="nav-badge">{notifCount}</span>
                  )}
                </a>
              </>
            )}

            {/* PROFILE */}
            {user && (
              <div className="flex items-center gap-2 px-3 h-11 rounded-full profile-btn-idle">
                <span className="text-sm font-bold">{user.name}</span>
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full">👤</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-2 shadow-xl">
          <a href="/wishlist" className="mobile-link">Wishlist</a>
          <a href="/cart" className="mobile-link">Cart</a>
          <a href="/notifications" className="mobile-link">Notifikasi</a>
        </div>
      )}
    </nav>
  )
}
