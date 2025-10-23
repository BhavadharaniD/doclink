import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Doctor/Sidebar";

const CreatePrescription = () => {
  const [mode, setMode] = useState("manual");
  const [template, setTemplate] = useState("");
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [medications, setMedications] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // Simulated patient data (replace with actual props/context)
  const patient = {
    id: "abc123",
    name: "Sanjeevi",
    age: 25,
    allergies: "Penicillin",
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/prescriptions/templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAvailableTemplates(data.templates);
    };
    fetchTemplates();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleAIGenerate = async () => {
    try {
      setLoadingAI(true);
      const token = localStorage.getItem("token");

      const res = await fetch("/api/prescriptions/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diagnosis: template,
          age: patient.age,
          allergies: patient.allergies,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMedications(data.data.medicines || []);
        setInstructions(data.data.instructions || "");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI prescription");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSave = async () => {
    const isValid = medications.every(
      (med) => med.name && med.dosage && med.frequency
    );
    if (!isValid) {
      alert("Please fill all medication fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/prescriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: patient.id,
          medicines: medications,
          instructions,
          templateUsed: template,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Prescription saved!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save prescription");
    }
  };

  const handleSend = async () => {
    await handleSave();
    alert("Prescription sent to patient!");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-screen bg-gray-100 p-6 w-full">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
          <h1 className="text-2xl font-bold text-blue-700">Create Prescription</h1>
          <p className="text-gray-600">
            Patient: <span className="font-semibold">{patient.name}</span>
          </p>

          {/* Diagnosis Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Diagnosis</label>
            <input
              type="text"
              placeholder="e.g., Diabetes, Asthma"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mode Toggle */}
          <div className="mb-4 flex gap-4">
            <button
              onClick={() => setMode("manual")}
              className={`px-4 py-2 rounded ${mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setMode("ai")}
              className={`px-4 py-2 rounded ${mode === "ai" ? "bg-purple-600 text-white" : "bg-gray-300"}`}
            >
              AI Prescription
            </button>
          </div>

          {/* AI Mode Button */}
          {mode === "ai" && (
            <button
              onClick={handleAIGenerate}
              disabled={loadingAI}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition mb-4"
            >
              {loadingAI ? "Generating..." : "Generate with AI"}
            </button>
          )}

          {/* Medication Cards */}
          <div className="space-y-6">
            {medications.map((med, idx) => (
              <div key={idx} className="bg-gray-50 p-5 rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold text-blue-600 mb-3">{med.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <inputField label="Dosage" value={med.dosage} onChange={(val) => handleChange(idx, "dosage", val)} />
                  <inputField label="Frequency" value={med.frequency} onChange={(val) => handleChange(idx, "frequency", val)} />
                  <inputField label="Duration" value={med.duration} onChange={(val) => handleChange(idx, "duration", val)} />
                  <inputField label="Special Instructions" value={med.instructions} onChange={(val) => handleChange(idx, "instructions", val)} />
                </div>
              </div>
            ))}
          </div>

          {/* General Instructions */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">General Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Save Prescription
            </button>
            <button
              onClick={handleSend}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Send to Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable input field component
const inputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

export default CreatePrescription;