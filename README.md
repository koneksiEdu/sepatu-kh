# 🗂️ Sistem Inventarisasi PKKPR

Proyek ini adalah aplikasi web untuk mengelola **inventarisasi data Persetujuan Kesesuaian Kegiatan Pemanfaatan Ruang (PKKPR)**.  
Dibangun menggunakan **Astro + Vue** dengan backend database **Turso (SQLite + Drizzle ORM)**.  

## ✨ Fitur di Inisiasi Awal ini
- 🔐 **Autentikasi**
  - Registrasi akun (Daftar)
  - Login
  - Reset password
  - Verifikasi email
- 🏠 **Home Page** setelah login (masih konsep belum selesai)
- 🎯 Role dasar pengguna: admin, staff, publik (disiapkan untuk kontrol akses)

## 📂 Struktur Utama
- `src/` → kode utama proyek (Astro + Vue components)
- `public/` → aset statis (ikon, gambar, dll.)
- `.env` → konfigurasi environment (jangan lupa isi sendiri)

## 🛠️ Teknologi
- **Frontend**: Astro, Vue 3 (Composition API, `<script setup>`), Bootsrap 5, Bootstrap Icon
- **Database**: Turso (SQLite), Drizzle ORM
- **Auth**: JWT (access + refresh token, disimpan di localStorage)
- **SMTP**: Zoho Mail

## 🚀 Cara Menjalankan
1. Clone repository ini:
   git clone https://github.com/koneksiEdu/sepatu-kh.git
   cd sepatu-kh

2. Install dependencies:
   npm install

3. Jalankan project lokal:
   npm run dev

4. Akses di browser:
   http://localhost:4321

## 🔑 Konfigurasi Environment
Buat file `.env` di root project:

PUBLIC_URL="http://localhost:4321/" #contoh untuk URL local
DB_URL="file:./db.sqlite" #contoh lokal, bisa ganti ke Turso
DB_TOKEN="gantidenGanTokEn" #ganti dengan token Turso
SMTP_HOST="smtp.zoho.com" #masukan smtp host yang support TTL atau sesuaikan di code-nya
SMTP_USER="info@mail.id" #ganti dengan user smtp
SMTP_PASS="admin1234" #ganti dengan pass smtp
PUBLIC_AUTH_PHRASE="ini_auth_phrase" #ganti dengan auth phrase yang susah ditebak
PUBLIC_REFRESH_PHRASE="ini_refresh_phrase" #ganti dengan refresh phrase yang susah ditebak
ENVIRONMENT='development' #sesuaikan dengan kebutuhan
VERSION='0.0.1' #sesuaikan dengan kebutuhan

## 📌 Roadmap Fitur Selanjutnya
- ~~Manajemen user dan staff tim verifikasi~~
- Modul PKKPR:
  - Input data permohonan
  - Input & update hasil verifikasi lapangan
  - Integrasi koordinat ke GeoJSON & peta
- list & ekspor data

## 📜 Lisensi
Proyek ini menggunakan lisensi **MIT**.  
Silakan gunakan, modifikasi, dan kontribusi sesuai kebutuhan.