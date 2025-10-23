import OpenAI from "openai";

export const generatePrescriptionAI = async (diagnosis, age, allergies) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
  Generate a strict JSON prescription for a ${age}-year-old patient diagnosed with ${diagnosis}.
  Allergies: ${allergies || "None"}.
  
  JSON Format Example:
  {
    "medicines": [
      { "name": "Paracetamol", "dosage": "500mg twice daily for 5 days" },
      { "name": "Vitamin C", "dosage": "1000mg daily" }
    ],
    "instructions": "Drink plenty of water and rest.",
    "notes": "Avoid spicy food if fever persists."
  }
  Ensure the output is valid JSON only (no extra text).
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const rawOutput = response.choices[0].message.content.trim();

  // ✅ Validate JSON format
  try {
    const parsed = JSON.parse(rawOutput);
    return JSON.stringify(parsed); // clean JSON output for controller
  } catch (error) {
    console.error("Invalid AI output:", rawOutput);
    throw new Error("AI did not return valid JSON");
  }
};
