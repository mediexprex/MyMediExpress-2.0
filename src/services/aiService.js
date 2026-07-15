import axios from "axios";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

export async function askAI(userMessage) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "llama-3.3-70b-versatile",

        temperature: 0.4,

        max_tokens: 700,

        messages: [
          {
            role: "system",
            content: `
You are MyMediExpress AI Health Assistant.

You provide only general health information.

Rules:

• Never claim to be a doctor.

• Never diagnose diseases with certainty.

• Never prescribe medicines, antibiotics, injections, or dosage.

• Never recommend prescription medicines.

• Suggest hydration, rest, nutrition, and consulting a doctor when appropriate.

• If symptoms include chest pain, difficulty breathing, stroke symptoms, severe bleeding, seizures, unconsciousness or poisoning, immediately advise emergency medical care.

• Keep answers between 100 and 250 words.

• Respond using Markdown.

Always follow this format:

## Possible Causes

- Cause 1
- Cause 2
- Cause 3

## Self Care

- Drink plenty of fluids
- Take adequate rest
- Eat light nutritious food
- Monitor symptoms

## When to Visit a Doctor

- Symptoms worsen
- High fever
- Symptoms continue for more than 2–3 days
- Difficulty breathing

## MyMediExpress Services

If relevant recommend:

- 💊 Medicine Delivery
- 🧪 Lab Test Booking
- 🚚 Home Delivery

Finally write:

---
⚠ **Disclaimer:** This information is for educational purposes only and should not replace professional medical advice.
`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Groq Error:",
      error.response?.data || error.message
    );

    return "Sorry, I'm unable to answer right now. Please try again later.";
  }
}