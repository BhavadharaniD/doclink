import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const billingStats = [
    { label: 'Total Pending', value: '₹7,200', sub: 'Overdue items - 1', color: 'text-red-600' },
    { label: 'Paid This Year', value: '₹10,500', sub: '4 payments completed', color: 'text-green-600' },
    { label: 'Total Invoices', value: '7', sub: 'Across all periods', color: 'text-blue-600' },
  ];

  const pendingBills = [
    {
      doctor: 'Dr. Anjali Sharma',
      service: 'General Consultation',
      amount: 1500,
      dueDate: '05 Oct 2023',
      invoiceId: 'INV-0015',
      status: 'Overdue',
    },
  ];

  const paymentHistory = [
    {
      doctor: 'Dr. Ravi Kumar',
      service: 'Blood Test',
      amount: 1200,
      date: '12 Sep 2023',
      invoiceId: 'INV-0012',
      status: 'Paid',
    },
  ];

  return (
    <div className='flex'>
        <Sidebar/>
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Billing and Payments</h1>
      <p className="text-gray-600 mb-6">Manage your DocLink bills and payment history</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {billingStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow">
            <h2 className={`text-xl font-bold ${stat.color}`}>{stat.value}</h2>
            <p className="text-gray-700">{stat.label}</p>
            <p className="text-sm text-gray-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-t-md font-medium ${
            activeTab === 'pending' ? 'bg-white text-blue-600 shadow' : 'bg-gray-200 text-gray-600'
          }`}
        >
          Pending Bills
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-t-md font-medium ${
            activeTab === 'history' ? 'bg-white text-blue-600 shadow' : 'bg-gray-200 text-gray-600'
          }`}
        >
          Payment History
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-b-lg shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Amount (₹)</th>
              <th className="p-3 text-left">{activeTab === 'pending' ? 'Due Date' : 'Date'}</th>
              <th className="p-3 text-left">Invoice ID</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'pending' ? pendingBills : paymentHistory).map((bill, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{bill.doctor}</td>
                <td className="p-3">{bill.service}</td>
                <td className="p-3">{bill.amount}</td>
                <td className="p-3">{activeTab === 'pending' ? bill.dueDate : bill.date}</td>
                <td className="p-3">{bill.invoiceId}</td>
                <td
                  className={`p-3 font-semibold ${
                    bill.status === 'Paid' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {bill.status}
                </td>
                <td className="p-3">
                  {activeTab === 'pending' ? (
                    <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">
                      Pay Now
                    </button>
                  ) : (
                    <button className="text-blue-600 hover:underline">Download</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default BillingPage;