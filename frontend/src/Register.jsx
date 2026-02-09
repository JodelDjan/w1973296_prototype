import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "general", // default
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      navigate("/login"); // redirect after successful registration
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Create an Account</h2>

      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>User Type</label>
        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="researcher"
              checked={form.role === "researcher"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            Researcher
          </label>

          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              name="role"
              value="general"
              checked={form.role === "general"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            General User
          </label>
        </div>

        <button type="submit" style={{ marginTop: "20px" }}>
          Register
        </button>
      </form>
    </div>
  );
}
