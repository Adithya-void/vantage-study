import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // ✅ HOOK AT TOP (IMPORTANT)

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token); // ✅ save token
      navigate("/dashboard"); // ✅ redirect properly
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.link}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    width: "300px",
    textAlign: "center",
    color: "white"
  },
  title: {
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "white",
    cursor: "pointer",
    marginTop: "10px"
  },
  link: {
    marginTop: "10px",
    fontSize: "14px"
  }
};

export default Login;