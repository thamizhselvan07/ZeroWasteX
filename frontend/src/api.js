import axios from "axios";

const storageKey = "zerowastex-auth";

export const getApiErrorMessage = (error, fallbackMessage) => {
  // Server returned an error response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Handle specific error codes
  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  // Network error or connection refused
  if (error.code === "ERR_NETWORK") {
    return "Network error. Please ensure the backend server is running on port 5000.";
  }

  // Connection refused
  if (error.code === "ECONNREFUSED" || error.message?.includes("ERR_CONNECTION_REFUSED")) {
    return "Cannot connect to the server. Please ensure it's running on port 5000.";
  }

  // Connection reset
  if (error.message?.includes("ERR_CONNECTION_RESET")) {
    return "Server connection lost. Please check if the backend is still running.";
  }

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const getStoredAuth = () => {
  const rawValue = localStorage.getItem(storageKey);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
};

export const persistAuth = (authPayload) => {
  localStorage.setItem(storageKey, JSON.stringify(authPayload));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(storageKey);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error types
    if (!error.response) {
      // Network error
      error.code = "ERR_NETWORK";
    }
    return Promise.reject(error);
  }
);

export default api;
