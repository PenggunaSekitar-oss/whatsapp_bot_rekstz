// Modifikasi bot.js untuk mengirim kode autentikasi ke server web
const axios = require('axios');

// Fungsi untuk mengirim QR code ke server web
async function sendQRCodeToServer(qrCode) {
    try {
        const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
        await axios.post(`${serverUrl}/api/qrcode`, { qrCode });
        console.log('QR code berhasil dikirim ke server web');
    } catch (error) {
        console.error('Error saat mengirim QR code ke server web:', error.message);
    }
}

// Fungsi untuk mengirim pairing code ke server web
async function sendPairingCodeToServer(pairingCode) {
    try {
        const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
        await axios.post(`${serverUrl}/api/pairingcode`, { pairingCode });
        console.log('Pairing code berhasil dikirim ke server web');
    } catch (error) {
        console.error('Error saat mengirim pairing code ke server web:', error.message);
    }
}

module.exports = {
    sendQRCodeToServer,
    sendPairingCodeToServer
};
