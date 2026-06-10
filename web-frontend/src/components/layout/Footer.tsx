// @ts-ignore
import "@/styles/footer.css"

interface FooterProps {
  isUser?: boolean
  year?: number
}

export default function Footer({
  isUser = true,
  year = new Date().getFullYear(),
}: FooterProps) {
  if (!isUser) return null

  return (
    <footer className="bg-[#5B000B] text-white py-12 pb-1 font-sans border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="/"
              className="text-xl font-bold tracking-wide text-white hover:text-[#DB4B3A] transition"
            >
              TJ-T Mart
            </a>

            <p className="text-[12px] text-gray-200 leading-relaxed max-w-[200px] font-medium opacity-90 mt-4">
              Belanja kebutuhan asrama dengan cepat dan mudah.
            </p>
          </div>

          {/* MENU */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              Menu
            </h4>
            <ul className="space-y-3">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/wishlist" className="footer-link">Wishlist</a></li>
              <li><a href="/cart" className="footer-link">Cart</a></li>
            </ul>
          </div>

          {/* BANTUAN */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              Bantuan
            </h4>
            <ul className="space-y-3">
              <li><a href="/faq" className="footer-link">FAQ</a></li>
              <li><a href="/kontak" className="footer-link">Kontak</a></li>
              <li><a href="/tentang-kami" className="footer-link">Tentang Kami</a></li>
            </ul>
          </div>

          {/* ASRAMA */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
              Asrama
            </h4>
            <p className="text-[11px] text-gray-200 italic">
              Gedung Asrama Putra & Putri.
            </p>
            <p className="text-[11px] text-gray-200 font-bold mt-2">
              Lokasi dan Layanan Asrama.
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-red-300/60 uppercase tracking-widest">
            © {year} TJ-T Mart — All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="footer-social">Instagram</a>
            <a href="#" className="footer-social">Telegram</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
