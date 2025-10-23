import axios from "axios";

export const generateAIPrescription = async (diagnosis, age, allergies, token) => {
  try {
    const response = await axios.post(
      "/prescriptions/ai/generate",
      { diagnosis, age, allergies },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("AI Prescription Error:", error);
    throw error.response?.data || { message: "Failed to generate prescription" };
  }
};
