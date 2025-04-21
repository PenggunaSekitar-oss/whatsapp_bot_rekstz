// Utilitas untuk menangani pesan media
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class MediaHandler {
    constructor() {
        // Direktori untuk menyimpan media sementara
        this.tempDir = path.join(__dirname, '..', 'temp');
        
        // Buat direktori jika belum ada
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Mengunduh file dari URL
     * @param {string} url - URL file yang akan diunduh
     * @param {string} filename - Nama file untuk menyimpan
     * @returns {Promise<string>} - Path file yang diunduh
     */
    async downloadFile(url, filename) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(this.tempDir, filename);
            const file = fs.createWriteStream(filePath);
            
            const protocol = url.startsWith('https') ? https : http;
            
            protocol.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download file: ${response.statusCode}`));
                    return;
                }
                
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    resolve(filePath);
                });
            }).on('error', (err) => {
                fs.unlink(filePath, () => {}); // Hapus file jika terjadi error
                reject(err);
            });
        });
    }

    /**
     * Membuat objek MessageMedia dari file lokal
     * @param {string} filePath - Path file lokal
     * @returns {Promise<MessageMedia>} - Objek MessageMedia
     */
    async createMediaFromFile(filePath) {
        try {
            const mimetype = this.getMimeType(filePath);
            const data = fs.readFileSync(filePath, { encoding: 'base64' });
            const filename = path.basename(filePath);
            
            return new MessageMedia(mimetype, data, filename);
        } catch (error) {
            console.error('Error creating media from file:', error);
            throw error;
        }
    }

    /**
     * Membuat objek MessageMedia dari URL
     * @param {string} url - URL media
     * @returns {Promise<MessageMedia>} - Objek MessageMedia
     */
    async createMediaFromUrl(url) {
        try {
            const filename = this.getFilenameFromUrl(url);
            const filePath = await this.downloadFile(url, filename);
            const media = await this.createMediaFromFile(filePath);
            
            // Hapus file sementara setelah digunakan
            fs.unlinkSync(filePath);
            
            return media;
        } catch (error) {
            console.error('Error creating media from URL:', error);
            throw error;
        }
    }

    /**
     * Mendapatkan nama file dari URL
     * @param {string} url - URL media
     * @returns {string} - Nama file
     */
    getFilenameFromUrl(url) {
        const urlParts = url.split('/');
        let filename = urlParts[urlParts.length - 1];
        
        // Hapus parameter query jika ada
        if (filename.includes('?')) {
            filename = filename.split('?')[0];
        }
        
        // Jika tidak ada ekstensi file, tambahkan .tmp
        if (!filename.includes('.')) {
            filename += '.tmp';
        }
        
        return filename;
    }

    /**
     * Mendapatkan MIME type berdasarkan ekstensi file
     * @param {string} filePath - Path file
     * @returns {string} - MIME type
     */
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.mp4': 'video/mp4',
            '.mp3': 'audio/mpeg',
            '.ogg': 'audio/ogg',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.txt': 'text/plain'
        };
        
        return mimeTypes[ext] || 'application/octet-stream';
    }

    /**
     * Membersihkan direktori temp
     */
    cleanTempDir() {
        try {
            const files = fs.readdirSync(this.tempDir);
            for (const file of files) {
                fs.unlinkSync(path.join(this.tempDir, file));
            }
            console.log('Temp directory cleaned');
        } catch (error) {
            console.error('Error cleaning temp directory:', error);
        }
    }
}

module.exports = new MediaHandler();
