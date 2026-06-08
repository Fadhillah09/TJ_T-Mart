# ⚡ Quick Start Guide

Panduan cepat untuk mulai menggunakan TJ-T Mart Marketplace UI dalam 5 menit!

## 🎯 5-Minute Setup

### Step 1: Copy Files (1 menit)
Copy semua files dari `/mnt/user-data/outputs/` ke directory project Anda.

```bash
# Atau clone jika menggunakan Git
git clone <repository-url>
cd tj-t-mart-ui
```

### Step 2: Install Dependencies (2 menit)
```bash
npm install
```

### Step 3: Setup Environment (1 menit)
```bash
cp .env.example .env.local
```

### Step 4: Run Development Server (1 menit)
```bash
npm run dev
```

Output:
```
➜  Local:   http://localhost:5173/
```

**Buka browser → http://localhost:5173/** ✅

---

## 📁 Folder Structure Setup

```
your-project/
├── src/
│   ├── components/
│   │   ├── BannerSlider.tsx
│   │   └── ProductCard.tsx
│   ├── pages/
│   │   └── Home.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── utils.ts
├── index.html
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── .env.local
```

---

## 🎨 Key Features to Test

### 1. Wishlist Pulsing ❤️
- Hover cursor ke tombol love pada product card
- Akan berubah merah dan berdenyut
- Click untuk toggle wishlist

### 2. Banner Slider 🎬
- Auto-rotate setiap 5 detik
- Click arrows untuk navigate
- Hover untuk pause
- Click dots untuk jump ke slide

### 3. Product Grid 📦
- 2 columns (mobile) → 4 columns (desktop)
- Hover cards untuk see lift effect
- Add to cart dengan animation
- Stock progress bar

### 4. Category Filter 🏷️
- Click untuk filter produk
- Gradient background pada active
- Smooth animation

### 5. Responsive Design 📱
- Buka DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Resize browser untuk test responsiveness

---

## 🔧 Customization (Common Tasks)

### Change Primary Color
**File**: `tailwind.config.ts`

```typescript
colors: {
  tj: {
    primary: '#your-color',        // Change di sini
    'primary-dark': '#your-dark',
  }
}
```

### Change Banner Images
**File**: `src/components/BannerSlider.tsx`

```typescript
const banners: Banner[] = [
  {
    id: 1,
    title: 'Your Title',
    subtitle: 'Your Subtitle',
    image: 'https://your-image-url.jpg',  // Change image
    gradient: 'from-color-/80 via-color-/60 to-transparent'
  }
]
```

### Add Products
**File**: `src/pages/Home.tsx`

```typescript
const produk: Product[] = [
  {
    id: 1,
    nama_produk: 'Product Name',
    harga: 15000,
    stok: 40,
    gambar_url: 'https://image-url.jpg',
    kategori: 'makanan',
    lokasi: ['TJ Mart Putra'],
    rating: 4.8,
  },
  // Add more products here
]
```

### Customize Animations
**File**: `src/styles/globals.css`

```css
/* Edit atau add new animations di sini */
@keyframes your-animation {
  from { /* ... */ }
  to { /* ... */ }
}

.animate-your-animation {
  animation: your-animation 1s ease-in-out;
}
```

---

## 🚀 Deploy ke Production

### Build Project
```bash
npm run build
```

Output akan di folder `dist/`

### Deploy Opsi:

**Vercel** (Recommended)
```bash
npm install -g vercel
vercel login
vercel deploy
```

**Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

**GitHub Pages**
```bash
npm run build
# Push dist folder ke gh-pages branch
```

**Docker**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📚 File Descriptions (Quick Reference)

| File | Untuk | Edit Jika |
|------|-------|-----------|
| `Home.tsx` | Halaman utama | Mau ubah layout atau products |
| `BannerSlider.tsx` | Banner carousel | Mau ubah banner content/images |
| `ProductCard.tsx` | Kartu produk | Mau ubah tampilan product |
| `globals.css` | Styles & animations | Mau add custom styles |
| `tailwind.config.ts` | Tailwind config | Mau ubah colors/spacing |
| `types.ts` | Type definitions | Mau tambah data types |
| `utils.ts` | Helper functions | Mau tambah utilities |

---

## 🆘 Common Issues

### Port 5173 Sudah Digunakan
```bash
npm run dev -- --port 5174
```

### CSS/Tailwind Tidak Jalan
1. Restart dev server (Ctrl+C, lalu `npm run dev`)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check `globals.css` di-import di `App.tsx`

### Build Error
```bash
npm run type-check  # Check untuk errors
npm run build       # Try building
```

### Image Tidak Load
1. Ganti URL image dengan yang valid
2. Check browser console (F12 → Console)
3. Verify image URL accessible

### Animasi Lemot
1. Disable animations temporary di `.env.local`:
   ```
   VITE_ENABLE_ANIMATIONS=false
   ```
2. Check jika ada console errors
3. Update graphics driver

---

## 📖 Next Steps

### Basic
- [ ] Setup project & run locally
- [ ] Test semua features
- [ ] Customize colors & content
- [ ] Connect ke backend API

### Intermediate
- [ ] Add more pages (Products, Orders, etc)
- [ ] Implement authentication
- [ ] Add real database connection
- [ ] Setup error handling

### Advanced
- [ ] Add state management (Redux/Zustand)
- [ ] Implement PWA features
- [ ] Add unit tests
- [ ] Optimize performance further

---

## 🔗 Useful Resources

- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev/guide
- **Lucide Icons**: https://lucide.dev

---

## 💬 Documentation

- **Full Setup**: Baca `INSTALLATION.md`
- **Development**: Baca `DEVELOPMENT.md`
- **File Info**: Baca `FILE_STRUCTURE.md`
- **Component Docs**: Baca `README.md`

---

## ✅ Verification Checklist

- [ ] Semua files tercopy dengan benar
- [ ] `npm install` selesai tanpa error
- [ ] Dev server running di port 5173
- [ ] Website loads di browser
- [ ] Wishlist button berubah merah saat hover
- [ ] Banner slider auto-rotate
- [ ] Products grid responsive
- [ ] Tidak ada console errors

---

## 🎉 You're All Set!

Selamat! Project sudah siap untuk development. 

Mulai dengan:
```bash
npm run dev
```

Kemudian buka http://localhost:5173/

---

**Happy Coding! 🚀**

Jika ada pertanyaan, baca dokumentasi lebih detail atau check console untuk error messages.