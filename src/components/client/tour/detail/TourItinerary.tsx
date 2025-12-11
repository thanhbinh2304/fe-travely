'use client';

import { MapPin } from 'lucide-react';
import { Itinerary } from '@/types/tour';

interface TourItineraryProps {
    itineraries: Itinerary[];
}

export default function TourItinerary({ itineraries }: TourItineraryProps) {
    if (!itineraries || itineraries.length === 0) {
        return null;
    }

    const sortedItineraries = [...itineraries].sort((a, b) => a.dayNumber - b.dayNumber);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch trình tour</h2>

            <div className="space-y-6">
                {sortedItineraries.map((itinerary, index) => (
                    <div key={itinerary.itineraryID} className="flex gap-4">
                        {/* Day Number Badge */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold shadow-lg">
                                {itinerary.dayNumber}
                            </div>

                            {/* Connector Line */}
                            {index < sortedItineraries.length - 1 && (
                                <div className="w-0.5 h-full ml-6 mt-2 bg-gray-200" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Day {itinerary.dayNumber}: {itinerary.destination}
                                </h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {itinerary.activity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
