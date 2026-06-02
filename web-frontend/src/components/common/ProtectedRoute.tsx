import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
 
interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}
 
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
 
  if (allowedRoles && user?.role?.name && !allowedRoles.includes(user.role.name)) {
    return <Navigate to="/home" replace />
  }
 
  return <>{children}</>
}