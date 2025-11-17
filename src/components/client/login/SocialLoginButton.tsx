'use client';

import { SocialButton } from '@/components/shared/Button';
import { GoogleIcon, AppleIcon, FacebookIcon } from './SocialIcons';

interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onFacebookLogin: () => void;
}

export default function SocialLoginButtons({
  onGoogleLogin,
  onAppleLogin,
  onFacebookLogin
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-3 mb-6">
      <SocialButton
        icon={<GoogleIcon />}
        text="Continue with Google"
        onClick={onGoogleLogin}
      />
      <SocialButton
        icon={<AppleIcon />}
        text="Continue with Apple"
        onClick={onAppleLogin}
      />
      <SocialButton
        icon={<FacebookIcon />}
        text="Continue with Facebook"
        onClick={onFacebookLogin}
      />
    </div>
  );
}