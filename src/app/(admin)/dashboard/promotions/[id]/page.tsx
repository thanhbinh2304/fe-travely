"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconTag, IconCalendar, IconPercentage } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { promotionService } from "@/app/services/promotionService"
import { Promotion } from "@/types/promotion"
import { toast } from "sonner"

export default function PromotionDetailPage() {
    const params = useParams()
    const router = useRouter()
    const promotionId = params.id as string

    const [promotion, setPromotion] = useState<Promotion | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPromotionDetail()
    }, [promotionId])

    const fetchPromotionDetail = async () => {
        try {
            setIsLoading(true)
            const response = await promotionService.getPromotion(parseInt(promotionId))
            setPromotion(response.data)
        } catch (error) {
            console.error('Error fetching promotion:', error)
            toast.error('Không thể tải thông tin khuyến mãi')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!promotion) return

        if (!confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${promotion.description}"?`)) {
            return
        }

        try {
            await promotionService.deletePromotion(parseInt(promotionId))
            toast.success('Đã xóa khuyến mãi thành công')
            router.push('/dashboard/promotions')
        } catch (error) {
            console.error('Error deleting promotion:', error)
            toast.error('Không thể xóa khuyến mãi')
        }
    }

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString))
    }

    const getStatusBadge = (promotion: Promotion) => {
        const now = new Date()
        const startDate = new Date(promotion.startDate)
        const endDate = new Date(promotion.endDate)

        if (now < startDate) {
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <IconCalendar className="w-3 h-3 mr-1" />
                    Sắp diễn ra
                </Badge>
            )
        } else if (now > endDate) {
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    <IconCalendar className="w-3 h-3 mr-1" />
                    Đã kết thúc
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <IconTag className="w-3 h-3 mr-1" />
                    Đang hoạt động
                </Badge>
            )
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Chi tiết khuyến mãi" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                </div>
            </>
        )
    }

    if (!promotion) {
        return (
            <>
                <SiteHeader title="Khuyến mãi không tìm thấy" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Không tìm thấy khuyến mãi</h2>
                        <p className="text-muted-foreground mb-4">ID: {promotionId}</p>
                        <Button onClick={() => router.push('/dashboard/promotions')}>
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    const statusBadge = getStatusBadge(promotion)

    return (
        <>
            <SiteHeader title="Chi tiết khuyến mãi" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/dashboard/promotions')}
                        >
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Chi tiết khuyến mãi</h1>
                            <p className="text-muted-foreground">ID: #{promotion.promotionID}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {statusBadge}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/promotions/${promotionId}/edit`)}
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            <IconTrash className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    </div>
                </div>

                {/* Promotion Details */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <IconTag className="w-5 h-5" />
                                Thông tin khuyến mãi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                                <p className="text-sm mt-1">{promotion.description}</p>
                            </div>

                            {promotion.code && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Mã khuyến mãi</Label>
                                    <p className="text-sm mt-1 font-mono bg-muted px-2 py-1 rounded">
                                        {promotion.code}
                                    </p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Giảm giá</Label>
                                <p className="text-sm mt-1 flex items-center gap-1">
                                    <IconPercentage className="w-4 h-4 text-green-600" />
                                    {promotion.discount}%
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Số lượng</Label>
                                <p className="text-sm mt-1">{promotion.quantity}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <IconCalendar className="w-5 h-5" />
                                Thời gian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</Label>
                                <p className="text-sm mt-1">{formatDate(promotion.startDate)}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Ngày kết thúc</Label>
                                <p className="text-sm mt-1">{formatDate(promotion.endDate)}</p>
                            </div>

                            {promotion.created_at && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Ngày tạo</Label>
                                    <p className="text-sm mt-1">{formatDate(promotion.created_at)}</p>
                                </div>
                            )}

                            {promotion.updated_at && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</Label>
                                    <p className="text-sm mt-1">{formatDate(promotion.updated_at)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

// Helper component for labels
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`text-sm font-medium ${className}`}>{children}</div>
}