'use client';

import { Modal, ModalHeader } from '@/components/shared/Modal';
import Divider from '@/components/shared/Divider';
import SocialLoginButtons from './SocialLoginButton';
import EmailLoginForm from './EmailLoginForm';
import LoginTerms from './LoginTerms';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
  };

  const handleEmailSubmit = (email: string) => {
    console.log('Continue with email:', email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        title="Log in or sign up"
        description="Check out more easily and access your tickets on any device with your GetYourGuide account."
        onClose={onClose}
      />

      <SocialLoginButtons
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
        onFacebookLogin={handleFacebookLogin}
      />

      <Divider />

      <EmailLoginForm onSubmit={handleEmailSubmit} />

      <LoginTerms />
    </Modal>
  );
}