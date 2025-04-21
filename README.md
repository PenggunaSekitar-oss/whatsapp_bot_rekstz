# README.md

# Bot WhatsApp dengan Integrasi Gemini AI

Bot WhatsApp ini menggunakan pustaka whatsapp-web.js dan Gemini AI untuk membuat asisten pribadi yang dapat berinteraksi dengan Anda melalui WhatsApp. Bot ini memiliki kemampuan untuk mempertahankan konteks percakapan, sehingga dapat memberikan respons yang lebih relevan dan personal.

## Fitur Utama

- Integrasi dengan Gemini AI untuk respons cerdas
- Pengelolaan riwayat percakapan untuk mempertahankan konteks
- Perintah dasar untuk mengelola bot
- Indikator pengetikan saat bot sedang memproses pesan
- Dukungan untuk pesan media
- Notifikasi otomatis ke pemilik saat bot aktif

## Persyaratan

- Node.js versi 18 atau lebih tinggi
- Koneksi internet
- API key Gemini AI
- Smartphone dengan WhatsApp terinstal

## Cara Menggunakan

### 1. Konfigurasi

Sebelum menjalankan bot, Anda perlu mengatur konfigurasi di file `src/config.js`:

```javascript
// Ganti dengan API key Gemini AI Anda
geminiApiKey: 'MASUKKAN_API_KEY_GEMINI_ANDA_DISINI',

// Nomor pemilik bot (format: 62812345678)
ownerNumber: '', 
```

### 2. Instalasi

```bash
# Masuk ke direktori proyek
cd whatsapp_bot_project

# Instal dependensi
npm install
```

### 3. Menjalankan Bot

```bash
# Jalankan bot
npm start
```

Setelah menjalankan perintah di atas, bot akan menampilkan QR code di terminal. Scan QR code tersebut dengan WhatsApp di smartphone Anda untuk mengautentikasi bot.

### 4. Perintah yang Tersedia

Bot mendukung beberapa perintah dasar yang dapat digunakan dengan awalan prefix (default: `!`):

- `!help` atau `!bantuan` - Menampilkan daftar perintah yang tersedia
- `!ping` - Memeriksa apakah bot aktif dan berjalan
- `!info` - Menampilkan informasi tentang bot
- `!reset` - Menghapus riwayat percakapan dan memulai percakapan baru

## Dokumentasi

Untuk informasi lebih lanjut, silakan lihat dokumentasi lengkap di folder `docs`:

- [Panduan Pengguna](docs/user_guide.md) - Panduan lengkap penggunaan bot
- [Perbandingan Pustaka](docs/library_comparison.md) - Perbandingan berbagai pustaka untuk bot WhatsApp

## Struktur Proyek

```
whatsapp_bot_project/
├── docs/                  # Dokumentasi
│   ├── library_comparison.md
│   └── user_guide.md
├── src/                   # Kode sumber
│   ├── bot.js             # File utama bot WhatsApp
│   ├── config.js          # Konfigurasi bot
│   ├── conversation.js    # Pengelolaan riwayat percakapan
│   ├── gemini.js          # Integrasi dengan Gemini AI
│   └── media.js           # Penanganan media
├── temp/                  # Direktori untuk file sementara
├── index.js               # Entry point
├── package.json           # Konfigurasi npm
├── start.js               # Script untuk memulai bot
└── README.md              # Dokumentasi proyek
```

## Catatan Penting

- Bot ini menggunakan WhatsApp Web sebagai perantara, sehingga smartphone Anda harus tetap terhubung ke internet agar bot dapat berfungsi
- WhatsApp tidak secara resmi mendukung bot, jadi gunakan dengan bijak dan hindari spam atau penggunaan yang berlebihan
- API key Gemini AI Anda mungkin memiliki batasan penggunaan, periksa kuota Anda secara berkala

## Lisensi

ISC
