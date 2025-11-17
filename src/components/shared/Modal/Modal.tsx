'use client';
import {ReactNode} from "react";

interface ModalProps{
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({isOpen, onClose, children}: ModalProps) {
    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
         onClick={onClose}
    >
        <div className="bg-white rounded-2xl p-8 max-w-md w-full relative animate-slideUp shadow-2xl"
             onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
  );
}
