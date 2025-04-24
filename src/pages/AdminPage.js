import { useEffect, useState } from "react";
import AdminHeader from '../components/AdminHeader';
import { saveAs } from "file-saver";

function AdminPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(setEvents)
      .catch(err => console.error("Failed to fetch events:", err));
  }, []);

  const downloadReport = async (format) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/report?format=${format}`);

      if (!response.ok) throw new Error("Failed to download report");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `events_report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Error downloading the report.");
    }
  };
  
  return (
    <div className="flex flex-col items-center p-6">
      <div className="header">
        <AdminHeader />
      </div>
      <div className="header">
        <button 
          onClick={() => downloadReport("csv")} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Export CSV
        </button>
        <button 
          onClick={() => downloadReport("pdf")} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Export PDF
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
