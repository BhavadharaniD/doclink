import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="flex gap-6 border-b mb-4">
    <button
      className={`pb-2 ${activeTab === "pending" ? "border-b-2 border-yellow-500 text-yellow-600 font-semibold" : "text-gray-500"}`}
      onClick={() => setActiveTab("pending")}
    >
      <XCircleIcon className="h-5 w-5 inline mr-1" /> Pending Requests
    </button>
    <button
      className={`pb-2 ${activeTab === "confirmed" ? "border-b-2 border-green-500 text-green-600 font-semibold" : "text-gray-500"}`}
      onClick={() => setActiveTab("confirmed")}
    >
      <CheckCircleIcon className="h-5 w-5 inline mr-1" /> Upcoming Confirmed
    </button>
  </div>
);

export default Tabs;