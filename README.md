# Forum Diskusi App

Aplikasi Forum Diskusi React — Submission Kelas Menjadi React Web Developer Expert (Dicoding).

## 🚀 Live Demo

**URL Vercel:** https://open-space-app.vercel.app

---

## ✅ Kriteria Submission

### Kriteria 1: Automation Testing

| File | Jenis | Jumlah Skenario |
|---|---|---|
| `src/store/slices/__tests__/threadsSlice.test.js` | Reducer | 12 |
| `src/store/slices/__tests__/authSlice.test.js` | Reducer | 9 |
| `src/store/slices/__tests__/threadDetailSlice.test.js` | Reducer | 9 |
| `src/store/slices/__tests__/threadsThunk.test.js` | Thunk | 15 |
| `src/store/slices/__tests__/threadDetailThunk.test.js` | Thunk | 12 |
| `src/components/__tests__/threadComponents.test.jsx` | Component | 14 |
| `src/components/__tests__/uiComponents.test.jsx` | Component | 15 |
| `cypress/e2e/login.cy.js` | E2E | 7 |

**Menjalankan unit/integration test:**
```bash
npm test
```

**Menjalankan E2E test:**
```bash
npm run e2e
```

### Kriteria 2: Deployment CI/CD

- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — berjalan pada setiap push/PR ke `master`
- **CD:** Vercel — auto-deploy setiap push ke `master`
- **Branch Protection:** Branch `master` diproteksi (screenshot ada di folder `screenshot/`)

### Kriteria 3: React Ecosystem

**`react-hot-toast`** — digunakan untuk menampilkan notifikasi (toast) pada:
- Login berhasil/gagal
- Register berhasil/gagal
- Buat thread berhasil/gagal
- Kirim komentar berhasil/gagal
- Logout

---

## 🛠️ Cara Menjalankan

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Unit & Integration tests
npm test

# E2E tests (perlu app running di localhost:5173)
npm run e2e:open
```
