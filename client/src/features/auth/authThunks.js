import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';

/**
 * Initialize authentication session on app start by inspecting HttpOnly cookie
 */
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.fetchCurrentUser();
      return response.user;
    } catch (error) {
      // 401 simply means no active session; not an unexpected application error
      if (error.statusCode === 401) {
        return rejectWithValue(null);
      }
      return rejectWithValue(error.message || 'Failed to initialize session');
    }
  }
);

/**
 * Register with email and password
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.register({ name, email, password });
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Sign in with email and password
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password });
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Sign in into authorized demo account (client or admin)
 */
export const loginDemo = createAsyncThunk(
  'auth/loginDemo',
  async (role, { rejectWithValue }) => {
    try {
      const response = await authService.loginDemo(role);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Demo authentication failed');
    }
  }
);

/**
 * Authenticate with verified Google ID token
 */
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithGoogle(credential);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Google sign-in failed');
    }
  }
);

/**
 * Fetch fresh user profile from backend
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.fetchCurrentUser();
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

/**
 * Sign out user and clear HttpOnly cookie
 */
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    return true;
  } catch (error) {
    return rejectWithValue(error.message || 'Logout encountered an issue');
  }
});
