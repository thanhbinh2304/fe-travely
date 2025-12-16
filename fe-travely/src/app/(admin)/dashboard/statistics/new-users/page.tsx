"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { statisticService } from "@/app/services/statisticService"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { IconUserPlus, IconDownload } from "@tabler/icons-react"
import ExportReportButton from "@/components/admin/ExportReportButton"

export default function NewUsersPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year" | "all">("month")
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<{ total: number; series: any[] }>({ total: 0, series: [] })

  useEffect(() => {
    fetchNewUsers()
  }, [period])

  const fetchNewUsers = async () => {
    try {
      setIsLoading(true)
      const response = await statisticService.getNewUsers({ period })
      // Kỳ vọng BE trả: { data: { total: number, series: [{ label/date: string, count: number }] } }
      setSummary(response.data || { total: 0, series: [] })
    } catch (error) {
      console.error("Error fetching new users stats:", error)
      toast.error("Không thể tải báo cáo người dùng mới")
      setSummary({ total: 0, series: [] })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <SiteHeader title="Người dùng mới" />
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
      <SiteHeader title="Người dùng mới" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <IconUserPlus className="h-8 w-8 text-primary" />
              Báo cáo người dùng mới
            </h1>
            <p className="text-muted-foreground mt-1">Thống kê số lượng user đăng ký mới theo thời gian</p>
          </div>

          <div className="flex gap-2">
            <Button variant={period === "week" ? "default" : "outline"} size="sm" onClick={() => setPeriod("week")}>
              Tuần
            </Button>
            <Button variant={period === "month" ? "default" : "outline"} size="sm" onClick={() => setPeriod("month")}>
              Tháng
            </Button>
            <Button variant={period === "year" ? "default" : "outline"} size="sm" onClick={() => setPeriod("year")}>
              Năm
            </Button>
            <Button variant={period === "all" ? "default" : "outline"} size="sm" onClick={() => setPeriod("all")}>
              Tất cả
            </Button>
            <ExportReportButton period={period} endpoint="user-growth" />
          </div>
        </div>

        {/* Tổng user mới */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng user mới</CardTitle>
            <CardDescription>Trong khoảng thời gian đã chọn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{summary.total || 0}</div>
          </CardContent>
        </Card>

        {/* Biểu đồ */}
        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ user mới</CardTitle>
            <CardDescription>So sánh số lượng user mới theo từng mốc thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "User mới", color: "hsl(var(--chart-1))" },
              }}
              className="h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.series || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Empty state */}
        {(!summary.series || summary.series.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Chưa có dữ liệu user mới</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
