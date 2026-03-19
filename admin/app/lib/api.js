const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Token management helpers
const TOKEN_KEY = "noble_admin_token";
const USER_KEY = "noble_admin_user";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const api = {
  async request(endpoint, options = {}) {
    const token = getToken();
    const headers = { ...options.headers };

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = { ...options, headers };

    try {
      const response = await fetch(`${BASE_URL}/api/dev/${endpoint}`, config);

      // Handle 401 - token expired or invalid
      if (response.status === 401 && !endpoint.includes("login")) {
        clearAuth();
        // Redirect to login if not already there
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired";
        }
        throw new Error("Session expired. Please log in again.");
      }

      // Handle new token in headers
      const newToken = response.headers.get("x-auth-token");
      if (newToken) {
        setToken(newToken);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || "Something went wrong");
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

// Auth-specific methods for admin
export const auth = {
  // Login with email/password
  async login({ email, password }) {
    const response = await api.post("auth/login", { email, password });
    if (response.data?.token && response.data?.user) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response;
  },

  // Get current admin user
  async getCurrentUser() {
    const response = await api.get("auth/me");
    if (response.data) {
      setUser(response.data);
    }
    return response;
  },

  // Logout
  async logout() {
    try {
      await api.post("auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!getToken();
  },

  // Get current user from local storage
  getUser() {
    return getUser();
  },

  // Check if user has required role
  hasRole(...roles) {
    const user = getUser();
    return user && roles.includes(user.role);
  },

  // Check if user is admin
  isAdmin() {
    return auth.hasRole("super_admin", "compliance", "support");
  },

  // Refresh token
  async refreshToken() {
    const response = await api.post("auth/refresh-token");
    if (response.data?.token) {
      setToken(response.data.token);
    }
    return response;
  },
};

export default api;
