import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const MedicalRecordsPage = () => {
  const [activeTab, setActiveTab] = useState('prescriptions');

  const prescriptions = [
    {
      name: 'Lisinopril 10mg',
      dosage: '1 tablet',
      duration: '60 days',
      frequency: 'Daily',
      refills: 2,
      prescribedDate: 'Sept 25, 2023',
      doctor: 'Dr. Sarah Johnson',
    },
  ];

  const labResults = [
    {
      test: 'Complete Blood Count',
      date: 'Sept 20, 2023',
      doctor: 'Dr. Ravi Kumar',
      status: 'Available',
    },
    {
      test: 'Lipid Profile',
      date: 'Aug 10, 2023',
      doctor: 'Dr. Anjali Sharma',
      status: 'Available',
    },
  ];

  return (
    <div className='flex'>
        <Sidebar/>
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Prescriptions & Records</h1>
      <p className="text-gray-600 mb-6">Manage your medications and lab results</p>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === 'prescriptions'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === 'lab'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Lab Results
        </button>
      </div>

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((rx, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{rx.name}</h2>
              <ul className="text-gray-700 space-y-1 mb-4">
                <li><strong>Dosage:</strong> {rx.dosage}</li>
                <li><strong>Duration:</strong> {rx.duration}</li>
                <li><strong>Frequency:</strong> {rx.frequency}</li>
                <li><strong>Refills left:</strong> {rx.refills}</li>
                <li><strong>Prescribed date:</strong> {rx.prescribedDate}</li>
                <li><strong>Prescribed by:</strong> {rx.doctor}</li>
              </ul>
              <div className="flex space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Refill</button>
                <button className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lab Results Tab */}
      {activeTab === 'lab' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-3 text-left">Test</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Doctor</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {labResults.map((record, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">{record.test}</td>
                  <td className="p-3">{record.date}</td>
                  <td className="p-3">{record.doctor}</td>
                  <td className="p-3 text-green-600 font-semibold">{record.status}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:underline">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default MedicalRecordsPage;