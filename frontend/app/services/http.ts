import axios, { type InternalAxiosRequestConfig } from "axios";
import { isJwtExpired } from "../stores/auth/jwt";
import { useAuthStore } from "../stores/auth/useAuthStore";
import { ApiError, toApiError } from "./errors";

declare module "axios" {
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.requiresAuth) return config;

  const { token, payload, clearToken } = useAuthStore.getState();
  if (!token || isJwtExpired(payload)) {
    clearToken();
    return Promise.reject(new ApiError("Authentication required", { status: 401 }));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    if (apiError.status === 401) useAuthStore.getState().clearToken();
    return Promise.reject(apiError);
  },
);

export default http;
