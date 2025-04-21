// File untuk memulai bot WhatsApp dengan integrasi Gemini AI
const fs = require('fs');
const path = require('path');
const config = require('./src/config');

// Fungsi untuk memulai bot
function startBot() {
    try {
        // Impor bot
        const bot = require('./src/bot');
        console.log('🤖 Memulai Bot WhatsApp dengan Gemini AI...');
        console.log(`Nama Bot: ${config.botName}`);
        console.log(`Sesi: ${config.sessionName}`);
        console.log(`Prefix Perintah: ${config.prefix}`);
        console.log('📱 Menunggu QR Code atau masukkan nomor telepon untuk pairing code...');
        console.log('Silakan scan QR Code dengan WhatsApp di smartphone Anda atau gunakan metode pairing code.');
    } catch (error) {
        console.error('Error saat memulai bot:', error);
    }
}

// Periksa apakah API key Gemini telah dikonfigurasi
if (config.geminiApiKey === 'MASUKKAN_API_KEY_GEMINI_ANDA_DISINI') {
    console.log('⚠️ PERINGATAN: API key Gemini AI belum dikonfigurasi!');
    console.log('Silakan edit file src/config.js dan masukkan API key Gemini AI Anda.');
    console.log('Melanjutkan tanpa API key. Bot akan menampilkan pesan error saat menerima pesan.');
    startBot();
} else {
    // API key telah dikonfigurasi, mulai bot
    startBot();
}

// Tangani uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Jangan exit process agar bot tetap berjalan
});

// Tangani unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Jangan exit process agar bot tetap berjalan
});
