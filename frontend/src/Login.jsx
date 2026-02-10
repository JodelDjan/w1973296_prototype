import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT tokens
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // Redirect based on role
        const userRole = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
          headers: { Authorization: `Bearer ${data.access}` },
        }).then((r) => r.json());

        if (userRole.role === "researcher") {
          navigate("/researcher-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ marginTop: "1rem" }}>
          Login
        </button>
      </form>
    </div>
  );
}
