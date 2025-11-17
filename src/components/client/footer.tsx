'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, ChevronDown } from 'lucide-react';

export default function FooterClient() {
    const [language, setLanguage] = useState('English (Australia)');
    const [currency, setCurrency] = useState('Vietnamese Dong (₫)');

    return (
        <footer className="bg-[#1a2b49] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Language & Currency Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Language</h3>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>English (Australia)</option>
                                <option>English (US)</option>
                                <option>English (UK)</option>
                                <option>Tiếng Việt</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                        </div>

                        <h3 className="text-lg font-semibold mb-4 mt-8">Currency</h3>
                        <div className="relative">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Vietnamese Dong (₫)</option>
                                <option>US Dollar ($)</option>
                                <option>Euro (€)</option>
                                <option>British Pound (£)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                        </div>
                    </div>

                    {/* Mobile Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Mobile</h3>
                        <div className="space-y-3">
                            <Link href="https://play.google.com" target="_blank">
                                <div className="bg-black hover:bg-gray-900 transition rounded-lg p-3 flex items-center space-x-2">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div>
                                        <div className="text-xs">GET IT ON</div>
                                        <div className="text-sm font-semibold">Google Play</div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="https://apps.apple.com" target="_blank">
                                <div className="bg-black hover:bg-gray-900 transition rounded-lg p-3 flex items-center space-x-2">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                                    </svg>
                                    <div>
                                        <div className="text-xs">Download on the</div>
                                        <div className="text-sm font-semibold">App Store</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                            <li><Link href="/legal" className="hover:underline">Legal Notice</Link></li>
                            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/cookies" className="hover:underline">Cookies and Marketing Preferences</Link></li>
                            <li><Link href="/terms" className="hover:underline">General Terms and Conditions</Link></li>
                            <li><Link href="/digital-services" className="hover:underline">Information according to the Digital Services Act</Link></li>
                            <li><Link href="/sitemap" className="hover:underline">Sitemap</Link></li>
                            <li><Link href="/privacy-settings" className="hover:underline">Do not Sell or Share my Personal Information</Link></li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="hover:underline">About Us</Link></li>
                            <li><Link href="/careers" className="hover:underline">Careers</Link></li>
                            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                            <li><Link href="/press" className="hover:underline">Press</Link></li>
                            <li><Link href="/gift-cards" className="hover:underline">Gift Cards</Link></li>
                            <li><Link href="/explorer" className="hover:underline">Explorer</Link></li>
                        </ul>
                    </div>

                    {/* Work With Us Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Work With Us</h3>
                        <ul className="space-y-2 mb-6">
                            <li><Link href="/partner" className="hover:underline">As a Supply Partner</Link></li>
                            <li><Link href="/content-creator" className="hover:underline">As a Content Creator</Link></li>
                            <li><Link href="/affiliate" className="hover:underline">As an Affiliate Partner</Link></li>
                        </ul>

                        <h3 className="text-lg font-semibold mb-4">Ways You Can Pay</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {/* Payment Icons */}
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/paypal.png" alt="PayPal" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/mastercard.png" alt="Mastercard" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/visa.png" alt="Visa" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/maestro.png" alt="Maestro" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/amex.png" alt="Amex" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/jcb.png" alt="JCB" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/discover.png" alt="Discover" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/klarna.png" alt="Klarna" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/gpay.png" alt="Google Pay" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/applepay.png" alt="Apple Pay" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/ideal.png" alt="iDeal" width={40} height={24} className="object-contain" />
                            </div>
                            <div className="bg-white rounded p-2 flex items-center justify-center">
                                <Image src="/payment/bancontact.png" alt="Bancontact" width={40} height={24} className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-300 mb-4 md:mb-0">
                        © 2008 – 2025 GetYourGuide. Made in Zurich & Berlin.
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4">
                        <Link href="https://facebook.com" target="_blank" className="hover:text-blue-400 transition">
                            <Facebook className="w-6 h-6" />
                        </Link>
                        <Link href="https://instagram.com" target="_blank" className="hover:text-pink-400 transition">
                            <Instagram className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}