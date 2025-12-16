'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    className?: string;
    onSearch?: (query: string) => void;
}

export default function SearchBar({ className = '', onSearch }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <form onSubmit={handleSearch} className={`flex items-center ${className}`}>
            <div className="relative w-full flex-1">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm địa điểm và trải nghiệm"
                    className="w-full px-6 py-4 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                />
                 <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition shadow-lg flex items-center space-x-2"
                >
                    <Search className="w-5 h-5" />
                
                </button>
            </div>
           
        </form>
    );
}
