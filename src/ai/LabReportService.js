import { db, storage, auth } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, query, where, orderBy, getDocs, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import OCRService from "./OCRService";
import GeminiService from "./GeminiService";

class LabReportService {
  /**
   * Orchestrates the entire lab report analysis process.
   * Handles Upload, OCR, Gemini Analysis, and Firestore Storage.
   */
  async processReport(file, onProgress) {
    try {
      if (!auth.currentUser) throw new Error("Authentication required.");

      const userId = auth.currentUser.uid;
      const fileName = file.name;
      const fileType = file.type;

      // 1. Upload to Firebase Storage
      onProgress({ step: "Uploading", percent: 10 });
      const storagePath = `lab_reports/${userId}/${Date.now()}_${fileName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. OCR Extraction
      onProgress({ step: "Extracting Text (OCR)", percent: 40 });
      let extractedText = "";

      if (fileType === "application/pdf") {
        extractedText = await this.performPdfOCR(file);
      } else {
        const ocrResult = await OCRService.analyzeImage(file);
        if (!ocrResult.success) throw new Error("OCR Failure: " + ocrResult.error);
        extractedText = ocrResult.cleanedText;
      }

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error("Could not extract readable text from the report.");
      }

      // 3. AI Analysis with Gemini
      onProgress({ step: "AI Analysis", percent: 70 });
      const aiResponse = await this.analyzeWithGemini(extractedText);

      if (!aiResponse.success) {
        throw new Error("Gemini Analysis Failure: " + aiResponse.error);
      }

      let analysisData;
      try {
        // Clean markdown code blocks if Gemini returns them
        const cleanJson = aiResponse.text.replace(/```json|```/gi, "").trim();
        analysisData = JSON.parse(cleanJson);
      } catch (e) {
        console.error("JSON Parse Error:", aiResponse.text);
        throw new Error("AI returned invalid data format. Please try again.");
      }

      // 4. Save to Firestore
      onProgress({ step: "Saving Results", percent: 90 });
      const reportData = {
        userId,
        imageURL: downloadURL,
        storagePath,
        fileName,
        rawOCR: extractedText,
        cleanOCR: extractedText, // Already cleaned by service logic
        analysis: analysisData,
        healthScore: analysisData.healthScore || 0,
        overallRisk: analysisData.overallRisk || "Unknown",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "lab_reports"), reportData);

      onProgress({ step: "Complete", percent: 100 });
      return { success: true, id: docRef.id, data: reportData };

    } catch (error) {
      console.error("LabReportService Error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * PDF OCR Implementation.
   * Note: This usually requires pdfjs-dist. If not present, we prompt for image conversion.
   */
  async performPdfOCR(file) {
    // In a real browser environment, we'd use pdf.js to render pages to canvases
    // Since we don't have pdf.js in package.json yet, we implement a placeholder
    // that informs the user or tries to use Tesseract's limited PDF support if configured.
    // For production React 19, we assume the environment is set up for Tesseract.
    // Tesseract.js (v5+) actually supports multi-page images/PDFs if the worker is configured.

    const result = await OCRService.analyzeImage(file);
    if (!result.success) throw new Error("PDF OCR failed. Please try uploading report pages as JPG/PNG.");
    return result.cleanedText;
  }

  async analyzeWithGemini(ocrText) {
    const prompt = `
      Analyze the following laboratory report text extracted via OCR.
      Identify clinical markers like CBC, Hemoglobin, Blood Sugar, HbA1c, LFT, KFT, Lipid Profile, Thyroid (TSH), Vitamins, etc.

      Return ONLY valid JSON.
      No markdown. No explanation. No preamble.

      Schema:
      {
        "patientSummary": "Short medical summary of the report",
        "healthScore": 0-100 (where 100 is optimal health),
        "overallRisk": "Low" | "Moderate" | "High" | "Critical",
        "abnormalTests": [
          {
            "name": "Test name",
            "value": "Observed value",
            "reference": "Reference range",
            "status": "High" | "Low" | "Critical",
            "reason": "Why is this concerning?",
            "recommendation": "Short action item"
          }
        ],
        "normalTests": [
          {
            "name": "Test name",
            "value": "Value",
            "reference": "Range"
          }
        ],
        "doctorAdvice": "Overall medical guidance based on the report",
        "dietSuggestions": ["Suggestion 1", "Suggestion 2"]
      }

      LAB REPORT TEXT:
      ${ocrText}
    `;

    return await GeminiService.generate(prompt);
  }

  async getHistory() {
    try {
      if (!auth.currentUser) return [];
      const q = query(
        collection(db, "lab_reports"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("History Fetch Error:", error);
      return [];
    }
  }

  async deleteReport(reportId, storagePath) {
    try {
      // 1. Delete Firestore Doc
      await deleteDoc(doc(db, "lab_reports", reportId));

      // 2. Delete Storage File
      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef).catch(e => console.warn("File already deleted from storage"));
      }
      return { success: true };
    } catch (error) {
      console.error("Delete Error:", error);
      throw error;
    }
  }
}

export default new LabReportService();