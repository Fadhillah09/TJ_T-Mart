# 📁 File Structure & Description

Penjelasan lengkap semua file yang telah dibuat untuk TJ-T Mart Marketplace UI.

## 📦 Project Structure

```
tj-t-mart-ui/
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & npm scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── tailwind.config.ts          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── vite.config.ts              # Vite build configuration
│   ├── .eslintrc.json              # ESLint configuration
│   ├── .env.example                # Environment template
│   └── .gitignore                  # Git ignore rules
│
├── 📘 Documentation Files
│   ├── README.md                   # Dokumentasi utama
│   ├── INSTALLATION.md             # Panduan instalasi lengkap
│   ├── DEVELOPMENT.md              # Development guide & best practices
│   └── FILE_STRUCTURE.md           # File ini
│
├── 🌐 Entry Point
│   ├── index.html                  # HTML template (Vite)
│   └── main.tsx                    # React entry point
│
├── 📱 Application Files
│   ├── App.tsx                     # Root component
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx            # Main marketplace page
│   │   │
│   │   ├── components/
│   │   │   ├── BannerSlider.tsx    # Banner slider component
│   │   │   └── ProductCard.tsx     # Product card component
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css         # Global styles & animations
│   │   │
│   │   ├── types.ts                # TypeScript type definitions
│   │   └── utils.ts                # Utility functions
│   │
│   └── public/
│       └── (static assets)         # Images, icons, etc.
│
├── 📦 Build Output (after npm run build)
│   └── dist/
│       ├── index.html
│       ├── assets/
│       │   ├── index-[hash].js
│       │   └── index-[hash].css
│       └── vite.svg
│
└── 📚 Dependencies (after npm install)
    └── node_modules/
        └── (semua dependencies terinstall)
```

## 📄 File Descriptions

### Configuration Files

#### `package.json`
**Fungsi**: Mendefinisikan dependencies, scripts, dan metadata project

**Isi Penting**:
```json
{
  "scripts": {
    "dev": "vite",                    // Start dev server
    "build": "tsc && vite build",     // Build production
    "preview": "vite preview",        // Preview build
    "lint": "eslint ...",             // Check code quality
    "type-check": "tsc --noEmit"      // Type checking
  },
  "dependencies": {
    "react": "^18.2.0",
    "lucide-react": "^0.303.0",
    "react-router-dom": "^6.20.0"
  }
}
```

**Modifikasi**: 
- Update versi dependencies dengan `npm update`
- Tambah dependencies baru dengan `npm install package-name`

---

#### `tsconfig.json`
**Fungsi**: Konfigurasi TypeScript

**Penting**:
- `target: "ES2020"` - Output JavaScript version
- `strict: true` - Strict type checking
- `paths` - Import aliases (@/components, dll)

**Gunakan**:
```typescript
// Dengan path alias
import Button from '@/components/Button'

// Bukan
import Button from '../../../components/Button'
```

---

#### `tailwind.config.ts`
**Fungsi**: Konfigurasi Tailwind CSS dengan custom colors & animations

**Custom Sections**:
```typescript
colors.tj            // TJ-T Mart colors
animations           // Custom animations (pulse-subtle, fade-in, dll)
keyframes            // Animation definitions
spacing              // Safe area spacing untuk mobile
```

**Modifikasi**: Ubah warna/animasi di sini sebelum menggunakan di component

---

#### `postcss.config.js`
**Fungsi**: Process CSS dengan Tailwind & Autoprefixer

**Tidak perlu dimodifikasi** kecuali menggunakan plugin CSS tambahan

---

#### `vite.config.ts`
**Fungsi**: Konfigurasi Vite build tool

**Penting**:
- React plugin untuk JSX support
- Path aliases (@/)
- Build optimizations
- Development server port

---

#### `.eslintrc.json`
**Fungsi**: Konfigurasi code linting & quality

**Fitur**:
- TypeScript support
- React hooks linting
- Unused vars detection

**Gunakan**: `npm run lint` untuk check code quality

---

#### `.env.example`
**Fungsi**: Template untuk environment variables

**Penggunaan**:
1. Copy: `cp .env.example .env.local`
2. Edit .env.local dengan nilai sesuai
3. Access di code: `import.meta.env.VITE_API_BASE_URL`

---

#### `.gitignore`
**Fungsi**: Mengabaikan file tertentu dari git

**Penting file yang diabaikan**:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.env.local` - Environment secrets
- `.DS_Store` - macOS files

---

### Documentation Files

#### `README.md`
**Isi**:
- Deskripsi project
- Features
- Component documentation
- Color palette
- Customization guide
- API integration
- Browser support
- Performance tips

**Gunakan**: Sebagai main documentation referensi

---

#### `INSTALLATION.md`
**Isi**:
- Prerequisites (Node.js, npm)
- Step-by-step setup
- Project structure
- Environment variables
- Development server setup
- Mobile testing
- Production build
- Troubleshooting

**Gunakan**: Ketika setup project baru atau bantuan installasi

---

#### `DEVELOPMENT.md`
**Isi**:
- Coding standards
- Styling guidelines
- Component patterns
- Performance optimization
- Testing checklist
- Git workflow
- Deployment checklist
- Resources & tips

**Gunakan**: Selama development untuk best practices

---

#### `FILE_STRUCTURE.md`
**File ini** - Penjelasan semua file dalam project

---

### Entry Point Files

#### `index.html`
**Fungsi**: HTML template untuk Vite

**Penting**:
- Defines `<div id="root">` (React mount point)
- Meta tags untuk SEO & mobile
- Font preloading
- Script entry: `main.tsx`

**Modifikasi**:
- Update title: `<title>Your App Name</title>`
- Add meta tags untuk SEO
- Update favicon: `href="/favicon.svg"`

---

#### `main.tsx`
**Fungsi**: React application entry point

**Isi**:
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Modifikasi**: Setup providers (Router, Theme, dll) di sini

---

### Application Files

#### `App.tsx`
**Fungsi**: Root component yang membungkus seluruh aplikasi

**Isi**:
```typescript
import Home from './pages/Home'
import './styles/globals.css'

function App() {
  return <Home />
}
```

**Modifikasi**:
- Setup Router
- Add providers (Redux, Context, dll)
- Global layout (Header, Footer)

---

#### `src/pages/Home.tsx`
**Fungsi**: Main marketplace page

**Fitur**:
- Sticky header dengan search & icons
- Welcome section
- Banner slider
- Category filter (Semua, Makanan, Minuman)
- Product grid dengan 12 mock products
- Responsive untuk semua ukuran
- Shopping cart counter
- Wishlist management
- Floating action button

**State Management**:
```typescript
wishlistedIds: Set<number>    // IDs dari wishlisted products
cartCount: number             // Total items di cart
selectedCategory: string      // Filter kategori
scrollY: number              // Scroll position
```

**Props/Functions**:
- `handleAddToCart()` - Add product ke cart
- `handleToggleWishlist()` - Toggle wishlist status
- `setSelectedCategory()` - Filter by category

**Modifikasi**:
- Replace mock data dengan API
- Connect ke backend services
- Add toast notifications
- Implement actual cart/wishlist

---

#### `src/components/BannerSlider.tsx`
**Fungsi**: Interactive banner slider dengan gradient animation

**Fitur**:
- 4 banners dengan gradient overlay
- Auto-rotate setiap 5 detik
- Manual navigation (prev/next)
- Dot indicators
- Responsive sizing (h-64 sm:h-80 md:h-96)
- Pause on hover
- Slide counter
- CTA button

**Props**: None (data hardcoded, bisa diubah)

**Animations**:
- `animate-slide-up` - Content slide up
- Gradient overlay dengan opacity

**Modifikasi**:
- Update FALLBACK_BANNERS array untuk custom banners
- Change auto-rotate interval (currently 5000ms)
- Customize gradient colors

---

#### `src/components/ProductCard.tsx`
**Fungsi**: Product card dengan wishlist pulsing effect

**Fitur**:
- Image lazy loading dengan shimmer
- Stock progress bar
- Wishlist button dengan pulsing animation (hover)
- Add to cart button
- Rating display
- Location information
- Disabled state untuk habis
- Loading state saat add to cart

**Props**:
```typescript
produk: Product
wishlistedIds: Set<number>
onAddToCart: (produk) => void
onToggleWishlist: (produk) => void
isAdding: boolean
```

**Animations**:
- `animate-pulse-subtle` - Wishlist hover
- Shimmer loading effect
- Hover lift & scale

**Key Features**:
- Pulsing red ring saat wishlist di-hover
- Stock bar color change (green > orange)
- Image scale up on hover
- Smooth transitions

---

#### `src/styles/globals.css`
**Fungsi**: Global styles & custom animations

**Sections**:

1. **Keyframes** - Definisi animations:
   - pulse-subtle, fade-in, slide-up
   - bounce-gentle, shimmer, glow-pulse
   - float, scale-pop, rotate-spin

2. **Utility Classes** - CSS classes:
   - .animate-* (semua animations)
   - .scrollbar-hide (hide scrollbar)
   - .glass (glassmorphism)

3. **Global Styles** - Element defaults:
   - Font family
   - Selection color
   - Focus states
   - Disabled states

4. **Responsive Fixes** - Mobile/tablet specific

5. **Accessibility** - prefers-reduced-motion

**Import di**: App.tsx atau main.tsx

**Modifikasi**: Add custom animations/styles di sini

---

#### `src/types.ts`
**Fungsi**: TypeScript type definitions

**Main Types**:
```typescript
Product          // Product item
Banner           // Banner item
User             // User profile
CartItem         // Cart item
Order            // Order info
ApiResponse<T>   // API response format
PaginatedResponse // Paginated API response
```

**Penggunaan**:
```typescript
import { Product } from '@/types'

const product: Product = {
  id: 1,
  nama_produk: 'Indomie',
  harga: 2500,
  // ...
}
```

**Modifikasi**: Tambah types baru sesuai kebutuhan

---

#### `src/utils.ts`
**Fungsi**: Utility functions & helpers

**Function Categories**:

1. **Formatting**:
   - `formatRupiah(num)` - Format ke IDR currency
   - `formatNumber(num)` - Format dengan separator
   - `truncate(text, length)` - Truncate text

2. **String Utils**:
   - `getInitials(name)` - Get initials dari nama
   - `validateEmail(email)` - Email validation

3. **Performance**:
   - `debounce(func, delay)` - Debounce function
   - `throttle(func, delay)` - Throttle function

4. **Data Processing**:
   - `randomItem(array)` - Get random item
   - `calculateDiscount()` - Calculate discount %
   - `pluralize()` - Pluralize text

5. **Time/Date**:
   - `sleep(ms)` - Sleep promise
   - `getTimeAgo(date)` - Time ago text
   - `parseJwt(token)` - Parse JWT token

6. **Clipboard**:
   - `copyToClipboard(text)` - Copy to clipboard

7. **Colors**:
   - `getContrastColor(hex)` - Get contrast color

**Penggunaan**:
```typescript
import { formatRupiah } from '@/utils'

const price = formatRupiah(15000)  // "Rp 15.000"
```

**Modifikasi**: Tambah utility functions sesuai kebutuhan

---

### Build Output

#### `dist/` (generated after `npm run build`)
**Isi**:
- `index.html` - Minified HTML
- `assets/` - Bundled JS & CSS
- Static files - Copied dari public/

**Gunakan**: Upload ke hosting (Vercel, Netlify, etc.)

**Size**: ~100-150KB (gzipped ~30-40KB)

---

## 🔄 File Dependencies

```
index.html
  ↓
main.tsx
  ↓
App.tsx → ./styles/globals.css
  ↓
src/pages/Home.tsx → BannerSlider.tsx
                   → ProductCard.tsx
                   → types.ts
                   → utils.ts
                   → lucide-react icons
```

---

## 📊 File Statistics

| File | Size | Type | Purpose |
|------|------|------|---------|
| Home.tsx | ~8KB | Component | Main page |
| BannerSlider.tsx | ~4KB | Component | Banner |
| ProductCard.tsx | ~7KB | Component | Product card |
| globals.css | ~12KB | Styles | Global styles |
| types.ts | ~5KB | Types | Type definitions |
| utils.ts | ~6KB | Logic | Utilities |
| tailwind.config.ts | ~3KB | Config | Tailwind config |
| README.md | ~15KB | Docs | Documentation |

**Total Size**: ~60KB (before build/minification)

---

## 🚀 Quick Reference

### Run Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build production
npm run preview      # Preview build
npm run lint         # Check code quality
npm run type-check   # TypeScript check
```

### Important Files to Edit
```
.env.local          # Environment variables
tailwind.config.ts  # Colors & animations
Home.tsx            # Main page
BannerSlider.tsx    # Banner content
globals.css         # Add global styles
```

### API Integration Points
```typescript
Home.tsx:15         // Mock products data
Home.tsx:200        // handleAddToCart function
Home.tsx:210        // handleToggleWishlist function
```

---

## 📝 Notes

- Semua file sudah production-ready
- Responsive untuk semua devices
- Animations dioptimalkan untuk performance
- TypeScript untuk type safety
- Tailwind untuk styling
- Modular component structure

---

**Happy Coding! 🎉**