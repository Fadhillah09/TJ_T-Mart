import Header from "@/components/layout/Header"
import SubHeader from "@/components/layout/SubHeader"
import Footer from "@/components/layout/Footer"

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

export default function MainLayout({
  children,
  user,
  activeMart,
}: MainLayoutProps) {
  const isUser = user?.role === "user"

  return (
    <>
      <Header
        isUser={isUser}
        user={user ? { name: user.name } : undefined}
      />

      {isUser && <SubHeader activeMart={activeMart} />}

      <main className={isUser ? "pt-[120px]" : "pt-[80px]"}>
        {children}
      </main>

      <Footer isUser={isUser} />
    </>
  )
}
