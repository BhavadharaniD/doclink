export const generatePrescriptionAI = async (diagnosis, age, allergies) => {
  const OpenAI = await import('openai');
  const openai = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Generate a JSON prescription for a ${age}-year-old with ${diagnosis}. Allergies: ${allergies || 'None'}. Include medicines, dosage, instructions, notes.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
