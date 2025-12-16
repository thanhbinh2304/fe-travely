'use client';

import { useState, useEffect } from 'react';

export function useScrollSearch() {
    const [showSearchInHeader, setShowSearchInHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const bannerSearch = document.getElementById('banner-search');
            if (bannerSearch) {
                const rect = bannerSearch.getBoundingClientRect();
                // Khi search bar trong banner scroll qua khỏi viewport thì hiện search ở header
                setShowSearchInHeader(rect.bottom < 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { showSearchInHeader };
}
