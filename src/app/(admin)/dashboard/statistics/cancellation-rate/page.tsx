"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statisticService } from "@/app/services/statisticService"
import { toast } from "sonner"
import { IconAlertTriangle, IconPercentage, IconX, IconTrendingUp } from "@tabler/icons-react"
import { Progress } from "@/components/ui/progress"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"

export default function CancellationRatePage() {
    const [bookingStats, setBookingStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBookingStats()
    }, [])

    const fetchBookingStats = async () => {
        try {
            setIsLoading(true)
            const response = await statisticService.getBookingStats()
            setBookingStats(response.data)
        } catch (error) {
            console.error('Error fetching booking stats:', error)
            toast.error('Không thể tải báo cáo')
        } finally {
            setIsLoading(false)
        }
    }

    const calculateRate = (value: number, total: number) => {
        return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Tỷ lệ hủy booking" />
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

    const totalBookings = bookingStats?.total_bookings || 0
    const cancelled = bookingStats?.cancelled || 0
    const confirmed = bookingStats?.confirmed || 0
    const completed = bookingStats?.completed || 0
    const pending = bookingStats?.pending || 0

    const cancellationRate = calculateRate(cancelled, totalBookings)

    return (
        <>
            <SiteHeader title="Tỷ lệ hủy booking" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <IconAlertTriangle className="h-8 w-8 text-orange-500" />
                            Báo cáo tỷ lệ hủy bookings
                        </h1>
                        <p className="text-muted-foreground mt-1">Phân tích tình trạng hủy booking</p>
                    </div>
                </div>

                {/* Main Cancellation Rate Card */}
                <Card className="border-orange-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconPercentage className="h-5 w-5 text-orange-500" />
                            Tỷ lệ hủy booking
                        </CardTitle>
                        <CardDescription>Tỷ lệ booking bị hủy so với tổng số booking</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-5xl font-bold text-orange-600">
                                    {cancellationRate}%
                                </span>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Đã hủy</p>
                                    <p className="text-2xl font-bold text-orange-600">{cancelled}</p>
                                    <p className="text-xs text-muted-foreground">/ {totalBookings} bookings</p>
                                </div>
                            </div>
                            <Progress value={parseFloat(cancellationRate)} className="h-3" />
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Status Breakdown */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Chờ xác nhận
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {calculateRate(pending, totalBookings)}% tổng số
                            </p>
                            <Progress value={parseFloat(calculateRate(pending, totalBookings))} className="h-1.5 mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Đã xác nhận
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{confirmed}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {calculateRate(confirmed, totalBookings)}% tổng số
                            </p>
                            <Progress value={parseFloat(calculateRate(confirmed, totalBookings))} className="h-1.5 mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Hoàn thành
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{completed}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {calculateRate(completed, totalBookings)}% tổng số
                            </p>
                            <Progress value={parseFloat(calculateRate(completed, totalBookings))} className="h-1.5 mt-2" />
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Đã hủy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{cancelled}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {calculateRate(cancelled, totalBookings)}% tổng số
                            </p>
                            <Progress value={parseFloat(calculateRate(cancelled, totalBookings))} className="h-1.5 mt-2" />
                        </CardContent>
                    </Card>
                </div>

                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố trạng thái booking</CardTitle>
                        <CardDescription>Biểu đồ tròn phân bố các trạng thái</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                pending: {
                                    label: "Chờ xác nhận",
                                    color: "#eab308",
                                },
                                confirmed: {
                                    label: "Đã xác nhận",
                                    color: "#3b82f6",
                                },
                                completed: {
                                    label: "Hoàn thành",
                                    color: "#22c55e",
                                },
                                cancelled: {
                                    label: "Đã hủy",
                                    color: "#f97316",
                                },
                            }}
                            className="h-[350px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Chờ xác nhận", value: pending, color: "#eab308" },
                                            { name: "Đã xác nhận", value: confirmed, color: "#3b82f6" },
                                            { name: "Hoàn thành", value: completed, color: "#22c55e" },
                                            { name: "Đã hủy", value: cancelled, color: "#f97316" },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {[
                                            { color: "#eab308" },
                                            { color: "#3b82f6" },
                                            { color: "#22c55e" },
                                            { color: "#f97316" },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân tích</CardTitle>
                        <CardDescription>Nhận xét về tỷ lệ hủy booking</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {parseFloat(cancellationRate) < 5 && (
                                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <IconTrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-900">Tỷ lệ hủy thấp - Rất tốt!</p>
                                        <p className="text-sm text-green-700">
                                            Tỷ lệ hủy booking dưới 5% cho thấy khách hàng hài lòng với dịch vụ.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {parseFloat(cancellationRate) >= 5 && parseFloat(cancellationRate) < 15 && (
                                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <IconAlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-900">Tỷ lệ hủy trung bình</p>
                                        <p className="text-sm text-yellow-700">
                                            Nên theo dõi và tìm hiểu nguyên nhân để giảm tỷ lệ hủy.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {parseFloat(cancellationRate) >= 15 && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <IconX className="h-5 w-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-900">Tỷ lệ hủy cao - Cần cải thiện!</p>
                                        <p className="text-sm text-red-700">
                                            Tỷ lệ hủy trên 15% cho thấy có vấn đề cần giải quyết ngay.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
