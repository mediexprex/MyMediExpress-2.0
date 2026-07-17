import { db, storage, auth } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import OCRService from "../../ai/OCRService";
import GeminiService from "../../ai/GeminiService";

class LabReportService {
  /**
   * Orchestrates the entire lab report analysis process
   */
  async processLabReport(file, onProgress) {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");
      const userId = auth.currentUser.uid;

      // 1. Upload File to Storage
      onProgress(10, "Uploading file...");
      const fileURL = await this.uploadFile(file);

      // 2. Extract Text using OCR
      onProgress(30, "Extracting text from report...");
      const ocrResult = await OCRService.analyzeImage(file);
      if (!ocrResult.success) throw new Error("OCR extraction failed");

      const rawOCR = ocrResult.rawText;
      const cleanOCR = ocrResult.cleanedText;

      // 3. Analyze with Gemini AI
      onProgress(60, "AI Analyzing biomarkers...");
      const aiAnalysis = await this.analyzeWithAI(cleanOCR);
      if (!aiAnalysis.success) throw new Error("AI analysis failed: " + aiAnalysis.error);

      let analysisData;
      try {
        analysisData = JSON.parse(aiAnalysis.text);
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", aiAnalysis.text);
        throw new Error("AI returned invalid data format");
      }

      // 4. Save to Firestore
      onProgress(90, "Saving to history...");
      const reportDoc = {
        userId,
        imageURL: fileURL,
        rawOCR,
        cleanOCR,
        analysis: analysisData,
        healthScore: analysisData.healthScore || 0,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "lab_reports"), reportDoc);

      onProgress(100, "Analysis complete!");
      return {
        id: docRef.id,
        ...reportDoc,
        success: true
      };

    } catch (error) {
      console.error("LabReportService Error:", error);
      return { success: false, error: error.message };
    }
  }

  async uploadFile(file) {
    const storageRef = ref(storage, `lab_reports/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  async analyzeWithAI(text) {
    const prompt = `
    You are an expert clinical pathologist and medical AI.
    Analyze the following text extracted from a Lab Report (Blood Test/Urine Test/etc).

    REPORT TEXT:
    ${text}

    Recognize and extract values for:
    CBC (Hemoglobin, RBC, WBC, Platelets), Blood Sugar (Fasting, PP, HbA1c),
    Vitamins (D, B12), Thyroid (TSH, T3, T4), Liver Function (ALT, AST, Bilirubin),
    Kidney Function (Creatinine, Urea), Lipid Profile (Cholesterol, Triglycerides, HDL, LDL),
    Electrolytes, and any other clinical markers.

    RULES:
    1. Return ONLY valid JSON.
    2. Do not use markdown blocks (\`\`\`json).
    3. Be extremely precise with status (Normal, High, Low, Critical).
    4. If a value is missing or not found, do not include it in abnormalTests/normalTests or set it to null.
    5. healthScore should be 0-100 based on the report findings (100 being perfect health).
    6. overallRisk should be "Low", "Moderate", "High", or "Critical".
    7. Never explain. Never say "Sure, here is...".

    SCHEMA:
    {
      "summary": "Brief 2-3 sentence overview of the patient's status",
      "healthScore": 85,
      "overallRisk": "Low",
      "abnormalTests": [
        {
          "name": "Hemoglobin",
          "value": "11.2 g/dL",
          "reference": "13.0 - 17.0 g/dL",
          "status": "Low",
          "reason": "Anemia detected",
          "recommendation": "Increase iron-rich foods like spinach and consult a doctor."
        }
      ],
      "normalTests": [
        {
          "name": "WBC Count",
          "value": "7,500 /uL",
          "reference": "4,500 - 11,000 /uL"
        }
      ],
      "doctorAdvice": "General medical advice based on full report",
      "dietSuggestions": ["Dietary item 1", "Dietary item 2"]
    }
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
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }
}

export default new LabReportService();