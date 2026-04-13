// src/components/BugForm.jsx
import { useState } from "react";
import axios from "axios";

export default function BugForm({ onBugAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title || !form.description) {
    setError("All fields are required!");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/bugs", {
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: "Open"
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    onBugAdded(); // refresh bug list
    setForm({ title: "", description: "", priority: "Low" });
    setError("");
  } catch (err) {
    console.error("Error submitting bug:", err);
    setError("Failed to submit bug.");
  }
};


  return (
    <div className="glass-panel" style={{maxWidth: '800px'}}>
      <form onSubmit={handleSubmit} style={{margin:'0', padding:'0', background:'transparent', boxShadow:'none', border:'none'}}>
        <h3 style={{marginTop:'0'}}>＋ Create Sprint Issue</h3>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Issue Title"
          required
        />
        <br />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Issue Description / Steps to reproduce"
          required
        />
        <br />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <br />
        <button type="submit">Deploy to Pipeline</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
