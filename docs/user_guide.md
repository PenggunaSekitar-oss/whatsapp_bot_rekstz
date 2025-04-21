# Panduan Penggunaan Bot WhatsApp dengan Gemini AI

## Deskripsi
Bot WhatsApp ini menggunakan pustaka whatsapp-web.js dan Gemini AI untuk membuat asisten pribadi yang dapat berinteraksi dengan Anda melalui WhatsApp. Bot ini memiliki kemampuan untuk mempertahankan konteks percakapan, sehingga dapat memberikan respons yang lebih relevan dan personal.

## Fitur Utama
- Integrasi dengan Gemini AI untuk respons cerdas
- Pengelolaan riwayat percakapan untuk mempertahankan konteks
- Perintah dasar untuk mengelola bot
- Indikator pengetikan saat bot sedang memproses pesan
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
module.exports = {
    // Konfigurasi sesi WhatsApp
    sessionName: 'whatsapp-gemini-bot',
    
    // Konfigurasi Gemini AI
    // Ganti dengan API key Gemini AI Anda
    geminiApiKey: 'MASUKKAN_API_KEY_GEMINI_ANDA_DISINI',
    
    // Konfigurasi bot
    botName: 'Asisten Pribadi',
    ownerNumber: '628123456789', // Nomor pemilik bot (format: 62812345678)
    
    // Pesan selamat datang
    welcomeMessage: 'Halo! Saya adalah asisten pribadi Anda yang didukung oleh Gemini AI. Apa yang dapat saya bantu hari ini?',
    
    // Prefix untuk perintah bot (opsional)
    prefix: '!',
    
    // Pengaturan lainnya
    enableLogging: true,
    maxMessageLength: 4000 // Batasan panjang pesan WhatsApp
};
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
node index.js
```

Setelah menjalankan perintah di atas, bot akan menampilkan QR code di terminal. Scan QR code tersebut dengan WhatsApp di smartphone Anda untuk mengautentikasi bot.

### 4. Perintah yang Tersedia
Bot mendukung beberapa perintah dasar yang dapat digunakan dengan awalan prefix (default: `!`):

- `!help` atau `!bantuan` - Menampilkan daftar perintah yang tersedia
- `!ping` - Memeriksa apakah bot aktif dan berjalan
- `!info` - Menampilkan informasi tentang bot
- `!reset` - Menghapus riwayat percakapan dan memulai percakapan baru

### 5. Berinteraksi dengan Bot
Untuk berinteraksi dengan bot, cukup kirim pesan seperti biasa tanpa awalan prefix. Bot akan memproses pesan Anda menggunakan Gemini AI dan memberikan respons yang relevan.

Bot akan mempertahankan konteks percakapan, sehingga Anda dapat melanjutkan percakapan tanpa perlu menjelaskan konteks sebelumnya setiap kali.

## Troubleshooting

### Bot tidak merespons
- Pastikan bot masih berjalan di terminal
- Periksa koneksi internet Anda
- Pastikan WhatsApp di smartphone Anda terhubung ke internet
- Coba restart bot dengan menjalankan ulang `node index.js`

### Error API key Gemini
- Pastikan Anda telah memasukkan API key Gemini AI yang valid di file `src/config.js`
- Periksa apakah API key Anda masih aktif dan memiliki kuota yang cukup

### QR code tidak muncul atau tidak dapat di-scan
- Pastikan terminal Anda mendukung tampilan QR code
- Coba jalankan bot di terminal yang berbeda
- Hapus folder `.wwebjs_auth` di direktori proyek dan jalankan ulang bot

## Catatan Penting
- Bot ini menggunakan WhatsApp Web sebagai perantara, sehingga smartphone Anda harus tetap terhubung ke internet agar bot dapat berfungsi
- WhatsApp tidak secara resmi mendukung bot, jadi gunakan dengan bijak dan hindari spam atau penggunaan yang berlebihan
- API key Gemini AI Anda mungkin memiliki batasan penggunaan, periksa kuota Anda secara berkala

## Pengembangan Lebih Lanjut
Bot ini dapat dikembangkan lebih lanjut dengan menambahkan fitur-fitur seperti:
- Dukungan untuk pesan media (gambar, audio, video)
- Integrasi dengan layanan eksternal lainnya
- Fitur penjadwalan pesan
- Analisis sentimen pesan
- Dan banyak lagi sesuai kebutuhan Anda

Selamat menggunakan bot WhatsApp dengan Gemini AI!
