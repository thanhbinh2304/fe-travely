'use client';

import { Check, X } from 'lucide-react';

interface InclusionExclusionListProps {
    inclusions?: string[];
    exclusions?: string[];
}

export default function InclusionExclusionList({ inclusions, exclusions }: InclusionExclusionListProps) {
    const defaultInclusions = [
        'Hướng dẫn viên chuyên nghiệp',
        'Phương tiện di chuyển',
        'Phí vào cửa các điểm tham quan',
        'Bảo hiểm du lịch',
    ];

    const defaultExclusions = [
        'Chi phí cá nhân',
        'Tiền tip cho hướng dẫn viên và lái xe',
        'Bữa ăn không được đề cập trong hành trình',
    ];

    const displayInclusions = inclusions && inclusions.length > 0 ? inclusions : defaultInclusions;
    const displayExclusions = exclusions && exclusions.length > 0 ? exclusions : defaultExclusions;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour bao gồm</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        Bao gồm
                    </h3>
                    <ul className="space-y-3">
                        {displayInclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Exclusions */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="w-5 h-5 text-red-600" />
                        </div>
                        Không bao gồm
                    </h3>
                    <ul className="space-y-3">
                        {displayExclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
