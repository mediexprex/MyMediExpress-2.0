import Tesseract from "tesseract.js";

class OCRService {

  // ===============================
  // Extract Text From Image
  // ===============================

  async extractText(imageFile) {

    try {

      const result = await Tesseract.recognize(
        imageFile,
        "eng",
        {
          logger: (m) => {
            console.log("OCR:", m);
          },
        }
      );

      return {
        success: true,
        text: result.data.text,
      };

    } catch (error) {

      console.error("OCR Error:", error);

      return {
        success: false,
        error: error.message,
      };

    }

  }

  // ===============================
  // Clean OCR Text
  // ===============================

  cleanText(text = "") {

    return text
      .replace(/\r/g, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }

  // ===============================
  // Medicine Name Detection
  // ===============================

  detectMedicineName(text) {

    const cleaned = this.cleanText(text);

    const words = cleaned.split(" ");

    if (words.length === 0) {

      return "";

    }

    return words.slice(0, 3).join(" ");

  }

  // ===============================
  // Batch Number
  // ===============================

  detectBatch(text) {

    const match =
      text.match(/batch\s*[:\-]?\s*([A-Za-z0-9]+)/i) ||
      text.match(/b\.?no\.?\s*[:\-]?\s*([A-Za-z0-9]+)/i);

    return match ? match[1] : "";

  }

  // ===============================
  // Manufacturing Date
  // ===============================

  detectManufactureDate(text) {

    const match =
      text.match(/mfg\s*[:\-]?\s*(\d{2}\/\d{2,4})/i);

    return match ? match[1] : "";

  }

  // ===============================
  // Expiry Date
  // ===============================

  detectExpiryDate(text) {

    const match =
      text.match(/exp\s*[:\-]?\s*(\d{2}\/\d{2,4})/i);

    return match ? match[1] : "";

  }

  // ===============================
  // Extract Everything
  // ===============================

  async analyzeImage(imageFile) {

    const result =
      await this.extractText(imageFile);

    if (!result.success) {

      return result;

    }

    const cleaned =
      this.cleanText(result.text);

    return {

      success: true,

      rawText: result.text,

      cleanedText: cleaned,

      medicineName:
        this.detectMedicineName(cleaned),

      batch:
        this.detectBatch(cleaned),

      manufactureDate:
        this.detectManufactureDate(cleaned),

      expiryDate:
        this.detectExpiryDate(cleaned),

    };

  }

}
// ===================================
// Named Exports (ScannerOCR Compatibility)
// ===================================

export async function extractTextFromImage(imageFile) {
  return await new OCRService().analyzeImage(imageFile);
}

export async function runOCR(imageFile) {
  return await new OCRService().analyzeImage(imageFile);
}

export default new OCRService();