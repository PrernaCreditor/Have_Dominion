import axios from "axios";

// Normalize API base to keep /api/v1 prefix when joining relative paths
const apiBase =
  (import.meta.env.VITE_API_BASE_URL || "https://universal-helpers-1.onrender.com/api/v1").replace(
    /\/$/,
    ""
  );

const api = axios.create({
  baseURL: `${apiBase}/`,
  withCredentials: true,
});

export default api;
