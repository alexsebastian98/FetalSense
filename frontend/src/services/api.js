const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(payload.detail ?? "Request failed");
  }

  return response.json();
}

export function createPregnancyLog(payload) {
  return request("/api/logs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchPregnancyLogs() {
  return request("/api/logs?limit=20");
}

export function fetchHistorySummary() {
  return request("/api/history/summary?limit=14");
}
