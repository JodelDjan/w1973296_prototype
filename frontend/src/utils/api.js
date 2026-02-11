const API_BASE_URL = (import.meta.env.VITE_API_URL ||"https://w1973296-prototype.onrender.com/api"
).replace(/\/$/, '');

export class APIError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("API Request URL:", url);

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || "Request failed",
        response.status,
        data.details || {}
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network errors
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new APIError(
        "Cannot connect to server. Please check your connection.",
        0,
        { original: error.message }
      );
    }
    
    throw new APIError("An unexpected error occurred", 500, { original: error.message });
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}