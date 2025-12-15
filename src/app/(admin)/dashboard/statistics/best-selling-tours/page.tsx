"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statisticService } from "@/app/services/statisticService"
import { toast } from "sonner"
import { IconTrophy, IconStar, IconUsers, IconCurrencyDong, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import ExportReportButton from "@/components/admin/ExportReportButton"

export default function BestSellingToursPage() {
    const [topTours, setTopTours] = useState<any[]>([])
    const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTopTours()
    }, [period])

    const fetchTopTours = async () => {
        try {
            setIsLoading(true)
            const response = await statisticService.getTopTours({ limit: 10, period })
            setTopTours(response.data || [])
        } catch (error) {
            console.error('Error fetching top tours:', error)
            toast.error('Không thể tải danh sách tours bán chạy')
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

    const getMedalColor = (index: number) => {
        switch (index) {
            case 0: return 'bg-yellow-500 text-white'
            case 1: return 'bg-gray-400 text-white'
            case 2: return 'bg-orange-600 text-white'
            default: return 'bg-primary/10 text-primary'
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Tours bán chạy" />
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
            <SiteHeader title="Tours bán chạy" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <IconTrophy className="h-8 w-8 text-yellow-500" />
                            Tours bán chạy nhất
                        </h1>
                        <p className="text-muted-foreground mt-1">Xếp hạng theo số lượng bookings</p>
                    </div>
                    <div className="flex gap-2">
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
                        <Button
                            variant={period === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('all')}
                        >
                            Tất cả
                        </Button>
                        <ExportReportButton  period={period} />
                    </div>
                </div>

                {topTours.length > 0 ? (
                    <>
                        {/* Bar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Biểu đồ số lượng bookings</CardTitle>
                                <CardDescription>So sánh số lượng bookings giữa các tours</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        bookings: {
                                            label: "Bookings",
                                            color: "hsl(var(--chart-1))",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topTours}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="title"
                                                tick={{ fontSize: 10 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar
                                                dataKey="total_bookings"
                                                fill="hsl(var(--chart-1))"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Tours List */}
                        <div className="grid gap-4">
                            {topTours.map((tour, index) => (
                                <Card key={tour.tourID} className={index < 3 ? 'border-primary/50' : ''}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getMedalColor(index)} font-bold text-lg`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold">{tour.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{tour.destination}</p>
                                                    </div>
                                                    {index < 3 && (
                                                        <Badge variant="secondary" className="ml-2">
                                                            Top {index + 1}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 pt-2">
                                                    <div className="flex items-center gap-2">
                                                        <IconUsers className="h-4 w-4 text-blue-500" />
                                                        <div>
                                                            <p className="text-2xl font-bold text-blue-600">
                                                                {tour.total_bookings}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">Bookings</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <IconCurrencyDong className="h-4 w-4 text-green-500" />
                                                        <div>
                                                            <p className="text-lg font-bold text-green-600">
                                                                {formatCurrency(tour.total_revenue)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">Doanh thu</p>
                                                        </div>
                                                    </div>
                                                    {tour.average_rating && (
                                                        <div className="flex items-center gap-2">
                                                            <IconStar className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                            <div>
                                                                <p className="text-2xl font-bold text-yellow-600">
                                                                    {tour.average_rating.toFixed(1)}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">Đánh giá</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">Chưa có dữ liệu tours bán chạy</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
}
