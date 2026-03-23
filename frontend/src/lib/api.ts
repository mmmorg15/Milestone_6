const missingApiUrlMessage =
  "Missing VITE_API_BASE_URL. Set it in frontend/.env for local development or in your deployment environment.";

export function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getApiBaseUrl(
  envValue = import.meta.env.VITE_API_BASE_URL,
  browserOrigin = typeof window !== "undefined" ? window.location.origin : undefined
) {
  let currentUrl: URL | null = null;

  if (typeof browserOrigin === "string" && browserOrigin.trim() !== "") {
    try {
      currentUrl = new URL(normalizeApiBaseUrl(browserOrigin));
    } catch {
      currentUrl = null;
    }
  }

  if (typeof envValue !== "string" || envValue.trim() === "") {
    if (currentUrl && !isLocalHostname(currentUrl.hostname)) {
      return normalizeApiBaseUrl(currentUrl.origin);
    }

    throw new Error(missingApiUrlMessage);
  }

  const normalizedEnvValue = normalizeApiBaseUrl(envValue);

  if (currentUrl) {
    try {
      const envUrl = new URL(normalizedEnvValue);

      // When the frontend and API are deployed on the same host, prefer the
      // current page origin so protocol/casing mismatches do not break requests.
      if (envUrl.host.toLowerCase() === currentUrl.host.toLowerCase()) {
        return normalizeApiBaseUrl(currentUrl.origin);
      }

      // If a production bundle was built with a localhost API URL, use the
      // current deployed origin instead of the viewer's local machine.
      if (!isLocalHostname(currentUrl.hostname) && isLocalHostname(envUrl.hostname)) {
        return normalizeApiBaseUrl(currentUrl.origin);
      }
    } catch {
      // Leave validation to the caller-facing error behavior below.
    }
  }

  return normalizedEnvValue;
}

export function buildApiUrl(
  path: string,
  envValue = import.meta.env.VITE_API_BASE_URL,
  browserOrigin = typeof window !== "undefined" ? window.location.origin : undefined
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl(envValue, browserOrigin)}${normalizedPath}`;
}

export { missingApiUrlMessage };
