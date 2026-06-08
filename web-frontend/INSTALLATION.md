# 🚀 Installation & Setup Guide

Panduan lengkap untuk setup TJ-T Mart Marketplace UI component library.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah install:

- **Node.js**: v16.0.0 atau lebih tinggi
  - [Download Node.js](https://nodejs.org/)
  - Cek versi: `node --version`

- **npm**: v8.0.0 atau lebih tinggi
  - Sudah termasuk dalam Node.js
  - Cek versi: `npm --version`

- **Git** (optional, untuk version control)
  - [Download Git](https://git-scm.com/)

## 📦 Step 1: Setup Project

### Option A: Clone Repository (Jika menggunakan Git)

```bash
git clone https://github.com/yourusername/tj-t-mart-ui.git
cd tj-t-mart-ui
```

### Option B: Manual Setup

1. **Buat folder project**:
   ```bash
   mkdir tj-t-mart-ui
   cd tj-t-mart-ui
   ```

2. **Copy file-file**:
   - Copy semua file dari `outputs` folder ke directory baru
   - Pastikan struktur folder seperti ini:

   ```
   tj-t-mart-ui/
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
   ├── public/
   ├── index.html
   ├── package.json
   ├── tailwind.config.ts
   ├── postcss.config.js
   ├── tsconfig.json
   ├── vite.config.ts
   ├── .env.example
   ├── .eslintrc.json
   ├── .gitignore
   └── README.md
   ```

## 🔧 Step 2: Install Dependencies

```bash
npm install
```

Tunggu hingga selesai (~2-5 menit tergantung koneksi internet).

### Troubleshooting Installation:

Jika mendapat error, coba:

```bash
# Clear npm cache
npm cache clean --force

# Install ulang
npm install
```

## 🎨 Step 3: Konfigurasi Tailwind CSS

File `tailwind.config.ts` dan `postcss.config.js` sudah disediakan.

Jika ingin custom, edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      tj: {
        primary: '#d50d27',  // Ganti warna primary
        'primary-dark': '#ba0015',
      }
    }
  }
}
```

## 🌐 Step 4: Setup Environment Variables

1. **Copy `.env.example` menjadi `.env.local`**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** dan sesuaikan dengan konfigurasi Anda:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=TJ-T Mart
   VITE_ENABLE_ANIMATIONS=true
   ```

## ▶️ Step 5: Jalankan Development Server

```bash
npm run dev
```

Output:
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Buka browser dan akses `http://localhost:5173/`

## 🔍 Step 6: Verify Installation

Pastikan:

- ✅ Page loads without errors
- ✅ Animations smooth (tidak lemot)
- ✅ Responsive di mobile (resize browser)
- ✅ Wishlist button berdenyut saat di-hover
- ✅ Banner slider bekerja dengan auto-rotate

## 📱 Step 7: Test di Mobile (Optional)

### Test dengan DevTools:
1. Buka Developer Tools (F12)
2. Klik device toggle (Ctrl+Shift+M)
3. Pilih device (iPhone 12, iPad, dll)

### Test dengan Actual Device:
1. Cari IP lokal:
   ```bash
   ipconfig getifaddr en0  # Mac/Linux
   ipconfig  # Windows (cari IPv4 Address)
   ```

2. Akses dari device:
   ```
   http://YOUR_IP:5173/
   ```

## 🏗️ Step 8: Build untuk Production

Ketika siap deploy:

```bash
npm run build
```

Output:
```
dist/
├── index.html
├── assets/
│   ├── index-ABC123.js
│   └── index-ABC123.css
```

Preview build:
```bash
npm run preview
```

## 📁 Project Structure Lengkap

```
tj-t-mart-ui/
├── src/
│   ├── components/
│   │   ├── BannerSlider.tsx      # Banner slider component
│   │   └── ProductCard.tsx       # Product card component
│   ├── pages/
│   │   └── Home.tsx              # Main home page
│   ├── styles/
│   │   └── globals.css           # Global styles & animations
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── node_modules/                 # Dependencies
├── dist/                         # Build output (after build)
├── index.html                    # HTML template
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Tailwind config
├── postcss.config.js             # PostCSS config
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
├── .env.example                  # Environment template
├── .env.local                    # Environment variables (local)
├── .eslintrc.json                # ESLint config
├── .gitignore                    # Git ignore rules
└── README.md                     # Documentation
```

## ✅ Checklist Setup Selesai

- [ ] Node.js v16+ terinstall
- [ ] npm v8+ terinstall
- [ ] Dependencies terinstall (`npm install`)
- [ ] `.env.local` sudah dikonfigurasi
- [ ] Dev server running (`npm run dev`)
- [ ] Home page accessible di `http://localhost:5173/`
- [ ] Animasi smooth dan responsif
- [ ] Browser DevTools tidak ada errors

## 🚀 Next Steps

### Local Development:
```bash
npm run dev           # Start dev server
npm run lint          # Check code quality
npm run type-check    # Type checking
```

### Production:
```bash
npm run build         # Build for production
npm run preview       # Preview production build
```

### Integrasi Backend:
1. Update API endpoints di `utils.ts`
2. Replace mock data di `Home.tsx` dengan API calls
3. Add error handling & loading states

## 🔗 Integrasi dengan Backend

### Contoh API Call:

```typescript
// Di Home.tsx
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products`
      )
      const { data } = await response.json()
      setProduk(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }
  
  fetchProducts()
}, [])
```

### Backend Requirements:

API harus return format:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama_produk": "Product Name",
      "harga": 15000,
      "stok": 40,
      "gambar_url": "https://...",
      "kategori": "makanan",
      "lokasi": ["TJ Mart Putra"],
      "rating": 4.8
    }
  ]
}
```

## 🆘 Troubleshooting

### Port 5173 sudah digunakan:
```bash
# Gunakan port berbeda
npm run dev -- --port 5174
```

### Node modules error:
```bash
# Delete & reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS tidak working:
1. Pastikan `globals.css` di-import di `App.tsx`
2. Restart dev server
3. Clear browser cache (Ctrl+Shift+Delete)

### Build error:
```bash
npm run type-check  # Check untuk TypeScript errors
npm run build       # Check untuk build errors
```

## 📚 Dokumentasi Lengkap

- **README.md**: Overview & dokumentasi component
- **Component docs**: Lihat comments di setiap component file
- **Tailwind docs**: https://tailwindcss.com/docs
- **React docs**: https://react.dev

## 💬 Support

Jika mengalami masalah:

1. Baca **README.md** terlebih dahulu
2. Check **console errors** (F12 → Console)
3. Coba clear cache & restart dev server
4. Jika masih bermasalah, silakan buat issue

## 🎉 Selesai!

Project sudah siap untuk development. Happy coding! 🚀