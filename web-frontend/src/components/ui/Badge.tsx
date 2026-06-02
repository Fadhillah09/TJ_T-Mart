import { cn } from '../../utils'
 
interface BadgeProps {
  variant?: 'new' | 'sale' | 'hot' | 'out-of-stock' | 'default'
  children: React.ReactNode
  className?: string
}
 
const variants = {
  new: 'bg-[#DC2626] text-white',
  sale: 'bg-orange-500 text-white',
  hot: 'bg-pink-500 text-white',
  'out-of-stock': 'bg-gray-400 text-white',
  default: 'bg-gray-100 text-gray-700',
}
 
export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
      variants[variant], className
    )}>
      {children}
    </span>
  )
}