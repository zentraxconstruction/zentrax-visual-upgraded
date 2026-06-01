/**
 * API Client — Centralized HTTP client with authentication
 */

const API_BASE_URL = "http://localhost:5000/api";

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Get token from localStorage
   */
  getToken() {
    return localStorage.getItem("zx_token") || null;
  }

  /**
   * Build headers with auth token
   */
  getHeaders(customHeaders = {}) {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { "x-auth-token": token }),
      ...customHeaders,
    };
  }

  /**
   * Handle response and error
   */
  async handleResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, message: text || response.statusText };
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    if (!data.success && data.message) {
      throw new Error(data.message);
    }

    return data;
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(options.headers),
      ...options,
    });
    return this.handleResponse(response);
  }

  /**
   * POST request
   */
  async post(endpoint, body, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(body),
      ...options,
    });
    return this.handleResponse(response);
  }

  /**
   * PUT request
   */
  async put(endpoint, body, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(body),
      ...options,
    });
    return this.handleResponse(response);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(options.headers),
      ...options,
    });
    return this.handleResponse(response);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, body, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(body),
      ...options,
    });
    return this.handleResponse(response);
  }
}

// Export singleton instance
export default new ApiClient(API_BASE_URL);

/**
 * Usage Examples:
 *
 * import api from "@/utils/api";
 *
 * // GET
 * const data = await api.get("/auth/me");
 *
 * // POST
 * const result = await api.post("/auth/login", { email, password });
 *
 * // PUT
 * const updated = await api.put("/projects/123", { name: "New Name" });
 *
 * // DELETE
 * await api.delete("/projects/123");
 */
