'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TourDescriptionProps {
    description: string;
}

export default function TourDescription({ description }: TourDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if description is long enough to need collapse
    const isLongDescription = description.length > 500;
    const displayDescription = isExpanded || !isLongDescription
        ? description
        : description.slice(0, 500) + '...';

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Về tour này</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {displayDescription}
            </div>

            {isLongDescription && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                    {isExpanded ? (
                        <>
                            <span>Show less</span>
                            <ChevronUp className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <span>Read more</span>
                            <ChevronDown className="w-5 h-5" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
