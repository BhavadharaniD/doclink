import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const PatientPage = () => {
  const doctorId = localStorage.getItem('userId');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('cholesterol');

  // Fetch all active patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/doctor/${doctorId}/active`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('doclinkToken')}` } }
        );

        const patientsArray = Array.isArray(data) ? data : data.patients || [];

        const options = patientsArray.map(p => ({
          value: p._id,
          label: p.name,
        }));

        setPatients(options);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [doctorId]);

  // Fetch prescriptions & lab results when patient is selected
  useEffect(() => {
    if (!selectedPatient) return;

    const fetchPatientData = async () => {
      try {
        const [prescRes, labRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/patient/${selectedPatient.value}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('doclinkToken')}` }
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/labresults/patient/${selectedPatient.value}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('doclinkToken')}` }
          })
        ]);

        setPrescriptions(Array.isArray(prescRes.data) ? prescRes.data : []);
        const labArray = Array.isArray(labRes.data) ? labRes.data : labRes.data.labResults || [];
        setLabResults(labArray);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setPrescriptions([]);
        setLabResults([]);
      }
    };

    fetchPatientData();
  }, [selectedPatient]);

  // Prepare chart data
  const chartData = {
    labels: Array.isArray(labResults)
      ? labResults.map(lr => new Date(lr.uploadedAt).toLocaleDateString())
      : [],
    datasets: [
      {
        label: selectedMetric,
        data: Array.isArray(labResults)
          ? labResults.map(lr => {
              try {
                const parsed = JSON.parse(lr.remarks);
                return parsed[selectedMetric] || 0;
              } catch {
                return 0;
              }
            })
          : [],
        fill: false,
        borderColor: 'blue',
        tension: 0.2,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      {/* Left Panel */}
      <div style={{ flex: 1 }}>
        <h2>Select Patient</h2>
        <Select
          options={patients}
          value={selectedPatient}
          onChange={setSelectedPatient}
          placeholder="Search or select patient..."
        />

        {selectedPatient && prescriptions.length > 0 && (
          <>
            <h3 style={{ marginTop: '20px' }}>Prescriptions</h3>
            <ul>
              {prescriptions.map(p => (
                <li key={p._id} style={{ marginBottom: '10px' }}>
                  <strong>{new Date(p.createdAt).toLocaleDateString()}</strong>: {p.instructions}
                  <br />
                  <em>{p.notes}</em>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1 }}>
        {selectedPatient && labResults.length > 0 && (
          <>
            <h3>Lab Results Trend</h3>
            <label>Select Metric: </label>
            <select
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value)}
              style={{ marginBottom: '10px' }}
            >
              <option value="cholesterol">Cholesterol</option>
              <option value="bloodSugar">Blood Sugar</option>
              <option value="hemoglobin">Hemoglobin</option>
              <option value="bpSystolic">BP Systolic</option>
              <option value="bpDiastolic">BP Diastolic</option>
            </select>

            <Line data={chartData} />
          </>
        )}
        {selectedPatient && labResults.length === 0 && <p>No lab results available for this patient.</p>}
      </div>
    </div>
  );
};

export default PatientPage;
