'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { TourImage } from '@/types/tour';

interface TourImageGalleryProps {
    images: TourImage[];
    title: string;
}

export default function TourImageGallery({ images, title }: TourImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[21/9] bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    const mainImage = images[selectedIndex]?.imageUrl || 'https://placehold.co/1200x600/e5e7eb/6b7280?text=No+Image';

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            {/* Main Gallery */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Main Image */}
                    <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-4">
                        <Image
                            src={mainImage}
                            alt={`${title} - Image ${selectedIndex + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                            onClick={() => setIsFullscreen(true)}
                        />

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-900" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {images.map((image, index) => (
                                <div
                                    key={image.imageID}
                                    onClick={() => setSelectedIndex(index)}
                                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all ${selectedIndex === index
                                            ? 'ring-4 ring-white scale-105'
                                            : 'opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <Image
                                        src={image.imageUrl || 'https://placehold.co/400x300/e5e7eb/6b7280?text=No+Image'}
                                        alt={`${title} thumbnail ${index + 1}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
                    >
                        <X className="w-6 h-6 text-gray-900" />
                    </button>

                    <div className="relative w-full h-full max-w-7xl max-h-screen p-8">
                        <Image
                            src={mainImage}
                            alt={`${title} - Fullscreen`}
                            fill
                            unoptimized
                            className="object-contain"
                        />
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all"
                            >
                                <ChevronLeft className="w-8 h-8 text-gray-900" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all"
                            >
                                <ChevronRight className="w-8 h-8 text-gray-900" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
