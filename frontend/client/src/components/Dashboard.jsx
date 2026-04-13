// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Dashboard() {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bugs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setBugs(res.data))
      .catch((err) => console.error("Error fetching bugs:", err));
  }, []);

  const handleAutoAssign = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/bugs/auto-assign", {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
      alert(res.data.message);
      window.location.reload(); // Refresh the page to show states visually instantly
    } catch(err) {
      alert("Failed to auto-assign.");
    }
  }

  // Count by priority
  const priorities = { Low: 0, Medium: 0, High: 0 };
  const statuses = { Open: 0, "In Progress": 0, Resolved: 0 };

  bugs.forEach((bug) => {
    if(priorities[bug.priority] !== undefined) priorities[bug.priority]++;
    if(statuses[bug.status] !== undefined) statuses[bug.status]++;
  });

  const pieData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Bug Priority",
        data: [priorities.Low, priorities.Medium, priorities.High],
        backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"], // Modern colors matching CSS
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["Open", "In Progress", "Resolved"],
    datasets: [
      {
        label: "Bug Status Count",
        data: [statuses.Open, statuses["In Progress"], statuses.Resolved],
        backgroundColor: ["#ef4444", "#818cf8", "#10b981"],
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { labels: { color: "#cbd5e1" } }
    },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.1)" } }
    }
  };

  return (
    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
      
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", maxWidth: "800px" }}>
        <h3 style={{margin: "0"}}>📊 Engineering Velocity Dashboard</h3>
        <button onClick={handleAutoAssign} style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)', width: 'auto', margin: '0' }}>
          ⚡ Auto-Assign Ticket (DSA Engine)
        </button>
      </div>

      <div className="glass-panel" style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "space-around", marginTop: "1rem" }}>
        <div style={{ width: "300px" }}>
          <Pie data={pieData} options={{plugins: { legend: { labels: { color: "#cbd5e1" } } }}} />
        </div>
        <div style={{ width: "400px" }}>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
