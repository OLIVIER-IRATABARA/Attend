export const API_URL = import.meta.env.VITE_API_URL || "https://attend-02uf.onrender.com";

export const fetchWithAuth = (path, options = {}) =>
  fetch(`${API_URL}${path}`, { credentials: "include", ...options });

export const apiGet = (path) => fetchWithAuth(path).then((r) => r.json());
