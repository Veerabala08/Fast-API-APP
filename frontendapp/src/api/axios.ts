import axios from "axios";
import { BASE_URL } from "./endpoints";

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Intercept every request and attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
