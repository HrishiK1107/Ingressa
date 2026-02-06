import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Response interceptor (success pass-through)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Normalize error shape
    const normalizedError = {
      status: error.response?.status ?? 0,
      message:
        (error.response?.data as any)?.detail ||
        error.message ||
        "Unknown API error",
    };

    return Promise.reject(normalizedError);
  }
);

export { apiClient };
