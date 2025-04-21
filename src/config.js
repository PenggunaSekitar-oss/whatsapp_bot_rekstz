// Konfigurasi untuk bot WhatsApp dengan Gemini AI
module.exports = {
    // Konfigurasi sesi WhatsApp
    sessionName: 'whatsapp-gemini-bot',
    
    // Konfigurasi Gemini AI
    geminiApiKey: 'AIzaSyASFISq_9VRt6WL8D-swXjcg2MruG6ZTb8',
    
    // Konfigurasi bot
    botName: 'rekstz-v01',
    ownerNumber: '', // Nomor pemilik bot (format: 62812345678)
    
    // Pesan selamat datang
    welcomeMessage: 'Halo! Saya adalah asisten pribadi Anda yang didukung oleh Gemini AI. Apa yang dapat saya bantu hari ini?',
    
    // Prefix untuk perintah bot (opsional)
    prefix: '!',
    
    // Pengaturan lainnya
    enableLogging: true,
    maxMessageLength: 4000 // Batasan panjang pesan WhatsApp
};
