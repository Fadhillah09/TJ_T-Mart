import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
      toast.success(response.message || 'Login berhasil');
      
      const roleName = response.data.user.role?.name?.toLowerCase();
      if (roleName === 'kurir') {
        navigate('/kurir/home');
      } else if (roleName === 'admin' || roleName === 'super admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login gagal. Periksa email dan password.';
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      toast.success(response.message || 'Registrasi berhasil! Silakan cek email untuk verifikasi.');
      navigate('/login');
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      if (errors) {
        // Show first validation error
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] as string : String(firstError));
      } else {
        const message = error?.response?.data?.message || 'Registrasi gagal. Coba lagi.';
        toast.error(message);
      }
    },
  });


  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      clearCart();
      navigate('/login');
    },
    onError: () => {
      // Force clear auth even if backend fails
      clearAuth();
      clearCart();
      navigate('/login');
    }
  });

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
