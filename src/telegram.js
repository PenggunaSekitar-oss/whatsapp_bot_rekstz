// Modul untuk mengirim notifikasi ke Telegram
const TelegramBot = require('node-telegram-bot-api');

// Token bot Telegram
const token = '8147234997:AAHocYSa3q39FGhk4a4grzZn-VcaCTUxbjg';

// Chat ID default (akan diupdate saat ada pesan masuk pertama kali)
let chatId = null;

// Buat instance bot Telegram
const bot = new TelegramBot(token, { polling: true });

// Tangani pesan masuk untuk mendapatkan chat ID
bot.on('message', (msg) => {
    // Simpan chat ID dari pengguna yang mengirim pesan
    chatId = msg.chat.id;
    console.log(`Pesan diterima dari Telegram. Chat ID: ${chatId}`);
    
    // Kirim pesan konfirmasi
    bot.sendMessage(chatId, 'Bot WhatsApp telah terhubung dengan Telegram. Anda akan menerima kode pairing atau QR code di sini.');
});

/**
 * Kirim pesan teks ke Telegram
 * @param {string} message - Pesan yang akan dikirim
 * @returns {Promise} - Promise hasil pengiriman pesan
 */
const sendMessage = async (message) => {
    try {
        if (!chatId) {
            console.log('Chat ID belum tersedia. Kirim pesan ke bot Telegram terlebih dahulu.');
            return;
        }
        
        return await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Error saat mengirim pesan ke Telegram:', error);
    }
};

/**
 * Kirim gambar ke Telegram
 * @param {Buffer|string} image - Buffer gambar atau path file gambar
 * @param {string} caption - Caption untuk gambar
 * @returns {Promise} - Promise hasil pengiriman gambar
 */
const sendImage = async (image, caption = '') => {
    try {
        if (!chatId) {
            console.log('Chat ID belum tersedia. Kirim pesan ke bot Telegram terlebih dahulu.');
            return;
        }
        
        return await bot.sendPhoto(chatId, image, { caption });
    } catch (error) {
        console.error('Error saat mengirim gambar ke Telegram:', error);
    }
};

/**
 * Kirim QR code ke Telegram
 * @param {string} qrCode - String QR code
 * @returns {Promise} - Promise hasil pengiriman QR code
 */
const sendQRCode = async (qrCode) => {
    try {
        if (!chatId) {
            console.log('Chat ID belum tersedia. Kirim pesan ke bot Telegram terlebih dahulu.');
            return;
        }
        
        // Kirim QR code sebagai teks
        await sendMessage('*QR Code WhatsApp*\n\nScan QR code berikut dengan WhatsApp Anda:');
        
        // Kirim QR code sebagai teks terformat
        return await bot.sendMessage(chatId, '```\n' + qrCode + '\n```', { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Error saat mengirim QR code ke Telegram:', error);
    }
};

/**
 * Kirim pairing code ke Telegram
 * @param {string} pairingCode - Kode pairing
 * @returns {Promise} - Promise hasil pengiriman pairing code
 */
const sendPairingCode = async (pairingCode) => {
    try {
        if (!chatId) {
            console.log('Chat ID belum tersedia. Kirim pesan ke bot Telegram terlebih dahulu.');
            return;
        }
        
        const message = `*Kode Pairing WhatsApp*\n\n` +
            `Kode: *${pairingCode}*\n\n` +
            `Langkah-langkah:\n` +
            `1. Buka WhatsApp di ponsel Anda\n` +
            `2. Ketuk Menu atau Pengaturan\n` +
            `3. Ketuk Perangkat Tertaut\n` +
            `4. Ketuk Tautkan Perangkat\n` +
            `5. Masukkan kode pairing di atas saat diminta`;
        
        return await sendMessage(message);
    } catch (error) {
        console.error('Error saat mengirim pairing code ke Telegram:', error);
    }
};

// Export fungsi-fungsi yang diperlukan
module.exports = {
    sendMessage,
    sendImage,
    sendQRCode,
    sendPairingCode
};

console.log('Modul Telegram berhasil dimuat. Menunggu pesan masuk untuk mendapatkan Chat ID...');
