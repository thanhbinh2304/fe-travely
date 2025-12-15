"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statisticService } from "@/app/services/statisticService"
import { toast } from "sonner"
import { IconChecklist, IconClock, IconCircleCheck, IconCircleX, IconChartPie } from "@tabler/icons-react"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"

export default function BookingStatusPage() {
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
      console.error("Error fetching booking stats:", error)
      toast.error("Không thể tải báo cáo trạng thái booking")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateRate = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"
  }

  if (isLoading) {
    return (
      <>
        <SiteHeader title="Trạng thái booking" />
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

  return (
    <>
      <SiteHeader title="Trạng thái booking" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <IconChecklist className="h-8 w-8 text-primary" />
              Báo cáo trạng thái booking
            </h1>
            <p className="text-muted-foreground mt-1">Thống kê số lượng booking theo từng trạng thái</p>
          </div>
        </div>

        {/* Tổng booking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChartPie className="h-5 w-5 text-primary" />
              Tổng số booking
            </CardTitle>
            <CardDescription>Tổng booking hiện có trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{totalBookings}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Pending: {pending} • Confirmed: {confirmed} • Completed: {completed} • Cancelled: {cancelled}
            </p>
          </CardContent>
        </Card>

        {/* 4 cards trạng thái */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconClock className="h-4 w-4 text-yellow-600" />
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
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-blue-600" />
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
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
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
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IconCircleX className="h-4 w-4 text-orange-600" />
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

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố trạng thái booking</CardTitle>
            <CardDescription>Biểu đồ tròn phân bố các trạng thái</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pending: { label: "Chờ xác nhận", color: "#eab308" },
                confirmed: { label: "Đã xác nhận", color: "#3b82f6" },
                completed: { label: "Hoàn thành", color: "#22c55e" },
                cancelled: { label: "Đã hủy", color: "#f97316" },
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
                    dataKey="value"
                  >
                    {["#eab308", "#3b82f6", "#22c55e", "#f97316"].map((c, i) => (
                      <Cell key={`cell-${i}`} fill={c} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
