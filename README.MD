# Dosa Besar Andi Maraya - Arsip Digital

Aplikasi web sederhana berbasis client-side untuk melakukan pengarsipan data secara digital. Proyek ini menggunakan **Firebase Firestore** sebagai database dan **ImgBB** untuk penyimpanan gambar.

## 🚀 Fitur Utama

- **Input Data:** Form untuk mencatat pelanggaran/data baru.
- **Upload Gambar:** Integrasi dengan API ImgBB untuk hosting gambar bukti.
- **Real-time Update:** Menggunakan snapshot Firestore agar data terupdate otomatis tanpa refresh.
- **Otorisasi Hapus:** Fitur penghapusan data yang memerlukan kata sandi khusus.
- **Desain Modern:** Antarmuka responsif menggunakan CSS modern dengan tema gelap (*dark mode*).

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5, CSS3 (Custom Properties), JavaScript (ES6+)
- **Database:** Firebase Firestore
- **Image Hosting:** API ImgBB
- **Font:** Plus Jakarta Sans via Google Fonts

## 📋 Persiapan & Instalasi

1.  **Clone Repository:**
    ```bash
    git clone [https://github.com/username/nama-repo.git](https://github.com/username/nama-repo.git)
    cd nama-repo
    ```

2.  **Konfigurasi Firebase:**
    Buka file `script.js` dan isi konfigurasi Firebase Anda pada bagian berikut:
    ```javascript
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_ID",
        appId: "YOUR_APP_ID"
    };
    ```

3.  **Konfigurasi ImgBB:**
    Masukkan API Key ImgBB Anda di `script.js`:
    ```javascript
    const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY";
    ```

4.  **Jalankan Project:**
    Buka file `index.html` langsung di browser atau gunakan extension *Live Server* di VS Code.

## 🔒 Catatan Keamanan

- Pastikan untuk mengatur **Firebase Security Rules** Anda ke `true` untuk pengujian, atau atur rules yang lebih ketat jika digunakan untuk publik.
- Kata sandi penghapusan data saat ini diatur secara hardcoded di dalam `script.js` untuk keperluan demonstrasi.

## 📝 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan dokumentasi pribadi.