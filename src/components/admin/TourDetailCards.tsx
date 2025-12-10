"use client"

import { IconMapPin, IconCalendar, IconUsers, IconCurrencyDong, IconStar, IconEye, IconClock } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tour } from "@/types/tour"
import Image from "next/image"

// Helper functions
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(dateString))
}

const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString))
}

const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays + 1}N${diffDays}Đ`
}

interface TourDetailCardsProps {
    tour: Tour
}

export function TourDetailCards({ tour }: TourDetailCardsProps) {
    // Lấy ảnh tour từ API
    const tourImages = tour.images || []

    // Debug logging
    console.log('Tour data:', tour);
    console.log('Tour images:', tourImages);

    // Lấy lịch trình từ API
    const itineraries = tour.itineraries || []

    return (
        <>
            {/* Ảnh tour */}
            <Card>
                <CardHeader>
                    <CardTitle>Hình ảnh tour</CardTitle>
                    <CardDescription>Ảnh minh họa và điểm đến của tour</CardDescription>
                </CardHeader>
                <CardContent>
                    {tourImages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {tourImages.map((image, index) => {
                                console.log('Image URL:', image.imageUrl);
                                return (
                                    <div key={image.imageID} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                        <Image
                                            src={image.imageUrl}
                                            alt={`Tour image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                            unoptimized
                                            onError={(e) => {
                                                console.error('Image failed to load:', image.imageUrl);
                                                console.error('Error event:', e);
                                            }}
                                        />
                                        {index === 0 && (
                                            <Badge className="absolute top-2 left-2 bg-blue-600">Ảnh chính</Badge>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <IconMapPin className="w-16 h-16 mb-4 opacity-30" />
                            <p>Chưa có hình ảnh cho tour này</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Thông tin cơ bản */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                        <CardDescription>Chi tiết về tour du lịch</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Điểm đến</p>
                                <p className="text-sm font-semibold">{tour.destination}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Thời lượng</p>
                                <p className="text-sm font-semibold">
                                    {calculateDuration(tour.startDate, tour.endDate)}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconUsers className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Số chỗ</p>
                                <p className="text-sm font-semibold">{tour.quantity} người</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Giá tour */}
                <Card>
                    <CardHeader>
                        <CardTitle>Giá tour</CardTitle>
                        <CardDescription>Bảng giá chi tiết cho tour</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Giá người lớn</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(tour.priceAdult)}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Giá trẻ em</p>
                                <p className="text-xl font-bold text-green-600">
                                    {formatCurrency(tour.priceChild)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Giảm {Math.round(((tour.priceAdult - tour.priceChild) / tour.priceAdult) * 100)}% so với người lớn
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Đánh giá */}
                <Card>
                    <CardHeader>
                        <CardTitle>Đánh giá & phản hồi</CardTitle>
                        <CardDescription>Thông tin về đánh giá từ khách hàng</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconStar className="h-5 w-5 text-yellow-400 mt-0.5 fill-yellow-400" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Đánh giá trung bình</p>
                                <p className="text-3xl font-bold">{tour.averageRating || 0}/5</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconEye className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tổng số đánh giá</p>
                                <p className="text-2xl font-bold">{tour.totalReviews || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Thời gian tour */}
            <Card>
                <CardHeader>
                    <CardTitle>Thời gian tour</CardTitle>
                    <CardDescription>Ngày khởi hành và kết thúc</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <IconCalendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</p>
                                <p className="text-lg font-semibold">{formatDate(tour.startDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <IconCalendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Ngày kết thúc</p>
                                <p className="text-lg font-semibold">{formatDate(tour.endDate)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mô tả tour */}
            <Card>
                <CardHeader>
                    <CardTitle>Mô tả tour</CardTitle>
                    <CardDescription>Thông tin chi tiết về tour</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed">{tour.description}</p>
                </CardContent>
            </Card>

            {/* Lịch trình tour */}
            <Card>
                <CardHeader>
                    <CardTitle>Lịch trình tour</CardTitle>
                    <CardDescription>Chi tiết hoạt động từng ngày</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {itineraries.map((itinerary, index) => (
                            <div key={itinerary.itineraryID} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                                        {itinerary.dayNumber}
                                    </div>
                                    {index < itineraries.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 my-2" />
                                    )}
                                </div>
                                <div className="flex-1 pb-6">
                                    <h4 className="font-semibold mb-1">
                                        Ngày {itinerary.dayNumber}: {itinerary.destination}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {itinerary.activity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Thông tin cập nhật */}
            {(tour.createdAt || tour.updatedAt) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cập nhật</CardTitle>
                        <CardDescription>Lịch sử tạo và chỉnh sửa tour</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {tour.createdAt && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                                    <p className="text-sm">{formatDateTime(tour.createdAt)}</p>
                                </div>
                            )}
                            {tour.updatedAt && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                                    <p className="text-sm">{formatDateTime(tour.updatedAt)}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
