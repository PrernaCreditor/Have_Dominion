import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "https://have-dominion.onrender.com";

const api = axios.create({
  baseURL: `${apiBase}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
