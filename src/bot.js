// Bot WhatsApp dengan integrasi Gemini AI
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const geminiAI = require('./gemini');
const conversationManager = require('./conversation');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Inisialisasi readline interface untuk input pengguna
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Inisialisasi client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: config.sessionName
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu']
    }
});

// Menampilkan QR code untuk autentikasi WhatsApp
client.on('qr', (qr) => {
    console.log('QR Code diterima, silakan scan dengan WhatsApp Anda:');
    qrcode.generate(qr, { small: true });
    
    // Tambahkan opsi untuk menggunakan pairing code
    console.log('\nJika Anda hanya memiliki satu perangkat, gunakan metode pairing code:');
    rl.question('Masukkan nomor WhatsApp Anda (format: 628xxxxxxxxxx): ', (phoneNumber) => {
        if (phoneNumber && phoneNumber.length > 8) {
            // Hentikan client saat ini
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
                
                // Minta pairing code setelah beberapa detik
                setTimeout(() => {
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
                            console.error('Gagal mendapatkan kode pairing:', err);
                            console.log('Silakan coba lagi atau gunakan metode QR code jika memungkinkan.');
                            process.exit(1);
                        });
                }, 5000);
            }).catch(err => {
                console.error('Gagal menghentikan client:', err);
                console.log('Melanjutkan dengan metode QR code...');
            });
        } else {
            console.log('Melanjutkan dengan metode QR code...');
        }
    });
});

// Fungsi untuk menyiapkan event handler pada client
function setupEventHandlers(client) {
    // Event ketika client sedang dimuat
    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    // Event ketika client siap digunakan
    client.on('ready', () => {
        console.log('Client siap!');
        console.log(`Bot ${config.botName} telah aktif`);
        
        // Tutup readline interface
        rl.close();
        
        // Kirim pesan ke pemilik bot jika nomor pemilik dikonfigurasi
        if (config.ownerNumber && config.ownerNumber.length > 0) {
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
