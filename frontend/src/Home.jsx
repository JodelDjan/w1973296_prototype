import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, getAuthHeaders, APIError } from "./utils/api";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [researchers, setResearchers] = useState([]);
  const [error, setError] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
  const token = localStorage.getItem("access");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const data = await apiRequest("/accounts/me/", {
      headers: getAuthHeaders(),
    });
    setUser(data);
  } catch (err) {
    console.error("Failed to fetch user:", err);
    navigate("/login");
  }
}

    fetchUser();
  }, []);

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      const data = await apiRequest("/posts/feed/");
      setPosts(data);
    }
    fetchPosts();
  }, []);



  // Fetch researcher directory
  useEffect(() => {
    async function fetchResearchers() {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/researchers/");
      const data = await res.json();
      setResearchers(data);
    }
    fetchResearchers();
  }, []);

  // Close post
  async function closePost(postId) {
  if (!confirm("Are you sure you want to close this post?")) return;

  try {
    await apiRequest(`/posts/close/${postId}/`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    
    alert("Post closed successfully");
    window.location.reload();
  } catch (err) {
    if (err instanceof APIError) {
      alert(err.message || "Failed to close post");
    }
  }
}

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Welcome, {user.first_name}</h1>

      {/* Only researchers see this */}
      {user.role === "researcher" && (
        <button
          onClick={() => navigate("/create-post")}
          style={{ marginBottom: "1rem" }}
        >
          Make Post
        </button>
      )}

      <h2>Researcher Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "6px",
            }}
          >
            {/* CLOSED BANNER */}
            {post.state === "closed" && (
              <div
                style={{
                  backgroundColor: "#ffe5e5",
                  color: "#b30000",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                ! This post is closed
              </div>
            )}

            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <small>{new Date(post.created_at).toLocaleString()}</small>

            {/* Close button for the author */}
            {user.role === "researcher" &&
              post.author_id === user.id &&
              post.state === "open" && (
                <button
                  onClick={() => closePost(post.id)}
                  style={{ marginTop: "0.5rem" }}
                >
                  Close Post
                </button>
              )}
          </div>
        ))
      )}

      <h2>Researcher Directory</h2>
      {researchers.map((r, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "6px",
          }}
        >
          <strong>{r.name}</strong>
          <p>Research area: {r.research_area}</p>
          <p>Tags: {r.tags.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
