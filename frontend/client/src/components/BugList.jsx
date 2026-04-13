// src/components/BugList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function BugList({ refresh }) {
  const [bugs, setBugs] = useState([]);

  const fetchBugs = () => {
    axios
      .get("http://localhost:5000/api/bugs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setBugs(res.data))
      .catch((err) => console.error("Failed to fetch bugs", err));
  };

  useEffect(() => {
    fetchBugs();
  }, [refresh]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bugs/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBugs();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const onDragStart = (e, bugId) => {
    e.dataTransfer.setData("bugId", bugId);
  };

  const onDrop = (e, stage) => {
    e.preventDefault();
    const bugId = e.dataTransfer.getData("bugId");
    if(bugId) {
       handleStatusChange(bugId, stage);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const renderColumn = (title, stage) => {
    const stageBugs = bugs.filter((b) => b.status === stage);
    return (
      <div 
        className="kanban-column"
        onDrop={(e) => onDrop(e, stage)}
        onDragOver={onDragOver}
      >
        <h4>{title} ({stageBugs.length})</h4>
        {stageBugs.map((bug) => (
          <div 
            key={bug.id} 
            className={`kanban-card priority-${bug.priority.toLowerCase()}`}
            draggable
            onDragStart={(e) => onDragStart(e, bug.id)}
          >
            <h5>{bug.title}</h5>
            <p>{bug.description}</p>
            <div className="meta">
              <span>{new Date(bug.createdAt || bug.created_at).toLocaleDateString()}</span>
              {bug.assignee && <span style={{color: '#818cf8', fontWeight:'bold'}}>👤 {bug.assignee}</span>}
            </div>
            {/* Status Dropdown fallback for non-draggers */}
            <select
                value={bug.status}
                onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                style={{marginTop: '10px', fontSize: '0.8em', padding: '4px', background:'rgba(255,255,255,0.1)'}}
            >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{width: '100%'}}>
      <h3 style={{marginTop: '30px'}}>📋 Agile Sprint Board</h3>
      <p style={{textAlign:'center', color: '#94a3b8'}}>Drag and drop tickets across the pipeline to automatically update their assignment status.</p>
      <div className="kanban-board">
        {renderColumn("Open", "Open")}
        {renderColumn("In Progress", "In Progress")}
        {renderColumn("Resolved", "Resolved")}
      </div>
    </div>
  );
}
