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

export default function CreatePost() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    body: "",
    start_date: "",
    max_participants: "",
    tags: [],
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    setError("");

    const token = localStorage.getItem("access");

    const res = await fetch("http://127.0.0.1:8000/api/posts/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create post");
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1>Create Research Post</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Body
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            rows={5}
            required
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Max Participants
          <input
            type="number"
            name="max_participants"
            value={form.max_participants}
            onChange={handleChange}
            required
          />
        </label>

        <div style={{ marginTop: "1rem" }}>
          <div>Select Tags:</div>
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
                    border: selected ? "1px solid #2563eb" : "1px solid #ccc",
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ marginTop: "1.5rem" }}>
          Post
        </button>
      </form>
    </div>
  );
}
