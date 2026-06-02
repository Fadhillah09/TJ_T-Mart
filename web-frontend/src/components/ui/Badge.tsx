import React from 'react';
import { cn } from '@/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'new' | 'sale' | 'hot' | 'out-of-stock' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    new: 'bg-green-100 text-green-800',
    sale: 'bg-yellow-100 text-yellow-800',
    hot: 'bg-red-100 text-red-800',
    'out-of-stock': 'bg-gray-100 text-gray-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
