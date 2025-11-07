// src/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

let csrfToken: string | null = null;
let csrfInitPromise: Promise<void> | null = null;

async function ensureCsrf() {
  if (csrfToken) return;
  if (!csrfInitPromise) {
    csrfInitPromise = api.get("/api/auth/csrf-token").then(res => {
      csrfToken = res.data?.csrfToken;
      if (csrfToken) api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    }).finally(() => { csrfInitPromise = null; });
  }
  return csrfInitPromise;
}

// Optional 401 handler for admin routes
api.interceptors.response.use(
  r => r,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      // Redirect to login for protected pages
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

// Generic helpers
export async function GET<T>(url: string, config?: AxiosRequestConfig) {
  const res = await api.get<T>(url, config);
  return res.data;
}
export async function POST<T>(url: string, data?: any, config?: AxiosRequestConfig) {
  await ensureCsrf();
  const res = await api.post<T>(url, data, config);
  return res.data;
}
export async function PUT<T>(url: string, data?: any, config?: AxiosRequestConfig) {
  await ensureCsrf();
  const res = await api.put<T>(url, data, config);
  return res.data;
}
export async function PUT_FORM<T>(url: string, form: FormData, config?: AxiosRequestConfig) {
  await ensureCsrf();
  const res = await api.put<T>(url, form, {
    ...config,
    headers: { ...(config?.headers || {}), "Content-Type": "multipart/form-data" }
  });
  return res.data;
}
export async function DELETE_<T>(url: string, config?: AxiosRequestConfig) {
  await ensureCsrf();
  const res = await api.delete<T>(url, config);
  return res.data;
}
export async function POST_FORM<T>(url: string, form: FormData, config?: AxiosRequestConfig) {
  await ensureCsrf();
  const res = await api.post<T>(url, form, {
    ...config,
    headers: { ...(config?.headers || {}), "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

// API groups (optional convenience)
export const AuthAPI = {
  login: (body: { username?: string; email?: string; password: string }) =>
    POST<{ id: string; username: string; role: string }>("/api/auth/login", body),
  me: () => GET<{ id: string; username: string; role: string }>("/api/auth/me"),
  logout: () => POST<void>("/api/auth/logout", {})
};

export const PublicAPI = {
  gallery: () => GET<any[]>("/api/public/gallery"),
  homeImages: (section?: "hero" | "property" | "testimonial") =>
    GET<any[]>("/api/public/home-images", { params: section ? { section } : undefined }),
  contact: (payload: { name: string; email: string; phone: string; message: string }) =>
    POST("/api/public/contact", payload)
};

export const AdminAPI = {
  gallery: {
    list: () => GET<any[]>("/api/admin/gallery"),
    create: (payload: { url?: string; alt: string; order?: number } | FormData) =>
      payload instanceof FormData
        ? POST_FORM<any>("/api/admin/gallery", payload)
        : POST<any>("/api/admin/gallery", payload),
    update: (id: string, payload: any) =>
      payload instanceof FormData
        ? PUT_FORM<any>(`/api/admin/gallery/${id}`, payload)
        : PUT<any>(`/api/admin/gallery/${id}`, payload),
    remove: (id: string) => DELETE_<void>(`/api/admin/gallery/${id}`)
  },
  home: {
    list: (section?: string) => GET<any[]>("/api/admin/home-images", { params: section ? { section } : undefined }),
    create: (payload: { url?: string; alt: string; section?: "hero" | "property" | "testimonial"; order?: number; [key: string]: any } | FormData) =>
      payload instanceof FormData
        ? POST_FORM<any>("/api/admin/home-images", payload)
        : POST<any>("/api/admin/home-images", payload),
    update: (id: string, payload: any) =>
      payload instanceof FormData
        ? PUT_FORM<any>(`/api/admin/home-images/${id}`, payload)
        : PUT<any>(`/api/admin/home-images/${id}`, payload),
    remove: (id: string) => DELETE_<void>(`/api/admin/home-images/${id}`)
  }
};

export default api;