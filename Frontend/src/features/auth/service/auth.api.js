import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true, // Include cookies in requests
});

// ✅ Har request mein token header mein bhejo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ email, username, password }) {
  const response = await api.post("/api/auth/register", {
    email,
    username,
    password,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", response.data.token);
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me");
  return response.data;
}

