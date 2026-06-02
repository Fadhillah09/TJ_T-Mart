import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import * as authApi from '../api/auth'
import type { LoginPayload, RegisterPayload } from '../api/auth'

export function useAuth() {
  const navigate = useNavigate()
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore()
  const { clearCart } = useCartStore()

  const login = async (data: LoginPayload) => {
    const res = await authApi.login(data)
    const { access_token, user } = res.data.data
    setAuth(user, access_token)
    toast.success(`Selamat datang, ${user.name}!`)
    // Redirect by role
    const role = user.role?.name
    if (role === 'admin' || role === 'superadmin') {
      navigate('/admin/dashboard')
    } else if (role === 'kurir') {
      navigate('/kurir/home')
    } else {
      navigate('/home')
    }
  }

  const register = async (data: RegisterPayload) => {
    await authApi.register(data)
    toast.success('Registrasi berhasil! Silakan verifikasi email Anda.')
    navigate('/login')
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {}
    clearAuth()
    clearCart()
    toast.success('Berhasil keluar')
    navigate('/login')
  }

  return { login, register, logout, user, isAuthenticated }
}