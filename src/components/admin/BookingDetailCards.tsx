"use client"

import { IconMail, IconPhone, IconUsers, IconCalendar, IconCurrencyDong, IconMapPin, IconFileText, IconClock } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Booking } from "@/types/booking"

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

interface BookingDetailCardsProps {
    booking: Booking
}

export function BookingDetailCards({ booking }: BookingDetailCardsProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Thông tin khách hàng */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin khách hàng</CardTitle>
                        <CardDescription>Chi tiết người đặt tour</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconUsers className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tên khách hàng</p>
                                <p className="text-sm font-semibold">{booking.user?.userName || 'N/A'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconMail className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-sm">{booking.user?.email || 'N/A'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconPhone className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                                <p className="text-sm">{booking.user?.phoneNumber || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Thông tin tour */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin tour</CardTitle>
                        <CardDescription>Chi tiết về tour đã đặt</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tên tour</p>
                                <p className="text-sm font-semibold">{booking.tour?.title || 'N/A'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Điểm đến</p>
                                <p className="text-sm">{booking.tour?.destination || 'N/A'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconCalendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Ngày khởi hành</p>
                                <p className="text-sm font-semibold">{formatDate(booking.bookingDate)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Số lượng khách */}
                <Card>
                    <CardHeader>
                        <CardTitle>Số lượng khách</CardTitle>
                        <CardDescription>Thông tin về số người tham gia</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconUsers className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Người lớn</p>
                                <p className="text-3xl font-bold">{booking.numAdults}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconUsers className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Trẻ em</p>
                                <p className="text-3xl font-bold">{booking.numChildren}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconUsers className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tổng số người</p>
                                <p className="text-2xl font-semibold text-blue-600">
                                    {booking.numAdults + booking.numChildren}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Thông tin thanh toán */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin thanh toán</CardTitle>
                    <CardDescription>Chi tiết về giá và trạng thái thanh toán</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tổng tiền</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(booking.totalPrice)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground mb-2">Trạng thái thanh toán</p>
                                {booking.paymentStatus === 'completed' && (
                                    <Badge className="bg-green-100 text-green-800 border-green-300">
                                        Đã thanh toán
                                    </Badge>
                                )}
                                {booking.paymentStatus === 'pending' && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                        Chờ thanh toán
                                    </Badge>
                                )}
                                {booking.paymentStatus === 'failed' && (
                                    <Badge className="bg-red-100 text-red-800 border-red-300">
                                        Thanh toán thất bại
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Yêu cầu đặc biệt */}
            {booking.specialRequests && (
                <Card>
                    <CardHeader>
                        <CardTitle>Yêu cầu đặc biệt</CardTitle>
                        <CardDescription>Ghi chú từ khách hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-3">
                            <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm leading-relaxed">{booking.specialRequests}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Thông tin thời gian */}
            {(booking.createdAt || booking.updatedAt) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin thời gian</CardTitle>
                        <CardDescription>Lịch sử tạo và cập nhật booking</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {booking.createdAt && (
                                <div className="flex items-start gap-3">
                                    <IconClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                                        <p className="text-sm">{formatDateTime(booking.createdAt)}</p>
                                    </div>
                                </div>
                            )}
                            {booking.updatedAt && (
                                <div className="flex items-start gap-3">
                                    <IconClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                                        <p className="text-sm">{formatDateTime(booking.updatedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
