const BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = {
  async request(endpoint, options = {}) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = { ...options.headers };

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = { ...options, headers };

    try {
      const response = await fetch(`${BASE_URL}/api/${endpoint}`, config);

      if (response.status === 401 && !endpoint.includes("login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.href = "/login";
      }

      const newToken = response.headers.get("x-auth-token");
      if (newToken && typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },
};
