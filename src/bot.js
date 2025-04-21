// Import modul yang diperlukan
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const config = require('./config');
const geminiAI = require('./gemini');
const conversationManager = require('./conversation');

// Buat interface readline untuk input dari terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`🤖 Memulai Bot WhatsApp dengan Gemini AI...`);
console.log(`Nama Bot: ${config.botName}`);
console.log(`Sesi: ${config.sessionName}`);
console.log(`Prefix Perintah: ${config.prefix}`);

// Buat client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: config.sessionName
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu']
    }
});

// Fungsi untuk menyiapkan event handler pada client
function setupEventHandlers(client) {
    // Event ketika client sedang dimuat
    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    // Event ketika QR code perlu di-scan
    client.on('qr', (qr) => {
        console.log('QR Code diterima, silakan scan dengan WhatsApp Anda:');
        qrcode.generate(qr, { small: true });
        
        // Langsung memulai proses pairing code otomatis setelah beberapa detik
        console.log('\nMemulai proses pairing code otomatis...');
        
        // Hentikan client saat ini setelah beberapa detik
        setTimeout(() => {
            client.destroy().then(() => {
                console.log('Memulai ulang dengan metode pairing code...');
                
                // Buat client baru dengan dukungan pairing code
                const clientWithPairingCode = new Client({
                    authStrategy: new LocalAuth({
                        clientId: config.sessionName
                    }),
                    puppeteer: {
                        headless: true,
                        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu']
                    }
                });
                
                // Salin semua event handler dari client lama
                setupEventHandlers(clientWithPairingCode);
                
                // Mulai client dan minta pairing code
                clientWithPairingCode.initialize();
                
                // Daftar nomor WhatsApp yang akan dicoba secara berurutan
                const phoneNumbers = [
                    '6287755164724', // Nomor pengguna yang diberikan
                    '628123456789', // Nomor cadangan 1
                    '628987654321', // Nomor cadangan 2
                    '628111222333', // Nomor cadangan 3
                ];
                
                // Fungsi untuk mencoba nomor berikutnya jika nomor sebelumnya gagal
                const tryNextNumber = (index) => {
                    if (index >= phoneNumbers.length) {
                        console.log('Semua nomor telah dicoba. Silakan scan QR code jika muncul.');
                        return;
                    }
                    
                    const phoneNumber = phoneNumbers[index];
                    console.log(`\nMencoba mendapatkan pairing code dengan nomor: ${phoneNumber}`);
                    
                    clientWithPairingCode.requestPairingCode(phoneNumber)
                        .then((code) => {
                            console.log(`\nKode pairing Anda: ${code}`);
                            console.log('\nMasukkan kode ini di aplikasi WhatsApp Anda:');
                            console.log('1. Buka WhatsApp di ponsel Anda');
                            console.log('2. Ketuk Menu atau Pengaturan');
                            console.log('3. Ketuk Perangkat Tertaut');
                            console.log('4. Ketuk Tautkan Perangkat');
                            console.log('5. Masukkan kode pairing di atas saat diminta');
                        })
                        .catch((err) => {
                            console.error(`Gagal mendapatkan kode pairing dengan nomor ${phoneNumber}:`, err);
                            // Coba nomor berikutnya setelah beberapa detik
                            setTimeout(() => tryNextNumber(index + 1), 5000);
                        });
                };
                
                // Mulai mencoba nomor pertama setelah beberapa detik
                setTimeout(() => tryNextNumber(0), 5000);
                
            }).catch(err => {
                console.error('Gagal menghentikan client:', err);
                console.log('Melanjutkan dengan metode QR code...');
            });
        }, 10000); // Tunggu 10 detik sebelum beralih ke pairing code
    });

    // Event ketika client siap
    client.on('ready', () => {
        console.log('Client siap!');
        
        // Kirim pesan ke pemilik bot jika nomor pemilik dikonfigurasi
        if (config.ownerNumber) {
            const chatId = config.ownerNumber.includes('@c.us') ? 
                config.ownerNumber : `${config.ownerNumber}@c.us`;
                
            client.sendMessage(chatId, `🤖 *${config.botName} telah aktif!*\n\nBot telah berhasil dimulai dan siap digunakan.`);
        }
    });

    // Event ketika client terautentikasi
    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
    });

    // Event ketika autentikasi gagal
    client.on('auth_failure', (msg) => {
        console.error('AUTHENTICATION FAILURE', msg);
    });

    // Event ketika koneksi terputus
    client.on('disconnected', (reason) => {
        console.log('Client terputus:', reason);
    });

    // Event ketika menerima pesan
    client.on('message', async (message) => {
        try {
            console.log(`Pesan diterima dari ${message.from}: ${message.body}`);
            
            // Jika pesan dari grup dan tidak dimention, abaikan
            if (message.isGroup && !message.mentionedIds.includes(client.info.wid._serialized)) {
                return;
            }
            
            // Jika pesan dimulai dengan prefix, proses sebagai perintah
            if (message.body.startsWith(config.prefix)) {
                const command = message.body.slice(config.prefix.length).trim().split(' ')[0].toLowerCase();
                const args = message.body.slice(config.prefix.length).trim().split(' ').slice(1);
                
                // Perintah bantuan
                if (command === 'help' || command === 'bantuan') {
                    const helpMessage = `*Rekstz-v01 - Perintah Tersedia*\n\n` +
                        `${config.prefix}help - Menampilkan bantuan\n` +
                        `${config.prefix}ping - Memeriksa status bot\n` +
                        `${config.prefix}info - Informasi tentang bot\n` +
                        `${config.prefix}reset - Menghapus riwayat percakapan\n\n` +
                        `Untuk bertanya ke Rekstz-v01, cukup kirim pesan anda`;
                    await message.reply(helpMessage);
                    return;
                }
                
                // Perintah ping
                if (command === 'ping') {
                    await message.reply('Pong! Bot aktif dan berjalan.');
                    return;
                }
                
                // Perintah info
                if (command === 'info') {
                    const infoMessage = `*halo saya rekstz-v01* (tekan teksnya)\n\n` +
                        `Bot ini dibangun oleh tuanku (Muh Amin Arsyad) tuanku menggunakan Gemini AI untuk memberikan respons cerdas terhadap pertanyaan Anda.\n\n` +
                        `Dibuat dengan ❤️ Mhaminn Arsyad`;
                    await message.reply(infoMessage);
                    return;
                }
                
                // Perintah reset - menghapus riwayat percakapan
                if (command === 'reset') {
                    conversationManager.clearConversation(message.from);
                    await message.reply('Riwayat percakapan Anda telah dihapus. Percakapan baru dimulai.');
                    return;
                }
                
                // Perintah tidak dikenali
                await message.reply(`Perintah tidak dikenali. Ketik ${config.prefix}help untuk bantuan.`);
                return;
            }
            
            // Jika bukan perintah, proses sebagai pertanyaan untuk Gemini AI
            // Beri tahu pengguna bahwa bot sedang mengetik
            const chat = await message.getChat();
            chat.sendStateTyping();
            
            // Tambahkan pesan pengguna ke riwayat percakapan
            conversationManager.addMessage(message.from, 'user', message.body);
            
            // Buat prompt dengan konteks percakapan
            const promptWithContext = conversationManager.createPromptWithContext(message.from, message.body);
            
            // Dapatkan respons dari Gemini AI
            const response = await geminiAI.generateResponse(promptWithContext);
            
            // Tambahkan respons asisten ke riwayat percakapan
            conversationManager.addMessage(message.from, 'assistant', response);
            
            // Kirim respons ke pengguna
            await message.reply(response);
            
        } catch (error) {
            console.error('Error saat memproses pesan:', error);
            await message.reply('Maaf, terjadi kesalahan saat memproses pesan Anda.');
        }
    });
}

// Siapkan event handler untuk client utama
setupEventHandlers(client);

// Inisialisasi client
client.initialize();

// Menangani proses shutdown dengan baik
process.on('SIGINT', async () => {
    console.log('Menutup aplikasi...');
    await client.destroy();
    process.exit(0);
});

// Export client untuk digunakan di file lain jika diperlukan
module.exports = client;
