import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TAG_OPTIONS = [
  "Health & Fitness",
  "Mental Health",
  "Medicine",
  "Wellbeing",
  "Education",
  "Public Health",
  "Nutrition",
  "Epidemiology",
  "Neuroscience",
  "Clinical Research",
  "Behavioural Science",
  "Health Policy",
  "Biomedical Science",
  "Genetics",
  "Immunology",
  "Environmental Health",
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "general",
    researchArea: "",
    bio: "",
    tags: [],
    ageRange: "",
    interests: [],
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // For researcher tags
  function toggleTag(tag) {
    setForm((prev) => {
      const selected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: selected
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      };
    });
  }

  // For general-user interests
  function toggleInterest(tag) {
    setForm((prev) => {
      const selected = prev.interests.includes(tag);
      return {
        ...prev,
        interests: selected
          ? prev.interests.filter((t) => t !== tag)
          : [...prev.interests, tag],
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role,
      researchArea: form.researchArea,
      bio: form.bio,
      tags: form.tags,
      ageRange: form.ageRange,
      interests: form.interests,
    };

    const res = await fetch("http://127.0.0.1:8000/api/accounts/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  }

  const isResearcher = form.role === "researcher";

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
      <h1>Create an Account</h1>

      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </label>

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

        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="general">General User</option>
            <option value="researcher">Researcher</option>
          </select>
        </label>

        {/* Researcher-only fields */}
        {isResearcher && (
          <>
            <label>
              Research Area
              <input
                type="text"
                name="researchArea"
                value={form.researchArea}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Bio
              <input
                type="text"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                required
              />
            </label>

            <div style={{ marginTop: "1rem" }}>
              <div>Select Tags (Researcher):</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {TAG_OPTIONS.map((tag) => {
                  const selected = form.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "999px",
                        border: selected
                          ? "1px solid #2563eb"
                          : "1px solid #ccc",
                        backgroundColor: selected ? "#2563eb" : "#f5f5f5",
                        color: selected ? "white" : "black",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* General-user-only fields */}
        {!isResearcher && (
          <>
            <label>
              Age Range
              <select
                name="ageRange"
                value={form.ageRange}
                onChange={handleChange}
                required
              >
                <option value="">Select age range</option>
                <option value="18-25">18–25</option>
                <option value="26-35">26–35</option>
                <option value="36-45">36–45</option>
                <option value="46-55">46–55</option>
                <option value="56-60">56–60</option>
              </select>
            </label>

            <div style={{ marginTop: "1rem" }}>
              <div>Select Interests:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {TAG_OPTIONS.map((tag) => {
                  const selected = form.interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "999px",
                        border: selected
                          ? "1px solid #2563eb"
                          : "1px solid #ccc",
                        backgroundColor: selected ? "#2563eb" : "#f5f5f5",
                        color: selected ? "white" : "black",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ marginTop: "1.5rem" }}>
          Register
        </button>
      </form>
    </div>
  );
}
