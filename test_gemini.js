// Script untuk menguji integrasi Gemini AI yang telah diperbarui
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./src/config');

async function testGeminiIntegration() {
  try {
    console.log('🧪 Menguji integrasi Gemini AI dengan model gemini-2.0-flash...');
    console.log(`API Key yang digunakan: ${config.geminiApiKey.substring(0, 5)}...${config.geminiApiKey.substring(config.geminiApiKey.length - 5)}`);
    
    // Inisialisasi Gemini AI dengan API key dari konfigurasi
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    
    // Menggunakan model gemini-2.0-flash yang lebih baru
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Format prompt sesuai dengan API terbaru
    const prompt = "Perkenalkan dirimu sebagai asisten AI";
    const formattedPrompt = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    
    console.log('Mengirim permintaan ke Gemini AI...');
    
    // Kirim prompt ke Gemini AI dengan format yang benar
    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\n✅ Integrasi Gemini AI berhasil!');
    console.log('\nRespons dari Gemini AI:');
    console.log('------------------------');
    console.log(text);
    console.log('------------------------');
    console.log('\nPerubahan kode berhasil memperbaiki masalah integrasi Gemini AI.');
    console.log('Bot WhatsApp Anda sekarang dapat menggunakan Gemini AI dengan model gemini-2.0-flash.');
    
  } catch (error) {
    console.error('\n❌ Terjadi kesalahan saat menguji integrasi Gemini AI:');
    console.error(error);
    console.error('\nSaran perbaikan:');
    
    if (error.message.includes('API key')) {
      console.log('- Pastikan API key Gemini AI yang digunakan valid dan aktif');
    } else if (error.message.includes('not found')) {
      console.log('- Periksa nama model yang digunakan, mungkin perlu diperbarui lagi');
    } else {
      console.log('- Periksa format permintaan API yang digunakan');
      console.log('- Pastikan koneksi internet berfungsi dengan baik');
    }
  }
}

// Jalankan pengujian
testGeminiIntegration();
