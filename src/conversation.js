// Utilitas untuk mengelola riwayat percakapan
class ConversationManager {
    constructor() {
        // Menyimpan riwayat percakapan untuk setiap pengguna
        this.conversations = {};
        // Jumlah maksimum pesan yang disimpan per pengguna
        this.maxHistoryLength = 10;
    }

    /**
     * Menambahkan pesan ke riwayat percakapan
     * @param {string} userId - ID pengguna WhatsApp
     * @param {string} role - Peran pengirim pesan ('user' atau 'assistant')
     * @param {string} message - Isi pesan
     */
    addMessage(userId, role, message) {
        // Inisialisasi riwayat percakapan jika belum ada
        if (!this.conversations[userId]) {
            this.conversations[userId] = [];
        }

        // Tambahkan pesan ke riwayat
        this.conversations[userId].push({
            role,
            message,
            timestamp: new Date().toISOString()
        });

        // Batasi jumlah pesan yang disimpan
        if (this.conversations[userId].length > this.maxHistoryLength) {
            this.conversations[userId].shift();
        }
    }

    /**
     * Mendapatkan riwayat percakapan untuk pengguna tertentu
     * @param {string} userId - ID pengguna WhatsApp
     * @returns {Array} - Riwayat percakapan
     */
    getConversation(userId) {
        return this.conversations[userId] || [];
    }

    /**
     * Membuat prompt untuk Gemini AI dengan konteks percakapan
     * @param {string} userId - ID pengguna WhatsApp
     * @param {string} currentMessage - Pesan terbaru dari pengguna
     * @returns {string} - Prompt lengkap dengan konteks percakapan
     */
    createPromptWithContext(userId, currentMessage) {
        const conversation = this.getConversation(userId);
        
        // Jika tidak ada riwayat percakapan, gunakan pesan saat ini saja
        if (conversation.length === 0) {
            return currentMessage;
        }

        // Buat prompt dengan konteks percakapan
        let prompt = "Berikut adalah percakapan sebelumnya:\n\n";
        
        conversation.forEach(msg => {
            const role = msg.role === 'user' ? 'Pengguna' : 'Asisten';
            prompt += `${role}: ${msg.message}\n`;
        });
        
        prompt += `\nPesan terbaru: ${currentMessage}\n\nBerikan respons yang relevan dengan percakapan di atas.`;
        
        // Format prompt sudah ditangani di gemini.js dengan format API baru
        return prompt;
    }

    /**
     * Menghapus riwayat percakapan untuk pengguna tertentu
     * @param {string} userId - ID pengguna WhatsApp
     */
    clearConversation(userId) {
        delete this.conversations[userId];
    }
}

module.exports = new ConversationManager();
