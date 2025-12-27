// The Vite proxy is configured to catch any request starting with /api/
export const API_BASE = '/api';

/**
 * Enhanced response handler with robust error catching
 */
export const handleResponse = async (response: Response) => {
  let data;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || `Error ${response.status}: ${response.statusText}` };
    }
  } catch (e) {
    data = { message: "Failed to parse server response" };
  }

  if (!response.ok) {
    const errorMsg = data.message || data.error || `Server returned status ${response.status}`;
    throw new Error(errorMsg);
  }
  
  return data;
};

/**
 * Standardized header generation for authenticated requests
 */
export const getHeaders = () => {
  const token = localStorage.getItem('his_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};