const missingApiUrlMessage =
  "Missing VITE_API_BASE_URL. Set it in frontend/.env for local development or in your deployment environment.";

export function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getApiBaseUrl(envValue = import.meta.env.VITE_API_BASE_URL) {
  if (typeof envValue !== "string" || envValue.trim() === "") {
    throw new Error(missingApiUrlMessage);
  }

  return normalizeApiBaseUrl(envValue);
}

export function buildApiUrl(path: string, envValue = import.meta.env.VITE_API_BASE_URL) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl(envValue)}${normalizedPath}`;
}

export { missingApiUrlMessage };
