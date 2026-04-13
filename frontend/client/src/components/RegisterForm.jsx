// src/components/RegisterForm.jsx
import { useState } from "react";
import axios from "axios";

export default function RegisterForm({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "Tester", // default role
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", form);
      setMessage(res.data.message);
      setError("");
      setForm({ username: "", password: "", role: "Tester" });

      // Call parent callback if provided
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Username already exists.");
      } else {
        setError("Registration failed.");
      }
    }
  };

  return (
    <div>
      <h3>Register New User</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Tester">Tester</option>
          <option value="Developer">Developer</option>
          <option value="Admin">Admin</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
