'use client';
import {ReactNode} from "react";

interface ModalProps{
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: string;
}

export default function Modal({isOpen, onClose, children, maxWidth='max-w-md'}: ModalProps) {
    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
         onClick={onClose}
    >
        <div className={`bg-white rounded-2xl p-8 ${maxWidth} w-full relative animate-slideUp shadow-2xl max-h-[90vh] overflow-y-auto`}
             onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
  );
}
