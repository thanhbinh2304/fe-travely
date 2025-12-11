'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

export default function Banner() {
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(`/tours?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="relative h-[600px] z-0 flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-purple-500"
                style={{
                    backgroundImage: "url('')",
                }}
            >
                {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center" ref={searchRef}>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
                    Discover & book things to do
                </h1>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto" id="banner-search">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Continue Planning Section */}
                <div className="mt-12">
                    <h2 className="text-2xl text-white font-semibold mb-6">Continue planning your trip</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">


                    </div>
                </div>
            </div>
        </section>
    );
}
