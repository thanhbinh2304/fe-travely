import {ReactNode} from 'react';    

interface SocialButtonProps{
    icon : ReactNode;
    text: string;
    onClick: () => void;
}

export default function SocialButton({icon, text, onClick}: SocialButtonProps) {
  return (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-center gap-4 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-medium"
    >
        {icon}
        {text}
    </button>
  );
}
