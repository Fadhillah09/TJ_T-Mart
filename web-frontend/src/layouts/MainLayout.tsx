import Header from "@/components/layout/Header"
import SubHeader from "@/components/layout/SubHeader"
import Footer from "@/components/layout/Footer"
import { Toaster } from 'react-hot-toast'
import { useCartStore } from '../store/cartStore'
import { useNotifStore } from '../store/notifStore'
import { useAuthStore } from '../store/authStore'

interface MainLayoutProps {
  children: React.ReactNode
}



interface User {
  id: number
  name: string
  role: "user" | "admin" | "super_admin"
}

interface Mart {
  id: number
  nama_mart: string
}

interface MainLayoutProps {
  children: React.ReactNode
  user?: User | null
  activeMart?: Mart | null
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { totalItems } = useCartStore()
  const { unreadCount } = useNotifStore()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Header
        isUser={!!user}
        cartCount={totalItems}
        notifCount={unreadCount}
        user={user ? { name: user.name, avatar: user.foto_url ?? null } : undefined}
      />
      <SubHeader activeMart={user?.active_mart ?? null} />
      {/* Offset for fixed header + subheader (80px + 40px) */}
      <main className="flex-1 pt-[120px]">
        {children}
      </main>
      <Footer isUser={!!user} />
    </div>
  )
}
