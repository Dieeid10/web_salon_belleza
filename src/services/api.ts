import axios, { type AxiosRequestConfig } from "axios"
import { EnvConfig } from '@config/config'

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  code?: string | null
}

const env = EnvConfig()

export class SalonError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
  }
}

export const client = axios.create({
  baseURL: env.api_url,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

client.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => {
    if (axios.isCancel(error) || !axios.isAxiosError<ApiResponse>(error)) {
      return Promise.reject(error)
    }

    const response = error.response
    return Promise.reject(new SalonError(
      response?.data?.message ?? 'No pudimos completar la solicitud. Intentá de nuevo.',
      response?.status ?? 0,
      response?.data?.code ?? undefined
    ))
  }
)

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<ApiResponse<T>, ApiResponse<T>>(url, config),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    client.post<ApiResponse<T>, ApiResponse<T>, D>(url, data, config),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    client.put<ApiResponse<T>, ApiResponse<T>, D>(url, data, config),

  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    client.patch<ApiResponse<T>, ApiResponse<T>, D>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    client.delete<ApiResponse<T>, ApiResponse<T>>(url, config),
}