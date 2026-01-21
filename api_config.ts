export const API_BASE = 'http://localhost:5000/api';

export const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text || `Error ${response.status}` };
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `Server Error: ${response.status}`);
  }

  return data;
};

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