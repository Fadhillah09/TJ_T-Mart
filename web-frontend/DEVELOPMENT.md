# 💻 Development Guide & Best Practices

Panduan development untuk TJ-T Mart Marketplace UI.

## 📝 Coding Standards

### File Naming
- Components: PascalCase (e.g., `BannerSlider.tsx`)
- Utils/Hooks: camelCase (e.g., `useAuth.ts`)
- Types: PascalCase (e.g., `Product.ts`)
- Styles: kebab-case (e.g., `banner-slider.css`)

### Code Organization
```typescript
// 1. Imports
import React, { useState } from 'react'
import { Heart } from 'lucide-react'

// 2. Type definitions
interface Props {
  id: number
  name: string
}

// 3. Component
const MyComponent = ({ id, name }: Props) => {
  // Logic
  return (
    // JSX
  )
}

// 4. Export
export default MyComponent
```

## 🎨 Styling Guidelines

### Color Usage

```typescript
// Always use Tailwind classes
className="bg-tj-primary text-white"

// Or use custom colors from theme
className="bg-[#d50d27]"

// Avoid inline styles (use Tailwind first)
// ❌ Bad: style={{ color: '#d50d27' }}
// ✅ Good: className="text-[#d50d27]"
```

### Responsive Classes

```typescript
// Mobile-first approach
className="
  text-sm              // Mobile: small text
  sm:text-base        // Tablet: base text
  md:text-lg          // Desktop: large text
  lg:text-xl          // Large desktop: xl text
"

// Responsive padding/margin
className="p-4 sm:p-6 md:p-8"

// Responsive grid
className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
```

### Animation Classes

```typescript
// Use predefined animations
className="animate-fade-in"
className="animate-bounce-gentle"
className="animate-pulse-subtle"

// Customize duration with inline style (if needed)
style={{ animationDuration: '0.5s' }}

// Multiple animations
className="animate-fade-in hover:animate-bounce-gentle"
```

## 🔗 Component Patterns

### Reusable Button Component

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  isLoading,
  children,
  ...props 
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#d50d27] to-[#ba0015] text-white',
    secondary: 'bg-gray-200 text-gray-800'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`
        font-bold rounded-lg
        transition-all duration-300
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin">Loading...</span>
      ) : (
        children
      )}
    </button>
  )
}
```

### Lazy Loading Component

```typescript
import { LazyExoticComponent, Suspense, lazy } from 'react'

const LazyComponent = lazy(() => import('./LazyComponent'))

export const App = () => {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

## 🚀 Performance Optimization

### Image Optimization

```typescript
// ✅ Good: Lazy loading dengan fallback
<img
  src={url}
  alt="Product"
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = fallbackImage
  }}
/>

// ❌ Bad: Loading semua images
<img src={url} alt="Product" />
```

### Memo & useCallback

```typescript
import { memo, useCallback } from 'react'

// Prevent unnecessary re-renders
const ProductCard = memo(({ product, onClick }: Props) => {
  return <div onClick={onClick}>{product.name}</div>
})

// Prevent function recreation
const handleClick = useCallback(() => {
  console.log('Clicked')
}, [])
```

### Code Splitting

```typescript
// Split large components
const DetailModal = lazy(() => import('./DetailModal'))

// Or route-based splitting dengan React Router
const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/products',
    element: <Suspense><Products /></Suspense>
  }
]
```

## ✅ Testing Checklist

### Browser Testing
- [ ] Chrome/Chromium latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### Responsive Testing
- [ ] Mobile (375px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Ultra-wide (1440px+)

### Functionality Testing
- [ ] Cart add/remove
- [ ] Wishlist toggle
- [ ] Filter products
- [ ] Banner slider navigation
- [ ] Search functionality
- [ ] Form submission

### Performance Testing
- [ ] Page load < 3s
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] No console warnings
- [ ] Lighthouse score > 90

## 🐛 Debugging Tips

### Check Performance
```javascript
// Chrome DevTools Console
performance.measure('myMeasure')
performance.mark('myMark')

// or use the Performance API
const entries = performance.getEntriesByType('measure')
```

### React DevTools
1. Install React DevTools extension
2. Inspect components
3. Check props/state changes
4. Highlight re-renders

### Network Debugging
1. Open DevTools → Network
2. Monitor API calls
3. Check response time
4. Verify data format

## 📦 Adding Dependencies

### Install Package
```bash
npm install package-name
```

### Install Dev Dependency
```bash
npm install --save-dev package-name
```

### Update Dependencies
```bash
npm update package-name
npm outdated  # Check for outdated packages
```

### Uninstall Package
```bash
npm uninstall package-name
```

## 🔐 Security Best Practices

### XSS Prevention
```typescript
// ❌ Bad: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good: Let React handle escaping
<div>{userInput}</div>
```

### API Security
```typescript
// ✅ Good: Use HTTPS only
const apiUrl = import.meta.env.VITE_API_BASE_URL

// ✅ Good: Validate inputs
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ✅ Good: Sanitize output
const sanitize = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
```

## 📊 Git Workflow

### Branch Naming
```
feature/add-new-component
fix/wishlist-bug
refactor/optimize-performance
docs/update-readme
```

### Commit Messages
```
✨ feat: Add wishlist pulsing animation
🐛 fix: Fix banner slider navigation bug
♻️  refactor: Optimize product card rendering
📝 docs: Update installation guide
🎨 style: Format code with prettier
⚡ perf: Add image lazy loading
```

### Before Pushing
```bash
# Format code
npm run lint

# Type check
npm run type-check

# Build test
npm run build
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Performance optimized
- [ ] SEO meta tags added
- [ ] Analytics configured
- [ ] Environment variables set

### Build & Deploy
```bash
# Build production
npm run build

# Preview build locally
npm run preview

# Deploy to hosting
# (Vercel, Netlify, etc.)
```

### Post-Deployment
- [ ] Test in production
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify performance
- [ ] Monitor user feedback

## 📚 Useful Resources

### Documentation
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)

### Tools
- [VSCode Extensions](https://marketplace.visualstudio.com)
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin
  - Prettier - Code formatter
  - ESLint

### Learning Resources
- [Web.dev](https://web.dev)
- [CSS-Tricks](https://css-tricks.com)
- [Dev.to](https://dev.to)
- [Smashing Magazine](https://www.smashingmagazine.com)

## 💡 Tips & Tricks

### Quick Start New Component
```bash
# Create component file structure
mkdir -p src/components/YourComponent
touch src/components/YourComponent/index.tsx
touch src/components/YourComponent/YourComponent.tsx
```

### Tailwind Cheat Sheet
```typescript
// Colors
className="text-[#d50d27]"          // Custom color
className="bg-gray-100"              // Named color
className="hover:bg-gray-200"        // Hover state

// Sizing
className="w-full h-32"             // Width & height
className="px-4 py-2"               // Padding
className="mx-auto"                 // Margin auto

// Flexbox
className="flex items-center justify-between"

// Grid
className="grid grid-cols-3 gap-4"

// Responsive
className="md:flex lg:grid"
```

### Common Patterns
```typescript
// Conditional classes
className={`base-class ${condition ? 'conditional-class' : ''}`}

// Multiple conditions
className={clsx(
  'base-class',
  condition1 && 'class-1',
  condition2 && 'class-2'
)}

// Dynamic objects
const classes = {
  primary: 'bg-blue-500',
  secondary: 'bg-gray-500'
}
className={classes['primary']}
```

---

Happy Coding! 🎉

Questions? Check README.md or create an issue.