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


  const [bioError, setBioError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "bio") {
      if (value.length > 150) {
        setBioError("Bio must be 150 characters or less.");
        return;
      } else {
        setBioError("");
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleRoleChange(e) {
    const role = e.target.value;

    setForm((prev) => ({
      ...prev,
      role,
      ...(role !== "researcher"
        ? { researchArea: "", bio: "", tags: [] }
        : {}),
    }));
  }

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

async function handleSubmit(e) {
  e.preventDefault();

  const payload = {
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    password: form.password,
    role: form.role,
    researchArea: form.researchArea,
    bio: form.bio,
    tags: form.tags,
  };

  try {
    const res = await fetch("http://localhost:8000/api/accounts/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate("/login");
    } else {
      const data = await res.json();
      console.error("Registration error:", data);
      alert("Registration failed. Check console for details.");
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Network error. Try again later.");
  }
}


  const isResearcher = form.role === "researcher";

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <label>
          First name
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last name
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

        {/* Role selection */}
        <div style={{ marginTop: "1rem" }}>
          <span>Role: </span>

          <label>
            <input
              type="radio"
              name="role"
              value="general"
              checked={form.role === "general"}
              onChange={handleRoleChange}
            />
            General user
          </label>

          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              name="role"
              value="researcher"
              checked={form.role === "researcher"}
              onChange={handleRoleChange}
            />
            Researcher
          </label>
        </div>

        {/* Researcher-only fields */}
        {isResearcher && (
          <>
            <label style={{ marginTop: "1rem" }}>
              Research area
              <input
                type="text"
                name="researchArea"
                value={form.researchArea}
                onChange={handleChange}
                required={isResearcher}
              />
            </label>

            <label style={{ marginTop: "1rem" }}>
              Short bio (max 150 characters)
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                required={isResearcher}
              />
            </label>

            <div style={{ fontSize: "0.8rem" }}>
              {form.bio.length}/150 characters
            </div>

            {bioError && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {bioError}
              </div>
            )}

            <div style={{ marginTop: "1rem" }}>
              <div>Select your tags:</div>

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
        
        {form.role === "general" && (
  <>
    <label>
      Age range
      <select name="ageRange" value={form.ageRange} onChange={handleChange}>
        <option value="">Select age range</option>
        <option value="18-25">18–25</option>
        <option value="26-35">26–35</option>
        <option value="36-45">36–45</option>
        <option value="46-55">46–55</option>
        <option value="56-60">56–60</option>
      </select>
    </label>

    <div style={{ marginTop: "1rem" }}>
      <div>Select your interests:</div>
      {TAG_OPTIONS.map(tag => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleInterest(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  </>
)}


        <button type="submit" style={{ marginTop: "1.5rem" }}>
          Submit
        </button>
      </form>
    </div>
  );}
