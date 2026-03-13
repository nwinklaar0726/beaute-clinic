/**
 * TanStack Query API Client
 * Centralized API configuration with error handling
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class ApiClientError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

export async function apiClient<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (isJson) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      }
      
      throw new ApiClientError(errorMessage, response.status);
    }

    // Handle empty responses
    if (response.status === 204) {
      return undefined as T;
    }

    if (isJson) {
      return await response.json();
    }
    
    return await response.text() as T;
    
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiClientError('Network error. Please check your connection.');
    }
    
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

// HTTP methods helpers
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  patch: <T>(endpoint: string, data: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
