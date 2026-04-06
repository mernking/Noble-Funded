const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Token management helpers
const TOKEN_KEY = "noble_token";
const USER_KEY = "noble_user";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const api = {
  async request(endpoint: string, options: any = {}) {
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
      if (response.status === 401 && !endpoint.includes("login") && !endpoint.includes("register")) {
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
    } catch (error: any) {
      throw error;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint: string, body?: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint: string, body?: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  },
};

// Auth-specific methods
export const auth = {
  // Register new user
  async register({ fullName, email, password, phone }: any) {
    const response = await api.post("auth/register", { fullName, email, password, phone });
    if (response.data?.token && response.data?.user) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response;
  },

  // Login with email/password
  async login({ email, password }: any) {
    const response = await api.post("auth/login", { email, password });
    if (response.data?.token && response.data?.user) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response;
  },

  // Google OAuth - redirect to backend
  loginWithGoogle() {
    // Redirect to backend OAuth endpoint (which redirects to Google)
    window.location.href = `${BASE_URL}/api/dev/auth/google`;
  },

  // Get current user
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

  // Refresh token
  async refreshToken() {
    const response = await api.post("auth/refresh-token");
    if (response.data?.token) {
      setToken(response.data.token);
    }
    return response;
  },
};

// ============================================
// USER / PROFILE API METHODS
// ============================================
export const users = {
  // Get current user profile
  async getMe() {
    return api.get("users/me");
  },

  // Update user profile
  async updateMe({ fullName, phone, country }: { fullName?: string; phone?: string; country?: string }) {
    return api.put("users/me", { fullName, phone, country });
  },

  // Change password
  async changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
    return api.put("users/me/password", { currentPassword, newPassword });
  },
};

// ============================================
// CHALLENGES API METHODS
// ============================================
export const challenges = {
  // Get all challenges for current user
  async getAll() {
    return api.get("challenges");
  },

  // Get single challenge
  async getOne(id: string) {
    return api.get(`challenges/${id}`);
  },

  // Get challenge stats
  async getStats(id: string) {
    return api.get(`challenges/${id}/stats`);
  },

  // Get challenge config (pricing)
  async getConfig() {
    return api.get("challenges/config");
  },
};

// ============================================
// PAYOUTS API METHODS
// ============================================
export const payouts = {
  // Get all payouts
  async getAll() {
    return api.get("payouts");
  },

  // Get single payout
  async getOne(id: string) {
    return api.get(`payouts/${id}`);
  },

  // Request payout
  async request(data: {
    challengeId: string;
    amount: number;
    currency: string;
    payoutMethod: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    usdtAddress?: string;
  }) {
    return api.post("payouts/request", data);
  },
};

// ============================================
// SUPPORT API METHODS
// ============================================
export const support = {
  // Get all tickets
  async getTickets() {
    return api.get("support/tickets");
  },

  // Get single ticket
  async getTicket(id: string) {
    return api.get(`support/tickets/${id}`);
  },

  // Create ticket
  async createTicket({ subject, message }: { subject: string; message: string }) {
    return api.post("support/tickets", { subject, message });
  },

  // Reply to ticket
  async replyTicket(id: string, { message }: { message: string }) {
    return api.post(`support/tickets/${id}/reply`, { message });
  },
};

// ============================================
// LEADERBOARD API METHODS
// ============================================
export const leaderboard = {
  // Get user leaderboard
  async getAll(period: string = "monthly") {
    return api.get(`leaderboard?period=${period}`);
  },

  // Get user's own rank
  async getMyRank() {
    return api.get("leaderboard/me");
  },
};

// ============================================
// CERTIFICATES API METHODS
// ============================================
export const certificates = {
  // Get user's certificates
  async getAll() {
    return api.get("certificates");
  },

  // Get single certificate
  async getOne(id: string) {
    return api.get(`certificates/${id}`);
  },
};

// ============================================
// AFFILIATE API METHODS
// ============================================
export const affiliate = {
  // Get affiliate data
  async getData() {
    return api.get("affiliates/me");
  },

  // Get referral stats
  async getStats() {
    return api.get("affiliates/me/stats");
  },

  // Get referrals list
  async getReferrals() {
    return api.get("affiliates/me/referrals");
  },

  // Generate new referral code
  async generateCode() {
    return api.post("affiliates/me/code");
  },
};

export default api;
