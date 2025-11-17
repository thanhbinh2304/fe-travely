'use client';
import {X} from "lucide-react";

interface ModalHeaderProps{
    title: string;
    description?: string;
    onClose: () => void;
}

export default function ModalHeader({title, description, onClose}: ModalHeaderProps) {
  return (
    <>
        <button 
            onClick={onClose}
            className = "absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-all hover:rotate-90"
            aria-label ="Close"
        >
            <X size ={24}/>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
        </h2>
        {description && (
            <p className="text-gray-600 mb-8">
                {description}
            </p>
        )}
    </>
  );
}
