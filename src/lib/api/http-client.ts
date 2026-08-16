import axios from "axios";

import { getAuthToken } from "@/lib/auth/auth-storage";
import { getAppLanguage } from "@/lib/i18n/format";
import i18n from "@/lib/i18n";

const DEFAULT_API_BASE_URL = "https://web-production-7084b.up.railway.app";

export function resolveApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export const httpClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  const language = getAppLanguage(i18n.resolvedLanguage ?? i18n.language);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Accept-Language"] = language;

  return config;
});
