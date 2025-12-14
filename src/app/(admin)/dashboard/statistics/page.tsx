'use client';

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statisticService } from "@/app/services/statisticService"
import { toast } from "sonner"
import { IconUsers, IconTournament, IconCalendar, IconCurrencyDong, IconTrendingUp, IconChartBar } from "@tabler/icons-react"

export default function StatisticsPage() {
    const [stats, setStats] = useState<any>(null)
    const [bookingStats, setBookingStats] = useState<any>(null)
    const [topTours, setTopTours] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStatistics()
    }, [])

    const fetchStatistics = async () => {
        try {
            setIsLoading(true)
            const [dashboardRes, bookingRes, toursRes] = await Promise.all([
                statisticService.getDashboardOverview(),
                statisticService.getBookingStats(),
                statisticService.getTopTours({ limit: 5, period: 'month' })
            ])

            setStats(dashboardRes.data)
            setBookingStats(bookingRes.data)
            setTopTours(toursRes.data || [])
        } catch (error) {
            console.error('Error fetching statistics:', error)
            toast.error('Không thể tải thống kê')
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Thống kê" />
                <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-center h-64">
                            <p className="text-muted-foreground">Đang tải...</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <SiteHeader title="Thống kê" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Thống kê tổng quan</h1>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tổng người dùng
                            </CardTitle>
                            <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tổng Tours
                            </CardTitle>
                            <IconTournament className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_tours || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tổng Bookings
                            </CardTitle>
                            <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_bookings || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.bookings_this_month || 0} booking tháng này
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tổng doanh thu
                            </CardTitle>
                            <IconCurrencyDong className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatCurrency(stats?.revenue_this_month || 0)} tháng này
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Statistics */}
                {bookingStats && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thống kê Bookings</CardTitle>
                                <CardDescription>Trạng thái các booking</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Chờ xác nhận</span>
                                    <span className="font-semibold text-yellow-600">{bookingStats.pending || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Đã xác nhận</span>
                                    <span className="font-semibold text-blue-600">{bookingStats.confirmed || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Hoàn thành</span>
                                    <span className="font-semibold text-green-600">{bookingStats.completed || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Đã hủy</span>
                                    <span className="font-semibold text-gray-600">{bookingStats.cancelled || 0}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Giá trị trung bình</span>
                                        <span className="font-bold text-primary">{formatCurrency(bookingStats.average_booking_value || 0)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Tours */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Tours</CardTitle>
                                <CardDescription>Tours phổ biến nhất tháng này</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {topTours.length > 0 ? (
                                    <div className="space-y-3">
                                        {topTours.map((tour, index) => (
                                            <div key={tour.tourID} className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{tour.title}</p>
                                                    <p className="text-xs text-muted-foreground">{tour.destination}</p>
                                                    <div className="flex gap-4 mt-1">
                                                        <span className="text-xs text-muted-foreground">
                                                            {tour.total_bookings} bookings
                                                        </span>
                                                        <span className="text-xs font-semibold text-green-600">
                                                            {formatCurrency(tour.total_revenue)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    )
}
