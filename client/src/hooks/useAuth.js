import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.js';
import {
  loginWithGoogle as loginWithGoogleThunk,
  logout as logoutThunk,
  fetchCurrentUser as fetchCurrentUserThunk,
} from '../features/auth/authThunks.js';
import { clearAuthError } from '../features/auth/authSlice.js';

/**
 * Custom authentication hook coordinating Redux auth state and actions
 * Keeps UI components decoupled from Redux dispatch logic
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, role, isAuthenticated, isInitialized, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const loginWithGoogle = useCallback(
    async (credential) => {
      const resultAction = await dispatch(loginWithGoogleThunk(credential));
      if (loginWithGoogleThunk.fulfilled.match(resultAction)) {
        return { success: true, user: resultAction.payload };
      }
      return { success: false, error: resultAction.payload };
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    await dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  return {
    user,
    role,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    isAdmin: role === 'admin',
    isClient: role === 'client',
    loginWithGoogle,
    logout,
    clearError,
    refreshUser,
  };
};

export default useAuth;
