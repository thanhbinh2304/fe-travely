'use client';

interface PrimaryButtonProps {
    text: string;
    onClick?: () => void;
    type? : 'button' | 'submit';
    disabled? : boolean;
}

export default function PrimaryButton({text, onClick, type = 'button', disabled = false}: PrimaryButtonProps) {
  return (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
        {text}
    </button>
  );
}
