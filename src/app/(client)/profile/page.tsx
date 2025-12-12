'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, CreditCard, Bell, Loader2 } from 'lucide-react';
import authService from '@/app/services/authService';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

interface UserProfile {
    userID: number;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeSection, setActiveSection] = useState('profile');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobilePhone, setMobilePhone] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const token = authService.getToken();
            if (!token) {
                toast.error('Please log in');
                router.push('/auth/signin');
                return;
            }

            const response = await fetch(`${API_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to load profile');

            const data = await response.json();
            setProfile(data.data);

            // Split fullName
            const nameParts = (data.data.fullName || '').trim().split(' ');
            if (nameParts.length > 0) {
                setFirstName(nameParts[0]);
                setLastName(nameParts.slice(1).join(' '));
            }

            setMobilePhone(data.data.phoneNumber || '');

            // Parse DOB
            if (data.data.dateOfBirth) {
                const date = new Date(data.data.dateOfBirth);
                setDay(date.getDate().toString());
                setMonth((date.getMonth() + 1).toString());
                setYear(date.getFullYear().toString());
            }
        } catch (error) {
            console.error('Load profile error:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setUpdating(true);
            const token = authService.getToken();

            const fullName = `${firstName} ${lastName}`.trim();

            let dateOfBirth = '';
            if (day && month && year) {
                dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }

            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    phoneNumber: mobilePhone,
                    dateOfBirth
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Update failed');
            }

            toast.success('Profile updated successfully!');
            await loadProfile();
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">User not found</p>
            </div>
        );
    }

    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const months = [
        { value: '1', label: 'January' }, { value: '2', label: 'February' },
        { value: '3', label: 'March' }, { value: '4', label: 'April' },
        { value: '5', label: 'May' }, { value: '6', label: 'June' },
        { value: '7', label: 'July' }, { value: '8', label: 'August' },
        { value: '9', label: 'September' }, { value: '10', label: 'October' },
        { value: '11', label: 'November' }, { value: '12', label: 'December' }
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

    return (
        <div className="min-h-screen bg-white py-12 pt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 text-white rounded-lg p-6 mb-4">
                            <h2 className="text-2xl font-bold mb-1">{firstName || profile.username}</h2>
                            <p className="text-gray-300 text-sm">Account</p>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveSection('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === 'profile'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <User className="h-5 w-5" />
                                <span className="font-medium">Profile</span>
                            </button>

                            <button
                                onClick={() => setActiveSection('notifications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === 'notifications'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Bell className="h-5 w-5" />
                                <span className="font-medium">Notifications</span>
                            </button>

                            <button
                                onClick={() => setActiveSection('cards')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === 'cards'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <CreditCard className="h-5 w-5" />
                                <span className="font-medium">Saved cards</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeSection === 'profile' && (
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Details</h1>

                                <form onSubmit={handleSave} className="space-y-6">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                                First Name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="mt-1 bg-gray-100"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="mobilePhone" className="text-sm font-medium text-gray-700">
                                                    Mobile Phone
                                                </Label>
                                                <Input
                                                    id="mobilePhone"
                                                    type="tel"
                                                    value={mobilePhone}
                                                    onChange={(e) => setMobilePhone(e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Date of birth</h2>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="day" className="text-sm font-medium text-gray-700">
                                                    Day
                                                </Label>
                                                <select
                                                    id="day"
                                                    value={day}
                                                    onChange={(e) => setDay(e.target.value)}
                                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select</option>
                                                    {days.map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <Label htmlFor="month" className="text-sm font-medium text-gray-700">
                                                    Month
                                                </Label>
                                                <select
                                                    id="month"
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select</option>
                                                    {months.map(m => (
                                                        <option key={m.value} value={m.value}>{m.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                                                    Year
                                                </Label>
                                                <select
                                                    id="year"
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select</option>
                                                    {years.map(y => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={updating}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-8 py-2 rounded-md"
                                        >
                                            {updating ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="pt-8 border-t border-gray-200">
                                        <button
                                            type="button"
                                            className="text-red-600 hover:text-red-700 font-medium"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h1>
                                <p className="text-gray-600">Notification settings coming soon...</p>
                            </div>
                        )}

                        {activeSection === 'cards' && (
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Saved cards</h1>
                                <p className="text-gray-600">No saved cards yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
