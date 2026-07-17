import OCRService from "./OCRService";
import GeminiService from "./GeminiService";

import { db, storage } from "../firebase/config";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

class MedicineAI {

  // ===================================
  // Upload Image
  // ===================================

  async uploadImage(imageFile) {

    try {

      const fileName =
        `medicine_scans/${Date.now()}_${imageFile.name}`;

      const storageRef =
        ref(storage, fileName);

      await uploadBytes(
        storageRef,
        imageFile
      );

      const imageURL =
        await getDownloadURL(storageRef);

      return {

        success: true,

        imageURL,

      };

    }

    catch (error) {

      console.error(error);

      return {

        success: false,

        error: error.message,

      };

    }

  }

  // ===================================
  // Save Scan History
  // ===================================

  async saveScan(data) {

    try {

      const docRef =
        await addDoc(

          collection(db, "medicine_scans"),

          {

            ...data,

            createdAt:
              serverTimestamp(),

          }

        );

      return {

        success: true,

        id: docRef.id,

      };

    }

    catch (error) {

      console.error(error);

      return {

        success: false,

        error: error.message,

      };

    }

  }

  // ===================================
  // OCR
  // ===================================

  async runOCR(imageFile) {

    return await OCRService.analyzeImage(

      imageFile

    );

  }

  // ===================================
  // Gemini AI
  // ===================================

  async analyzeMedicine(cleanText) {

    return await GeminiService.analyzeMedicine(

      cleanText

    );

  }

  // ===================================
  // Full Pipeline
  // ===================================

  async processMedicine(imageFile) {

    try {

      // STEP 1
      // Upload Image

      const uploadResult =
        await this.uploadImage(imageFile);

      if (!uploadResult.success) {

        return uploadResult;

      }

      // STEP 2
      // OCR

      const ocrResult =
        await this.runOCR(imageFile);

      if (!ocrResult.success) {

        return ocrResult;

      }

      // STEP 3
      // Gemini

      const aiResult =
        await this.analyzeMedicine(

          ocrResult.cleanedText

        );

      if (!aiResult.success) {

        return aiResult;

      }

      // STEP 4

      let report;

      try {

        report =
          JSON.parse(aiResult.text);

      }

      catch {

        report = {

          raw: aiResult.text,

        };

      }

      // STEP 5

      const saveResult =
        await this.saveScan({

          imageURL:
            uploadResult.imageURL,

          rawOCR:
            ocrResult.rawText,

          cleanOCR:
            ocrResult.cleanedText,

          medicine:
            report,

        });

      return {

        success: true,

        imageURL:
          uploadResult.imageURL,

        report,

        firestoreId:
          saveResult.id,

      };

    }

    catch (error) {

      console.error(error);

      return {

        success: false,

        error: error.message,

      };

    }

  }

}
// ===================================
// Named Exports (ScannerOCR Compatibility)
// ===================================

export async function analyzeMedicine(text) {
  return await GeminiService.analyzeMedicine(text);
}

export async function processMedicine(imageFile) {
  return await new MedicineAI().processMedicine(imageFile);
}
export default new MedicineAI();