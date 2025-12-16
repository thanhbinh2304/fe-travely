'use client';

import { SocialButton } from '@/components/shared/Button';
import { GoogleIcon, FacebookIcon } from './SocialIcons';

interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
}

export default function SocialLoginButtons({
  onGoogleLogin,
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
        icon={<FacebookIcon />}
        text="Continue with Facebook"
        onClick={onFacebookLogin}
      />
    </div>
  );
}