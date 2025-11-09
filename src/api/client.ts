// src/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // crucial for CSRF cookies
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

let csrfToken: string | null = null;
let csrfInitPromise: Promise<void> | null = null;

/**
 * Ensure CSRF token is fetched and attached to headers
 */
async function ensureCsrf() {
  if (csrfToken) return;
  if (!csrfInitPromise) {
    csrfInitPromise = api
      .get("/api/auth/csrf-token") // fetch token + set cookie
      .then((res) => {
        csrfToken = res.data?.csrfToken;
        if (csrfToken) {
          api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
        }
      })
      .finally(() => {
        csrfInitPromise = null;
      });
  }
  return csrfInitPromise;
}

// Axios request interceptor: attach CSRF to all state-changing requests
api.interceptors.request.use(async (config) => {
  if (!config.method?.match(/get/i)) {
    await ensureCsrf();
    if (csrfToken && config.headers) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }
  return config;
});

// Axios response interceptor: optional 401 handling
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 && window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin"; // redirect to admin login
    }
    return Promise.reject(error);
  }
);

// Generic helpers
async function GET<T>(url: string, config?: AxiosRequestConfig) {
  const res = await api.get<T>(url, config);
  return res.data;
}
async function POST<T>(url: string, data?: any, config?: AxiosRequestConfig) {
  const res = await api.post<T>(url, data, config);
  return res.data;
}
async function PUT<T>(url: string, data?: any, config?: AxiosRequestConfig) {
  const res = await api.put<T>(url, data, config);
  return res.data;
}
async function DELETE_<T>(url: string, config?: AxiosRequestConfig) {
  const res = await api.delete<T>(url, config);
  return res.data;
}
async function POST_FORM<T>(url: string, form: FormData, config?: AxiosRequestConfig) {
  const res = await api.post<T>(url, form, {
    ...config,
    headers: { ...(config?.headers || {}), "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
async function PUT_FORM<T>(url: string, form: FormData, config?: AxiosRequestConfig) {
  const res = await api.put<T>(url, form, {
    ...config,
    headers: { ...(config?.headers || {}), "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// API groups
export const AuthAPI = {
  login: (body: { username?: string; email?: string; password?: string }) =>
    POST<{ id: string; username: string; role: string }>("/api/auth/login", body),
  me: () => GET<{ id: string; username: string; role: string }>("/api/auth/me"),
  logout: () => POST<void>("/api/auth/logout", {}),
};

export const PublicAPI = {
  gallery: () => GET<any[]>("/api/public/gallery"),
  homeImages: (section?: "hero" | "property" | "testimonial") =>
    GET<any[]>("/api/public/home-images", { params: section ? { section } : undefined }),
  contact: (payload: { name: string; email: string; phone: string; message: string }) =>
    POST("/api/public/contact", payload),
};

export const AdminAPI = {
  gallery: {
    list: () => GET<any[]>("/api/admin/gallery"),
    create: (payload: { url?: string; alt: string; order?: number } | FormData) =>
      payload instanceof FormData ? POST_FORM<any>("/api/admin/gallery", payload) : POST<any>("/api/admin/gallery", payload),
    update: (id: string, payload: any) =>
      payload instanceof FormData ? PUT_FORM<any>(`/api/admin/gallery/${id}`, payload) : PUT<any>(`/api/admin/gallery/${id}`, payload),
    remove: (id: string) => DELETE_<void>(`/api/admin/gallery/${id}`),
  },
  home: {
    list: (section?: string) => GET<any[]>("/api/admin/home-images", { params: section ? { section } : undefined }),
    create: (payload: { url?: string; alt: string; section?: string; order?: number; [key: string]: any } | FormData) =>
      payload instanceof FormData ? POST_FORM<any>("/api/admin/home-images", payload) : POST<any>("/api/admin/home-images", payload),
    update: (id: string, payload: any) =>
      payload instanceof FormData ? PUT_FORM<any>(`/api/admin/home-images/${id}`, payload) : PUT<any>(`/api/admin/home-images/${id}`, payload),
    remove: (id: string) => DELETE_<void>(`/api/admin/home-images/${id}`),
  },
};

export default api;
