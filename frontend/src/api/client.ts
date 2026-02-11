import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject({
      message: error.response?.data?.detail || error.message,
      status: error.response?.status,
    });
  }
);
