/**
 * API Service for authentication-related functions
 */

// Base API URL - adjust this to match your API endpoint
const API_URL = '/api';

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object without password
 */
const register = async (username: string, email: string, password: string): Promise<object> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Registration failed');

  return data;
};

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object containing token and user
 */
const login = async (email: string, password: string): Promise<object> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Login failed');

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Get auth token from localStorage
 * @returns {string|null} JWT token or null if not logged in
 */
const getToken = () => localStorage.getItem('token');

/**
 * Logout user by removing auth data from localStorage
 */
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
const getUserProfile = async () => {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(`${API_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Failed to fetch user profile');

  return data;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
const isAuthenticated = () => !!getToken();

// Grouped export
export {
  register,
  login,
  getCurrentUser,
  getToken,
  logout,
  getUserProfile,
  isAuthenticated,
};
