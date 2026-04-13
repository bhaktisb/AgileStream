import { useState } from "react";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleBugAdded = () => {
    setRefresh((prev) => !prev); // Trigger re-fetch
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>🪲 AgileStream: Issue Manager</h1>

      {isLoggedIn ? (
        <>
          <button onClick={logout} style={{ marginBottom: "1rem" }}>
            🔓 Logout
          </button>
          <Dashboard />
          <BugForm onBugAdded={handleBugAdded} />
          <BugList refresh={refresh} />
        </>
      ) : (
        <>
          {showRegister ? (
            <RegisterForm onRegisterSuccess={() => setShowRegister(false)} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}

          <button
            onClick={() => setShowRegister(!showRegister)}
            style={{ marginTop: "1rem" }}
          >
            {showRegister ? "🔑 Go to Login" : "🆕 Create New Account"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
