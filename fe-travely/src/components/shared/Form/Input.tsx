'use client';

interface InputProps{
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export default function Input({id, label, type = 'text', value, onChange, placeholder = '', required = false}: InputProps) {
    return(
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input 
                type={type}
                id={id}
                value ={value}
                onChange ={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder ={placeholder}
                required ={required}
             />
        </div>
    );
}