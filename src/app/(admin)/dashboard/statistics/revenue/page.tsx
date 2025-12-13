"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statisticService } from "@/app/services/statisticService"
import { toast } from "sonner"
import { IconCurrencyDong, IconTrendingUp, IconTrendingDown, IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts"

export default function RevenueReportPage() {
    const [revenueStats, setRevenueStats] = useState<any>(null)
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchRevenueStats()
    }, [period])

    const fetchRevenueStats = async () => {
        try {
            setIsLoading(true)
            const response = await statisticService.getRevenueStats({ period })
            setRevenueStats(response.data)
        } catch (error) {
            console.error('Error fetching revenue stats:', error)
            toast.error('Không thể tải báo cáo doanh thu')
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
                <SiteHeader title="Báo cáo doanh thu" />
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
            <SiteHeader title="Báo cáo doanh thu" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Báo cáo doanh thu</h1>
                    <div className="flex gap-2">
                        <Button
                            variant={period === 'day' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('day')}
                        >
                            Ngày
                        </Button>
                        <Button
                            variant={period === 'week' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('week')}
                        >
                            Tuần
                        </Button>
                        <Button
                            variant={period === 'month' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('month')}
                        >
                            Tháng
                        </Button>
                        <Button
                            variant={period === 'year' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('year')}
                        >
                            Năm
                        </Button>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconCurrencyDong className="h-5 w-5" />
                            Tổng doanh thu
                        </CardTitle>
                        <CardDescription>Doanh thu theo {period === 'day' ? 'ngày' : period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : 'năm'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-600">
                            {formatCurrency(revenueStats?.total_revenue || 0)}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue by Tour */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo Tour</CardTitle>
                        <CardDescription>Top tours có doanh thu cao nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {revenueStats?.revenue_by_tour && revenueStats.revenue_by_tour.length > 0 ? (
                            <div className="space-y-4">
                                {revenueStats.revenue_by_tour.map((tour: any, index: number) => (
                                    <div key={tour.tourID} className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{tour.tourName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {tour.bookings} bookings
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">
                                                {formatCurrency(tour.revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Chưa có dữ liệu</p>
                        )}
                    </CardContent>
                </Card>

                {/* Revenue by Period Chart */}
                {revenueStats?.revenue_by_period && revenueStats.revenue_by_period.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Biểu đồ doanh thu theo thời gian</CardTitle>
                            <CardDescription>Xu hướng doanh thu</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    revenue: {
                                        label: "Doanh thu",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueStats.revenue_by_period}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="period"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                            formatter={(value: any) => formatCurrency(value)}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="hsl(var(--chart-1))"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
}
