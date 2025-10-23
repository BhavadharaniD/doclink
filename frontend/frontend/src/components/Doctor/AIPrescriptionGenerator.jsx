import React, { useState } from "react";
import { generateAIPrescription } from "../api/prescriptionApi";

const AIPrescriptionGenerator = ({ token }) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await generateAIPrescription(diagnosis, age, allergies, token);
      setResult(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">🧠 AI Prescription Generator</h2>
      
      <input
        type="text"
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Allergies (optional)"
        value={allergies}
        onChange={(e) => setAllergies(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Generating..." : "Generate Prescription"}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h3 className="font-semibold mb-2">AI Generated Prescription</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AIPrescriptionGenerator;
