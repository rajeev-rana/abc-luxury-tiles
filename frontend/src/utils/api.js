const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function apiRequest(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('abc_token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong with the API request.');
  }

  return data;
}
