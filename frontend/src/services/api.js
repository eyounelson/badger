const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not configured. Please add it to your .env file.');
}

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'Login failed',
      errors: data.errors || null,
    };
  }

  return data;
};

export const logout = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'Logout failed',
    };
  }

  return data;
};

export const getUserAchievements = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/achievements`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'Failed to fetch achievements',
    };
  }

  return data;
};