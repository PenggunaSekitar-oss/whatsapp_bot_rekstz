const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Menghasilkan QR code sebagai file gambar
 * @param {string} text - Teks yang akan dikonversi menjadi QR code
 * @param {string} outputPath - Path file output
 * @param {Object} options - Opsi tambahan untuk QR code
 * @returns {Promise<string>} - Path file QR code yang dihasilkan
 */
const generateQRCodeImage = async (text, outputPath, options = {}) => {
  try {
    // Opsi default untuk QR code yang lebih jelas
    const defaultOptions = {
      errorCorrectionLevel: 'H', // Highest error correction capability
      type: 'png',
      quality: 1.0,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 800, // Ukuran yang lebih besar untuk kejelasan
      scale: 10 // Skala yang lebih besar
    };

    // Gabungkan opsi default dengan opsi yang diberikan
    const qrOptions = { ...defaultOptions, ...options };

    // Pastikan direktori output ada
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Hasilkan QR code
    await qrcode.toFile(outputPath, text, qrOptions);
    console.log(`QR code berhasil disimpan ke: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error saat menghasilkan QR code:', error);
    throw error;
  }
};

/**
 * Menghasilkan QR code sebagai string ASCII
 * @param {string} text - Teks yang akan dikonversi menjadi QR code
 * @param {boolean} small - Apakah menggunakan ukuran kecil
 * @returns {Promise<string>} - String ASCII QR code
 */
const generateQRCodeASCII = async (text, small = false) => {
  try {
    return await new Promise((resolve, reject) => {
      qrcode.toString(text, { type: 'terminal', small }, (err, qrString) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(qrString);
      });
    });
  } catch (error) {
    console.error('Error saat menghasilkan QR code ASCII:', error);
    throw error;
  }
};

/**
 * Menghasilkan QR code sebagai data URL
 * @param {string} text - Teks yang akan dikonversi menjadi QR code
 * @returns {Promise<string>} - Data URL QR code
 */
const generateQRCodeDataURL = async (text) => {
  try {
    return await qrcode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 4,
      width: 800,
      scale: 10
    });
  } catch (error) {
    console.error('Error saat menghasilkan QR code data URL:', error);
    throw error;
  }
};

module.exports = {
  generateQRCodeImage,
  generateQRCodeASCII,
  generateQRCodeDataURL
};
