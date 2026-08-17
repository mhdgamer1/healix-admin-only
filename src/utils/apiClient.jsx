import i18n from "../i18n/i18n";

const BASE_URL =
  "https://unjuicy-schizogenous-gibson.ngrok-free.dev";

export async function apiFetch(endpoint, options = {}) {
  // Get token from browser localStorage
  const token = localStorage.getItem("token");

  // Check if body is FormData
  const isFormData =
    options.body instanceof FormData;

  const headers = {
    Accept: "application/json",

    "ngrok-skip-browser-warning": "true",

    "Accept-Language": i18n.language,

    // Don't set Content-Type manually for FormData
    ...(!isFormData && {
      "Content-Type": "application/json",
    }),

    // Add authentication token if available
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),

    // Allow custom headers to override defaults
    ...options.headers,
  };

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  return response;
}