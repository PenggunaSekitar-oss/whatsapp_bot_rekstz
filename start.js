// File untuk memulai bot WhatsApp dengan integrasi Gemini AI
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Periksa konfigurasi API key Gemini
const config = require('./src/config');

// Fungsi untuk memulai bot
function startBot() {
    // Impor bot
    const bot = require('./src/bot');
    console.log('🤖 Memulai Bot WhatsApp dengan Gemini AI...');
    console.log(`Nama Bot: ${config.botName}`);
    console.log(`Sesi: ${config.sessionName}`);
    console.log(`Prefix Perintah: ${config.prefix}`);
    console.log('📱 Menunggu QR Code atau masukkan nomor telepon untuk pairing code...');
    console.log('Silakan scan QR Code dengan WhatsApp di smartphone Anda atau gunakan metode pairing code.');
}

// Periksa apakah API key Gemini telah dikonfigurasi
if (config.geminiApiKey === 'MASUKKAN_API_KEY_GEMINI_ANDA_DISINI') {
    console.log('⚠️ PERINGATAN: API key Gemini AI belum dikonfigurasi!');
    console.log('Silakan edit file src/config.js dan masukkan API key Gemini AI Anda.');
    
    // Tanya pengguna apakah ingin melanjutkan tanpa API key
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('Lanjutkan tanpa API key? (y/n): ', (answer) => {
        rl.close();
        if (answer.toLowerCase() === 'y') {
            console.log('Melanjutkan tanpa API key. Bot akan menampilkan pesan error saat menerima pesan.');
            startBot();
        } else {
            console.log('Silakan edit file src/config.js dan jalankan kembali program ini.');
            process.exit(0);
        }
    });
} else {
    // API key telah dikonfigurasi, mulai bot
    startBot();
}
