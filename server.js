// Server untuk mengirimkan kode autentikasi WhatsApp
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Buat aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Buat direktori public jika belum ada
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Variabel untuk menyimpan kode terbaru
let latestQRCode = null;
let latestPairingCode = null;
let lastUpdated = null;

// Endpoint untuk mendapatkan status terbaru
app.get('/api/status', (req, res) => {
    res.json({
        qrCode: latestQRCode ? true : false,
        pairingCode: latestPairingCode,
        lastUpdated: lastUpdated
    });
});

// Endpoint untuk mendapatkan QR code sebagai gambar
app.get('/api/qrcode', async (req, res) => {
    if (!latestQRCode) {
        return res.status(404).json({ error: 'QR code belum tersedia' });
    }
    
    try {
        // Buat QR code sebagai PNG
        const qrImagePath = path.join(publicDir, 'latest_qrcode.png');
        await QRCode.toFile(qrImagePath, latestQRCode, {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 1.0,
            margin: 4,
            scale: 10,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        // Kirim file QR code
        res.sendFile(qrImagePath);
    } catch (error) {
        console.error('Error saat membuat QR code:', error);
        res.status(500).json({ error: 'Gagal membuat QR code' });
    }
});

// Endpoint untuk mendapatkan QR code sebagai teks
app.get('/api/qrcode/text', (req, res) => {
    if (!latestQRCode) {
        return res.status(404).json({ error: 'QR code belum tersedia' });
    }
    
    res.send(latestQRCode);
});

// Endpoint untuk menerima QR code baru
app.post('/api/qrcode', (req, res) => {
    const { qrCode } = req.body;
    
    if (!qrCode) {
        return res.status(400).json({ error: 'QR code tidak ditemukan dalam request' });
    }
    
    latestQRCode = qrCode;
    lastUpdated = new Date().toISOString();
    
    console.log('QR code baru diterima');
    res.json({ success: true });
});

// Endpoint untuk menerima pairing code baru
app.post('/api/pairingcode', (req, res) => {
    const { pairingCode } = req.body;
    
    if (!pairingCode) {
        return res.status(400).json({ error: 'Pairing code tidak ditemukan dalam request' });
    }
    
    latestPairingCode = pairingCode;
    lastUpdated = new Date().toISOString();
    
    console.log('Pairing code baru diterima:', pairingCode);
    res.json({ success: true });
});

// Halaman utama
app.get('/', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WhatsApp Bot Authentication</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
            }
            .container {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                background-color: #f9f9f9;
            }
            .qr-container {
                text-align: center;
                margin: 20px 0;
            }
            .qr-image {
                max-width: 100%;
                height: auto;
            }
            .pairing-code {
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                padding: 10px;
                background-color: #e9f7fe;
                border-radius: 4px;
            }
            .instructions {
                background-color: #f0f0f0;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            }
            .refresh-btn {
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 10px;
            }
            .status {
                font-style: italic;
                color: #666;
                margin-top: 10px;
            }
            .hidden {
                display: none;
            }
        </style>
    </head>
    <body>
        <h1>WhatsApp Bot Authentication</h1>
        
        <div class="container">
            <h2>Status</h2>
            <p id="status-message">Memuat status...</p>
            <button class="refresh-btn" onclick="checkStatus()">Refresh Status</button>
        </div>
        
        <div id="qr-section" class="container hidden">
            <h2>QR Code</h2>
            <div class="qr-container">
                <img id="qr-image" class="qr-image" src="/api/qrcode" alt="WhatsApp QR Code">
            </div>
            <button class="refresh-btn" onclick="refreshQRCode()">Refresh QR Code</button>
            <div class="instructions">
                <h3>Cara Scan QR Code:</h3>
                <ol>
                    <li>Buka WhatsApp di ponsel Anda</li>
                    <li>Ketuk Menu atau Pengaturan</li>
                    <li>Ketuk Perangkat Tertaut</li>
                    <li>Ketuk Tautkan Perangkat</li>
                    <li>Arahkan kamera ke QR code di atas</li>
                </ol>
            </div>
        </div>
        
        <div id="pairing-section" class="container hidden">
            <h2>Pairing Code</h2>
            <div class="pairing-code" id="pairing-code">-</div>
            <div class="instructions">
                <h3>Cara Menggunakan Pairing Code:</h3>
                <ol>
                    <li>Buka WhatsApp di ponsel Anda</li>
                    <li>Ketuk Menu atau Pengaturan</li>
                    <li>Ketuk Perangkat Tertaut</li>
                    <li>Ketuk Tautkan Perangkat</li>
                    <li>Ketuk "Tautkan dengan nomor telepon"</li>
                    <li>Masukkan kode pairing di atas</li>
                </ol>
            </div>
        </div>
        
        <script>
            // Fungsi untuk memeriksa status
            async function checkStatus() {
                try {
                    const response = await fetch('/api/status');
                    const data = await response.json();
                    
                    const statusMessage = document.getElementById('status-message');
                    const qrSection = document.getElementById('qr-section');
                    const pairingSection = document.getElementById('pairing-section');
                    
                    if (data.qrCode) {
                        qrSection.classList.remove('hidden');
                        statusMessage.textContent = 'QR Code tersedia. Silakan scan dengan WhatsApp Anda.';
                        refreshQRCode();
                    } else {
                        qrSection.classList.add('hidden');
                        statusMessage.textContent = 'QR Code belum tersedia.';
                    }
                    
                    if (data.pairingCode) {
                        pairingSection.classList.remove('hidden');
                        document.getElementById('pairing-code').textContent = data.pairingCode;
                        statusMessage.textContent = 'Pairing Code tersedia. Silakan gunakan di WhatsApp Anda.';
                    } else {
                        pairingSection.classList.add('hidden');
                    }
                    
                    if (!data.qrCode && !data.pairingCode) {
                        statusMessage.textContent = 'Tidak ada kode autentikasi yang tersedia. Silakan coba lagi nanti.';
                    }
                    
                    if (data.lastUpdated) {
                        const lastUpdated = new Date(data.lastUpdated);
                        const formattedDate = lastUpdated.toLocaleString();
                        document.getElementById('status-message').innerHTML += '<br><span class="status">Terakhir diperbarui: ' + formattedDate + '</span>';
                    }
                } catch (error) {
                    console.error('Error saat memeriksa status:', error);
                    document.getElementById('status-message').textContent = 'Gagal memeriksa status. Silakan coba lagi.';
                }
            }
            
            // Fungsi untuk me-refresh QR code
            function refreshQRCode() {
                const qrImage = document.getElementById('qr-image');
                qrImage.src = '/api/qrcode?t=' + new Date().getTime();
            }
            
            // Periksa status saat halaman dimuat
            window.onload = function() {
                checkStatus();
                // Periksa status setiap 10 detik
                setInterval(checkStatus, 10000);
            };
        </script>
    </body>
    </html>
    `;
    
    res.send(htmlContent);
});

// Mulai server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

module.exports = app;
