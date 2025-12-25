
// The Vite proxy is configured to catch any request starting with /api/
export const API_BASE = '/api';

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown server error occurred' }));
    throw new Error(error.message || `Server Error: ${response.status}`);
  }
  return response.json();
};

export const getHeaders = () => {
  const token = localStorage.getItem('his_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
