import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // We fail fast so connectivity issues are obvious in dev
  // (required later for Connected/Disconnected indicator)
  throw new Error("Missing VITE_API_BASE_URL in .env");

}

export type ApiError = {
  status: number | null;
  code: string;
  message: string;
  details?: unknown;
};

export function normalizeApiError(err: unknown): ApiError {
  // Axios error
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<any>;

    const status = axErr.response?.status ?? null;

    // Try common shapes from FastAPI / custom backends
    const data = axErr.response?.data;
    const message =
      (typeof data?.detail === "string" && data.detail) ||
      (typeof data?.message === "string" && data.message) ||
      axErr.message ||
      "Request failed";

    return {
      status,
      code: axErr.code ?? "AXIOS_ERROR",
      message,
      details: data,
    };
  }

  // Normal JS error
  if (err instanceof Error) {
    return {
      status: null,
      code: "ERROR",
      message: err.message,
      details: err,
    };
  }

  // Unknown
  return {
    status: null,
    code: "UNKNOWN_ERROR",
    message: "Unknown error",
    details: err,
  };
}

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: keep response handling consistent
apiClient.interceptors.response.use(
  (res) => res,
  (err: unknown) => Promise.reject(normalizeApiError(err))
);
