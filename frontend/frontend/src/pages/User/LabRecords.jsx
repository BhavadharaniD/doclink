import React from 'react';

const LabRecordsPage = () => {
  const records = [
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Lab Results & Records</h1>
      <p className="text-gray-600 mb-6">Access your diagnostic reports and test history</p>

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
            {records.map((record, idx) => (
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
    </div>
  );
};

export default LabRecordsPage;