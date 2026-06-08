# TJ-T Mart - Marketplace UI Component Library

UI yang cantik, interaktif, dan responsif untuk marketplace TJ-T Mart dengan animasi smooth dan performa optimal.

## 📋 File Structure

```
├── Home.tsx              # Halaman utama marketplace
├── BannerSlider.tsx      # Component slider banner dengan gradient animation
├── ProductCard.tsx       # Product card component dengan pulsing wishlist
├── globals.css           # Global styles & custom animations
├── tailwind.config.ts    # Tailwind CSS configuration
├── utils.ts              # Utility functions & helpers
├── types.ts              # TypeScript type definitions
└── README.md            # Dokumentasi ini
```

## 🎨 Features

### ✨ Animations & Effects
- **Pulsing Wishlist**: Wishlist button berdenyut ketika cursor didekatkan
- **Gradient Animation**: Banner dengan gradient yang smooth dan bergerak
- **Smooth Transitions**: Semua perubahan UI dengan transisi yang halus
- **Loading Shimmer**: Loading effect pada image dengan shimmer animation
- **Float & Bounce**: Gentle animation pada FAB dan elemen interaktif
- **Scale Pop**: Pop animation ketika item ditambahkan

### 🎯 Interactive Elements
- Interactive wishlist dengan visual feedback
- Shopping cart counter dengan animation
- Category filter dengan smooth transitions
- Banner slider dengan auto-rotate dan manual control
- Hover effects yang responsif
- Staggered fade-in animations untuk product grid

### 📱 Responsive Design
- Mobile-first approach
- Optimized untuk desktop, tablet, dan mobile
- Smooth scrolling dengan custom scrollbar
- Touch-friendly button sizes
- Adaptive typography

### ⚡ Performance
- GPU-accelerated animations
- Lazy loading untuk images
- Efficient CSS animations (GPU-optimized)
- No unnecessary re-renders
- Minimal JavaScript overhead
- Accessibility support dengan reduced-motion

## 🚀 Getting Started

### Prerequisites
```bash
npm install react react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer typescript
```

### Installation

1. **Copy file-file ke project Anda**:
   ```bash
   cp Home.tsx src/pages/
   cp BannerSlider.tsx src/components/
   cp ProductCard.tsx src/components/
   cp globals.css src/styles/
   cp tailwind.config.ts ./
   cp utils.ts src/
   cp types.ts src/
   ```

2. **Update `tailwind.config.ts`** dengan config yang sudah disediakan

3. **Import globals.css di main.tsx atau App.tsx**:
   ```tsx
   import './styles/globals.css'
   ```

4. **Import Home component**:
   ```tsx
   import Home from './pages/Home'
   
   function App() {
     return <Home />
   }
   ```

## 🎨 Color Palette

### Primary Colors (TJ-T Mart)
- **Primary Red**: `#d50d27`
- **Dark Red**: `#ba0015`
- **Secondary Dark**: `#9c0012`
- **Accent Red**: `#ff1744`

### Neutral Colors
- **Light Gray**: `#f3f4f6`
- **Gray**: `#e5e7eb`
- **Dark Gray**: `#6b7280`
- **Black**: `#1f2937`

## 📦 Component Documentation

### Home.tsx

Main marketplace page dengan layout lengkap.

**Features**:
- Welcome section
- Banner slider
- Category filter
- Product grid dengan staggered animation
- Sticky header
- Floating action button
- Mobile navigation

**Props**: None (Self-contained component)

**Usage**:
```tsx
import Home from './pages/Home'

export default function App() {
  return <Home />
}
```

### BannerSlider.tsx

Slider banner yang interaktif dengan gradient animation.

**Features**:
- Auto-rotate setiap 5 detik
- Manual navigation dengan arrows
- Dot indicators
- Gradient overlay
- Responsive sizing
- Pause on hover

**Props**:
```tsx
interface BannerSliderProps {
  // Component tidak memerlukan props (data hardcoded)
  // Modify FALLBACK_BANNERS array untuk custom banners
}
```

**Custom Banners**:
```tsx
const banners = [
  {
    id: 1,
    title: 'Judul Banner',
    subtitle: 'Subtitle banner',
    image: 'https://...',
    gradient: 'from-orange-500/80 via-orange-600/60 to-transparent'
  }
]
```

### ProductCard.tsx

Product card component dengan wishlist pulsing effect.

**Features**:
- Image lazy loading dengan shimmer effect
- Stock progress bar
- Wishlist button dengan pulsing animation
- Add to cart functionality
- Rating display
- Stock status badge
- Location information
- Disabled state untuk habis

**Props**:
```tsx
interface ProductCardProps {
  produk: Product
  wishlistedIds: Set<number>
  onAddToCart: (produk: Product) => void
  onToggleWishlist: (produk: Product) => void
  isAdding: boolean
}
```

**Usage**:
```tsx
<ProductCard
  produk={product}
  wishlistedIds={wishlistedIds}
  onAddToCart={handleAddToCart}
  onToggleWishlist={handleToggleWishlist}
  isAdding={false}
/>
```

## 🎬 Animations Reference

### Available Animations

```css
/* Pulsing Effect */
.animate-pulse-subtle  /* Subtle pulse 2s */

/* Fade Animations */
.animate-fade-in       /* Fade in from bottom */
.animate-slide-up      /* Slide up animation */

/* Movement */
.animate-bounce-gentle /* Gentle bounce 3s */
.animate-float         /* Floating animation */

/* Scale */
.animate-scale-pop     /* Pop scale animation */

/* Loading */
.animate-shimmer       /* Shimmer loading effect */

/* Spin */
.animate-rotate-spin   /* Rotate spin animation */

/* Glow */
.animate-glow-pulse    /* Glow pulse effect */
```

### Animation Duration
- Fast: 0.3s - 0.4s (pop, scale)
- Normal: 0.6s - 0.7s (fade, slide)
- Slow: 2s - 3s (pulse, float, bounce)
- Very Slow: 4s - 5s (color shift)

## 🎯 Customization

### Change Primary Color

Edit `tailwind.config.ts`:
```typescript
colors: {
  tj: {
    primary: '#YourColor',
    'primary-dark': '#YourDarkColor',
  }
}
```

Atau langsung di component:
```tsx
className="bg-[#yourcolor] text-[#yourcolor]"
```

### Custom Animations

Edit `globals.css`:
```css
@keyframes your-animation {
  from { /* ... */ }
  to { /* ... */ }
}
```

Kemudian tambahkan ke `tailwind.config.ts`:
```typescript
animation: {
  'your-animation': 'your-animation 1s ease-in-out'
}
```

### Adjust Animation Speed

Ubah durasi di component atau CSS:
```tsx
className="animate-pulse-subtle" /* 2s default */

/* Override dengan inline style */
style={{ animationDuration: '1s' }}
```

### Mobile Breakpoints

Tailwind breakpoints yang tersedia:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Contoh:
```tsx
className="text-sm sm:text-base md:text-lg"
```

## 🚀 Performance Tips

### 1. Image Optimization
- Gunakan lazy loading (already implemented)
- Compress images sebelum upload
- Gunakan WebP format jika possible
- Fallback dengan placeholder image

### 2. Animation Optimization
- Hindari animating box-shadow (use filter instead)
- Gunakan `transform` dan `opacity` untuk smooth animations
- GPU acceleration dengan `transform: translateZ(0)`
- Disable animations untuk reduced-motion users (already implemented)

### 3. Bundle Size
- Lucide icons ~1KB per icon (tree-shaking)
- Tailwind CSS akan di-purge di production
- Global CSS ~30KB (dapat dikompres hingga ~8KB)

### 4. SEO
- Semantic HTML (sudah digunakan)
- Proper heading hierarchy
- Alt text pada images
- Meta tags di layout

## 🔧 API Integration

### Struktur Response Backend

```typescript
// GET /api/products
{
  status: 'success',
  data: [
    {
      id: 1,
      nama_produk: 'Product Name',
      harga: 15000,
      stok: 40,
      gambar_url: 'https://...',
      kategori: 'makanan',
      lokasi: ['TJ Mart Putra'],
      rating: 4.8
    }
  ]
}

// POST /api/cart/add
{
  status: 'success',
  message: 'Added to cart',
  data: { cart_id: 1, item_id: 1 }
}
```

### Implementasi dengan Backend

Replace mock data di Home.tsx:
```tsx
const [produk, setProduk] = useState<Product[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const json = await res.json()
      setProduk(json.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  fetchProducts()
}, [])
```

## 📱 Browser Support

- Chrome/Edge: ✅ Latest
- Firefox: ✅ Latest
- Safari: ✅ 12+
- Mobile Safari: ✅ Latest
- Android Browser: ✅ Latest

## ♿ Accessibility

- ARIA labels pada buttons
- Focus visible states
- Color contrast ratios > 4.5:1
- Keyboard navigation support
- Respects `prefers-reduced-motion`
- Semantic HTML

## 🐛 Known Issues

Tidak ada issues yang diketahui. Jika menemukan bug, silakan report.

## 📝 License

MIT License - Bebas digunakan untuk project komersial maupun non-komersial.

## 🤝 Contributing

Untuk kontribusi atau modifikasi:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📞 Support

Untuk pertanyaan atau bantuan, hubungi:
- Email: support@tjmart.com
- WhatsApp: [Link]
- Chat: [Platform]

---

**Happy Coding! 🎉**

Made with ❤️ for TJ-T Mart