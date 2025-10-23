import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Doctor/Sidebar";

const DoctorDashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labResults, setLabResults] = useState([]);

  // Dummy patient data
  useEffect(() => {
    const dummyPatients = [
      { _id: "1", name: "Sanjeevi", age: 40, condition: "Hypertension", lastVisit: "2025-10-10", status: "Active" },
      { _id: "2", name: "Bhavadarshan", age: 28, condition: "Diabetes", lastVisit: "2025-09-22", status: "Active" },
    ];
    setPatients(dummyPatients);
  }, []);

  // Filter patients based on search
  useEffect(() => {
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (p.condition && p.condition.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredPatients(filtered);
  }, [searchText, patients]);

  // Dummy prescriptions and lab results
  useEffect(() => {
    if (!selectedPatient) return;

    const dummyPrescriptions = [
      {
        _id: "rx1",
        instructions: "Take one tablet daily after breakfast",
        notes: "Monitor blood pressure weekly",
        medicines: [{ name: "Lisinopril 10mg" }],
      },
    ];

    const dummyLabResults = [
      {
        _id: "lab1",
        fileName: "CBC_Report.pdf",
        filePath: "#",
        remarks: "Normal range",
        uploadedAt: "2025-10-10",
      },
      {
        _id: "lab2",
        fileName: "Lipid_Profile.pdf",
        filePath: "#",
        remarks: "Elevated LDL",
        uploadedAt: "2025-09-30",
      },
    ];

    setPrescriptions(dummyPrescriptions);
    setLabResults(dummyLabResults);
  }, [selectedPatient]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col min-h-screen bg-gray-50 w-full">
        {/* Search + Dropdown */}
        <header className="bg-white shadow p-6 flex flex-col items-center gap-4">
          <div className="w-full max-w-3xl relative">
            <span className="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search patients by name or condition"
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {filteredPatients.length > 0 && (
            <select
              className="w-full max-w-3xl px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => {
                const selected = patients.find((p) => p._id === e.target.value);
                setSelectedPatient(selected || null);
              }}
              defaultValue=""
            >
              <option value="" disabled>Select a patient</option>
              {filteredPatients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} – {p.condition}
                </option>
              ))}
            </select>
          )}
        </header>

        {/* Patient Details */}
        <main className="flex-1 p-6">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow p-6">
              {/* Patient Info */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h2>
                  <p className="text-gray-600">Age: {selectedPatient.age || "-"}</p>
                  <p className="text-gray-600">Last Visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Prescriptions */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <span className="material-icons">medication</span>
                  Prescriptions
                </h3>
                {prescriptions.length > 0 ? (
                  prescriptions.map((p) => (
                    <div key={p._id} className="border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition">
                      <p><span className="font-semibold text-gray-700">Instructions:</span> {p.instructions}</p>
                      <p><span className="font-semibold text-gray-700">Notes:</span> {p.notes || "-"}</p>
                      <p><span className="font-semibold text-gray-700">Medicines:</span> {p.medicines.map((m) => m.name).join(", ")}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No prescriptions available.</p>
                )}
              </div>

              {/* Lab Results */}
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <span className="material-icons">science</span>
                  Lab Results
                </h3>
                {labResults.length > 0 ? (
                  labResults.map((lab) => (
                    <div key={lab._id} className="border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition">
                      <p>
                        <span className="font-semibold text-gray-700">File:</span>{" "}
                        <a href={lab.filePath} target="_blank" className="text-blue-600 underline hover:text-blue-800 transition">
                          {lab.fileName}
                        </a>
                      </p>
                      <p><span className="font-semibold text-gray-700">Remarks:</span> {lab.remarks}</p>
                      <p><span className="font-semibold text-gray-700">Uploaded At:</span> {new Date(lab.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No lab results available.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="material-icons text-6xl mb-4">info</span>
              <p className="text-lg text-center">Search and select a patient to view details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;