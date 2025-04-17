// api.js
const API_URL = process.env.REACT_APP_API_URL || '';
let accessToken = localStorage.getItem('access_token');
let refreshToken = localStorage.getItem('refresh_token');

export function setTokens(tokens) {
  if (tokens.access_token) {
    accessToken = tokens.access_token;
    localStorage.setItem('access_token', tokens.access_token);
  }
  
  if (tokens.refresh_token) {
    refreshToken = tokens.refresh_token;
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getTokenPayload() {
  if (!accessToken) return null;
  
  try {
    // Split token and get payload part (second part)
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[getTokenPayload] Error decoding token:', e);
    return null;
  }
}

export async function refreshAccessToken() {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/refresh-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const tokens = await response.json();
    setTokens(tokens);
    return tokens.access_token;
  } catch (error) {
    console.error('[refreshAccessToken] Error:', error);
    clearTokens();
    throw error;
  }
}

export async function fetchWithAuth(endpoint, options = {}) {
  console.log(`[fetchWithAuth] Sending request to ${endpoint}`);
  
  if (!accessToken) {
    console.error('[fetchWithAuth] No access token available');
    throw new Error('Not authenticated');
  }
  
  // Ensure headers exist
  options.headers = options.headers || {};
  
  // Add authorization header
  options.headers.Authorization = `Bearer ${accessToken}`;
  
  try {
    // Make the request
    const url = `${API_URL}${endpoint}`;
    console.log(`[fetchWithAuth] Sending request to ${url} with token ${accessToken}`);
    
    const response = await fetch(url, options);
    console.log(`[fetchWithAuth] Response status from ${endpoint}: ${response.status}`);
    
    // If token expired (401), try refreshing
    if (response.status === 401) {
      console.log('[fetchWithAuth] Token expired, refreshing...');
      try {
        const newToken = await refreshAccessToken();
        
        // Update authorization header with new token
        options.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the request
        console.log('[fetchWithAuth] Retrying with new token');
        return fetch(url, options);
      } catch (refreshError) {
        console.error('[fetchWithAuth] Failed to refresh token:', refreshError);
        clearTokens();
        throw new Error('Session expired. Please login again.');
      }
    }
    
    return response;
  } catch (error) {
    console.error('[fetchWithAuth] Error:', error);
    throw error;
  }
}