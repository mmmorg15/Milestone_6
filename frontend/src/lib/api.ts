const missingApiUrlMessage =
  "Missing VITE_API_BASE_URL. Set it in frontend/.env for local development or in your deployment environment.";

export function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getApiBaseUrl(envValue = import.meta.env.VITE_API_BASE_URL) {
  if (typeof envValue !== "string" || envValue.trim() === "") {
    throw new Error(missingApiUrlMessage);
  }

  const normalizedEnvValue = normalizeApiBaseUrl(envValue);

  if (typeof window !== "undefined") {
    try {
      const envUrl = new URL(normalizedEnvValue);
      const currentUrl = new URL(window.location.origin);

      // When the frontend and API are deployed on the same host, prefer the
      // current page origin so protocol/casing mismatches do not break requests.
      if (envUrl.host.toLowerCase() === currentUrl.host.toLowerCase()) {
        return normalizeApiBaseUrl(window.location.origin);
      }
    } catch {
      // Leave validation to the caller-facing error behavior below.
    }
  }

  return normalizedEnvValue;
}

export function buildApiUrl(path: string, envValue = import.meta.env.VITE_API_BASE_URL) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl(envValue)}${normalizedPath}`;
}

export { missingApiUrlMessage };
