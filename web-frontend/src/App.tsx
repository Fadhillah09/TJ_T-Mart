// src/App.tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './components/common/ProtectedRoute'

// Auth pages (eager — fast load)
import Login from './pages/Login'
import Register from './pages/Register'

// Lazy load semua halaman lain
const CustomerHome    = lazy(() => import('./pages/customer/Home'))
// const ProdukList      = lazy(() => import('./pages/customer/ProdukList'))
// const ProdukDetail    = lazy(() => import('./pages/customer/ProdukDetail'))
// const CartPage        = lazy(() => import('./pages/customer/Cart'))
// const WishlistPage    = lazy(() => import('./pages/customer/Wishlist'))
// const OrdersPage      = lazy(() => import('./pages/customer/Orders'))
// const OrderDetailPage = lazy(() => import('./pages/customer/OrderDetail'))
// const GalonPage       = lazy(() => import('./pages/customer/Galon'))
// const TokenPage       = lazy(() => import('./pages/customer/Token'))
// const NotifikasiPage  = lazy(() => import('./pages/customer/Notifikasi'))
// const ProfilPage      = lazy(() => import('./pages/customer/Profil'))
const AdminDashboard  = lazy(() => import('./pages/admin/Dashboard'))
const KurirHome       = lazy(() => import('./pages/kurir/Home'))
const DeliveryMap     = lazy(() => import('./pages/kurir/DeliveryMap'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const role = user?.role?.name
  if (role === 'admin' || role === 'superadmin') return <Navigate to="/admin/dashboard" replace />
  if (role === 'kurir') return <Navigate to="/kurir/home" replace />
  return <Navigate to="/home" replace />
}

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<RootRedirect />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            {/* Customer */}
            <Route path="/home"         element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
            {/* <Route path="/produk"       element={<ProtectedRoute><ProdukList /></ProtectedRoute>} />
            <Route path="/produk/:id"   element={<ProtectedRoute><ProdukDetail /></ProtectedRoute>} />
            <Route path="/cart"         element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/wishlist"     element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/orders"       element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id"   element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/galon"        element={<ProtectedRoute><GalonPage /></ProtectedRoute>} />
            <Route path="/token"        element={<ProtectedRoute><TokenPage /></ProtectedRoute>} />
            <Route path="/notifikasi"   element={<ProtectedRoute><NotifikasiPage /></ProtectedRoute>} />
            <Route path="/profil"       element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} /> */}

            {/* Admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Kurir */}
            <Route path="/kurir/home" element={
              <ProtectedRoute allowedRoles={['kurir']}>
                <KurirHome />
              </ProtectedRoute>
            } />
            <Route path="/kurir/delivery-map" element={
              <ProtectedRoute allowedRoles={['kurir']}>
                <DeliveryMap />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  )
}