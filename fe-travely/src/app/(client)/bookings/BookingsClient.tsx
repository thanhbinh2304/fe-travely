'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import authService from '@/app/services/AuthService';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'https://backend-travely.onrender.com/api';


interface Booking {
    bookingID: number;
    tourID: number;
    bookingDate: string;
    numberOfPeople: number;
    totalPrice: number;
    bookingStatus: string;
    paymentStatus: string;
    tour: {
        tourID: number;
        title: string;
        startDate: string;
        endDate: string;
        location: string;
    };
    checkout?: {
        checkoutID: number;
        paymentStatus: string;
        paymentDate: string;
    };
}

export default function BookingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        loadBookings();

        const paymentStatus = searchParams?.get('payment');
        if (paymentStatus === 'success') {
            toast.success('Payment successful!');
            router.replace('/bookings');
        }
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const token = authService.getToken();
            if (!token) {
                toast.error('Please log in');
                router.push('/auth/signin');
                return;
            }

            const response = await fetch(`${API_URL}/user/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to load bookings');

            const data = await response.json();
            const bookingsData = Array.isArray(data.data) ? data.data : (data.data?.data || []);
            setBookings(bookingsData);
        } catch (error) {
            console.error('Load bookings error:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const upcomingBookings = bookings.filter(b =>
        b.checkout?.paymentStatus?.toLowerCase() === 'completed' &&
        b.bookingStatus.toLowerCase() !== 'cancelled' &&
        new Date(b.tour.startDate) > new Date()
    );

    const pastBookings = bookings.filter(b =>
        b.bookingStatus.toLowerCase() === 'cancelled' ||
        new Date(b.tour.endDate) < new Date()
    );

    return (
        <div className="min-h-screen bg-white py-12 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Upcoming bookings */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt tour sắp tới</h1>

                    {upcomingBookings.length === 0 ? (
                        <Card className="p-8">
                            <p className="text-gray-600">
                                Chưa có tour, khi bạn đặt tour thành công, nó sẽ hiển thị ở đây.
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                                <Card key={booking.bookingID} className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {booking.tour.title}
                                            </h3>
                                            <p className="text-gray-600 mb-1">
                                                {new Date(booking.tour.startDate).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-gray-600">
                                                {booking.numberOfPeople} {booking.numberOfPeople > 1 ? 'people' : 'person'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">
                                                ₫{new Intl.NumberFormat('vi-VN').format(booking.totalPrice)}
                                            </p>
                                            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past and canceled bookings */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Tour đã đặt hoặc đã hủy</h2>

                    {pastBookings.length === 0 ? (
                        <Card className="p-8">
                            <p className="text-gray-600">
                                Bạn chưa từng đặt tour nào.
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {pastBookings.map((booking) => (
                                <Card key={booking.bookingID} className="p-6 opacity-75">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {booking.tour.title}
                                            </h3>
                                            <p className="text-gray-600 mb-1">
                                                {new Date(booking.tour.startDate).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-gray-600">
                                                {booking.numberOfPeople} {booking.numberOfPeople > 1 ? 'people' : 'person'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">
                                                ₫{new Intl.NumberFormat('vi-VN').format(booking.totalPrice)}
                                            </p>
                                            <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded ${booking.bookingStatus.toLowerCase() === 'cancelled'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {booking.bookingStatus.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Completed'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
