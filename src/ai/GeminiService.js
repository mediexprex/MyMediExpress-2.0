import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key Missing");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

class GeminiService {
  async generate(prompt) {
    try {
      const result = await model.generateContent(prompt);

      const response = result.response;

      return {
        success: true,
        text: response.text(),
      };
    } catch (error) {
      console.error("Gemini Error:", error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async analyzeMedicine(ocrText) {
    const prompt = `
You are an AI medical assistant.

Analyze this medicine package text.

${ocrText}

Return ONLY valid JSON.

{
"name":"",
"generic_name":"",
"manufacturer":"",
"strength":"",
"dosage":"",
"uses":[],
"side_effects":[],
"warnings":[],
"storage":"",
"expiry":"",
"prescription_required":false
}
`;

    return await this.generate(prompt);
  }

  async analyzeSymptoms(symptoms) {
    const prompt = `
User Symptoms:

${symptoms}

Return JSON only.

{
"possible_conditions":[],
"urgency":"",
"home_care":[],
"doctor_visit":true,
"disclaimer":"AI provides health information only and does not replace a doctor."
}
`;

    return await this.generate(prompt);
  }

  async analyzeLabReport(reportText) {
    const prompt = `
Analyze this lab report.

${reportText}

Return JSON.

{
"summary":"",
"abnormal_values":[],
"suggestions":[],
"doctor_followup":true
}
`;

    return await this.generate(prompt);
  }

  async healthChat(message) {
    const prompt = `
You are MyMediExpress AI Health Companion.

Rules:

- Never diagnose diseases.
- Never replace doctors.
- Explain simply.
- Encourage professional medical advice.
- Reply in markdown.

User:

${message}
`;

    return await this.generate(prompt);
  }
}

export default new GeminiService();