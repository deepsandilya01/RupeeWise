import React, { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import Alert from '../ui/Alert.jsx';
import { useNavigate } from 'react-router-dom';

export const GoogleSignInButton = ({ className = '', onSuccess, onError }) => {
  const buttonRef = useRef(null);
  const { loginWithGoogle, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [gisLoaded, setGisLoaded] = useState(false);
  const [initError, setInitError] = useState(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isConfigured = Boolean(
    googleClientId && !googleClientId.includes('your-google-oauth-client-id')
  );

  useEffect(() => {
    // Check if Google Identity Services script is available
    const checkGis = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGis()) return;

    const interval = setInterval(() => {
      if (checkGis()) {
        clearInterval(interval);
      }
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!window.google?.accounts?.id) {
        setInitError('Google Identity Services script failed to load. Check your internet connection.');
      }
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!gisLoaded || !buttonRef.current) return;

    if (!isConfigured) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          clearError();
          const result = await loginWithGoogle(response.credential);
          if (result.success) {
            if (onSuccess) {
              onSuccess(result.user);
            } else {
              // Redirect based on role
              if (result.user.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/dashboard');
              }
            }
          } else if (onError) {
            onError(result.error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render official Google button
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: 320,
      });
    } catch (err) {
      console.error('[GIS Initialization Error]:', err);
      setInitError('Failed to initialize Google Sign-In button.');
    }
  }, [gisLoaded, isConfigured, googleClientId, loginWithGoogle, clearError, navigate, onSuccess, onError]);

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {error && (
        <Alert
          variant="error"
          title="Sign-in Failed"
          onClose={clearError}
          className="w-full mb-4"
        >
          {error}
        </Alert>
      )}

      {initError && (
        <Alert variant="warning" className="w-full mb-4">
          {initError}
        </Alert>
      )}

      {!isConfigured ? (
        <div className="w-full bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-left">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Google OAuth Configuration Needed</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed mb-3">
            To enable real Google Sign-In, please specify your OAuth 2.0 Web Client ID in:
          </p>
          <ul className="text-[11px] font-mono text-amber-900 space-y-1 mb-3 bg-amber-100/50 p-2.5 rounded-lg border border-amber-200/60">
            <li>client/.env &rarr; VITE_GOOGLE_CLIENT_ID</li>
            <li>server/.env &rarr; GOOGLE_CLIENT_ID</li>
          </ul>
          <p className="text-[11px] text-amber-700">
            Obtain credentials at <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-900">Google Cloud Console</a> with authorized origin <code className="bg-amber-100 px-1 py-0.5 rounded">http://localhost:5173</code>.
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center min-h-[44px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-full z-10">
              <span className="w-5 h-5 border-2 border-forest-800 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div ref={buttonRef} id="googleSignInButton" className="flex justify-center" />
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;
