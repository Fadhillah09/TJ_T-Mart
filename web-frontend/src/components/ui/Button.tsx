import { cn } from '../../utils'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
  outline: 'border border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2]',
  ghost: 'text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-700 hover:bg-red-800 text-white',
}

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary', size = 'md', loading, disabled, children, className, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        variants[variant], sizes[size], className
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}