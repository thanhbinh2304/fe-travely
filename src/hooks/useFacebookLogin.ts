'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookLoginResponse {
  authResponse: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
    graphDomain: string;
  } | null;
  status: 'connected' | 'not_authorized' | 'unknown';
}

interface FacebookUserData {
  id: string;
  name: string;
  email: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export function useFacebookLogin() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    // Check if SDK is already loaded
    if (window.FB) {
      setIsSDKLoaded(true);
      return;
    }

    // Wait for SDK to load
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      setIsSDKLoaded(true);
    };

    // Load SDK if not already loaded
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(script);
    }
  }, []);

  const login = (
    onSuccess: (userData: FacebookUserData, accessToken: string) => void,
    onError: (error: any) => void
  ) => {
    if (!isSDKLoaded || !window.FB) {
      onError(new Error('Facebook SDK not loaded'));
      return;
    }

    window.FB.login(
      (response: FacebookLoginResponse) => {
        if (response.authResponse) {
          // User logged in successfully
          const accessToken = response.authResponse.accessToken;
          const userId = response.authResponse.userID;

          // Get user data from Facebook Graph API
          window.FB.api(
            '/me',
            { fields: 'id,name,email,picture' },
            (userData: FacebookUserData) => {
              if (userData.email) {
                onSuccess(userData, accessToken);
              } else {
                onError(new Error('Email permission not granted'));
              }
            }
          );
        } else {
          // User cancelled login or didn't authorize
          onError(new Error('Facebook login cancelled'));
        }
      },
      { 
        scope: 'public_profile,email',
        return_scopes: true 
      }
    );
  };

  const logout = () => {
    if (window.FB) {
      window.FB.logout();
    }
  };

  return {
    isSDKLoaded,
    login,
    logout
  };
}