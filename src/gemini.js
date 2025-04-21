// Utilitas untuk integrasi dengan Gemini AI
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

class GeminiAI {
    constructor() {
        // Inisialisasi Gemini AI dengan API key dari konfigurasi
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
        // Menggunakan model gemini-2.0-flash yang lebih baru sesuai dengan API terbaru
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    /**
     * Mengirim pertanyaan ke Gemini AI dan mendapatkan respons
     * @param {string} prompt - Pertanyaan atau prompt untuk Gemini AI
     * @returns {Promise<string>} - Respons dari Gemini AI
     */
    async generateResponse(prompt) {
        try {
            // Periksa apakah API key telah dikonfigurasi
            if (config.geminiApiKey === 'MASUKKAN_API_KEY_GEMINI_ANDA_DISINI') {
                return "Error: API key Gemini AI belum dikonfigurasi. Silakan perbarui file config.js dengan API key Anda.";
            }

            // Format prompt sesuai dengan API terbaru
            const formattedPrompt = {
                contents: [{
                    parts: [{ text: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) }]
                }]
            };

            // Kirim prompt ke Gemini AI dengan format yang benar
            const result = await this.model.generateContent(formattedPrompt);
            const response = await result.response;
            const text = response.text();

            // Batasi panjang respons sesuai dengan batasan WhatsApp
            if (text.length > config.maxMessageLength) {
                return text.substring(0, config.maxMessageLength) + "... (respons terpotong karena terlalu panjang)";
            }

            return text;
        } catch (error) {
            console.error('Error saat mengakses Gemini AI:', error);
            return `Maaf, terjadi kesalahan saat berkomunikasi dengan Gemini AI: ${error.message}`;
        }
    }
}

module.exports = new GeminiAI();
