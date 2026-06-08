import { useState } from "react"
// @ts-ignore
import '@styles/sub-header.css';

interface Mart {
  id: number
  nama_mart: string
}

interface SubHeaderProps {
  activeMart?: Mart | null
}

export default function SubHeader({ activeMart }: SubHeaderProps) {
  const [openMart, setOpenMart] = useState(false)

  const links = [
    { name: "Beranda", url: "/", mobileHidden: false },
    { name: "Produk", url: "/produk", mobileHidden: false },
    { name: "Kontak", url: "/kontak", mobileHidden: true },
    { name: "Tentang Kami", url: "/tentang-kami", mobileHidden: true },
  ]

  return (
    <div className="fixed top-[80px] z-40 w-full bg-sub-header text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b border-[#E7BD8A]/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-10 text-sm overflow-hidden">

          {/* LEFT MENU */}
          <ul className="flex items-center gap-1 font-semibold h-full">
            {links.map((link, index) => (
              <div key={link.name} className="flex items-center h-full">
                {index > 0 && (
                  <li className="hidden sm:block h-5 w-[1px]
                    bg-gradient-to-b from-transparent via-[#E7BD8A]/40 to-transparent" />
                )}

                <li
                  className={`${link.mobileHidden ? "hidden sm:block" : ""} h-full flex items-center`}
                >
                  <a
                    href={link.url}
                    className="nav-link-shine btn-click-effect relative flex items-center h-full px-3 transition-all duration-300 hover:text-[#fee2e2] group"
                  >
                    <span className="relative z-10">{link.name}</span>

                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></span>

                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px]
                      bg-gradient-to-r from-[#dc2626] via-[#E7BD8A] to-[#dc2626]
                      transition-all duration-500 group-hover:w-full"></span>
                  </a>
                </li>
              </div>
            ))}
          </ul>

          {/* PRIORITY MART BUTTON */}
          <button
            onClick={() => setOpenMart(true)}
            className="mart-button-premium crystal-shine btn-click-effect flex items-center gap-2 px-3 h-8 rounded-full
              text-white transition-all duration-300 group overflow-hidden"
          >
            <div className="flex flex-col items-end leading-none">
              <span className="text-[8px] uppercase tracking-[0.12em] text-[#fecaca] font-black group-hover:text-white transition-colors">
                Prioritas Toko
              </span>
            </div>

            <div className="p-1.5 bg-gradient-to-br from-[#5B000B] to-[#b91c1c] rounded-full
              group-hover:from-[#dc2626] group-hover:to-[#DB4B3A]
              transition-all duration-300 shadow-lg border border-white/10"
            >
              <div className="floating-icon text-[#E7BD8A] group-hover:text-white transition-colors">
                {/* MAP PIN ICON */}
              </div>
            </div>

            <span className="font-extrabold text-transparent bg-clip-text
              bg-gradient-to-r from-[#E7BD8A] to-[#E68757]
              group-hover:from-white group-hover:to-[#fee2e2]
              transition-all duration-300 drop-shadow-md
              max-w-[140px] truncate whitespace-nowrap"
            >
              {activeMart?.nama_mart ?? "Semua Mart"}
            </span>
          </button>
        </div>
      </div>

      {/* MODAL MART SELECTOR */}
      {openMart && (
        <div>
          {/* nanti isi MartSelector.tsx */}
        </div>
      )}
    </div>
  )
}
