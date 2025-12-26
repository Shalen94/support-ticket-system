import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const login = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);
export const forgotPassword = (email) =>
  API.post("/forgot-password", { email });
export const resetPassword = (data) =>
  API.post("/reset-password", data);

export const logout = () => API.post("/logout");
