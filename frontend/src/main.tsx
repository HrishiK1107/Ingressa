import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";

/**
 * Global Query Client (LOCKED)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // cache rules
      staleTime: 30_000, // 30s
      gcTime: 5 * 60_000, // 5 min

      // UX rules
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,

      // retry only on server/network errors
      retry: (failureCount, error: any) => {
        const status = error?.status;
        if (status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
