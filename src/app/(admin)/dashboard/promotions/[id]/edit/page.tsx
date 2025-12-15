"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { IconArrowLeft, IconEdit } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { promotionService } from "@/app/services/promotionService"
import { Promotion } from "@/types/promotion"

export default function EditPromotionPage() {
    const router = useRouter()
    const params = useParams()
    const promotionId = params.id as string

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Form states
    const [description, setDescription] = useState("")
    const [discount, setDiscount] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [quantity, setQuantity] = useState("")
    const [code, setCode] = useState("")

    // Fetch promotion data on mount
    useEffect(() => {
        fetchPromotionData()
    }, [promotionId])

    const fetchPromotionData = async () => {
        try {
            setIsLoading(true)
            const response = await promotionService.getPromotion(parseInt(promotionId))
            const promotion = response.data

            // Populate form with existing data
            setDescription(promotion.description)
            setDiscount(promotion.discount.toString())
            setQuantity(promotion.quantity.toString())
            setCode(promotion.code || "")

            // Format dates for datetime-local input
            const start = new Date(promotion.startDate)
            const end = new Date(promotion.endDate)

            setStartDate(start.toISOString().slice(0, 16))
            setEndDate(end.toISOString().slice(0, 16))
        } catch (error) {
            console.error('Error fetching promotion:', error)
            toast.error('Không thể tải thông tin khuyến mãi')
            router.push('/dashboard/promotions')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Validate form
        if (!description || !discount || !startDate || !endDate || !quantity) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            setIsSubmitting(false)
            return
        }

        const discountValue = parseFloat(discount)
        if (discountValue <= 0 || discountValue > 100) {
            toast.error("Giảm giá phải từ 1% đến 100%")
            setIsSubmitting(false)
            return
        }

        const quantityValue = parseInt(quantity)
        if (quantityValue <= 0) {
            toast.error("Số lượng phải lớn hơn 0")
            setIsSubmitting(false)
            return
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        if (start >= end) {
            toast.error("Ngày kết thúc phải sau ngày bắt đầu")
            setIsSubmitting(false)
            return
        }

        try {
            // Prepare promotion data
            const promotionData = {
                description,
                discount: discountValue,
                startDate,
                endDate,
                quantity: quantityValue,
                code: code.trim() || undefined
            }

            console.log('Updating promotion data:', promotionData)

            // Call API to update promotion
            const response = await promotionService.updatePromotion(parseInt(promotionId), promotionData)

            console.log('Response:', response)

            if (response.success !== false && response.data) {
                toast.success("Khuyến mãi đã được cập nhật thành công!")
                router.push(`/dashboard/promotions/${promotionId}`)
            } else {
                toast.error(response.message || "Có lỗi xảy ra khi cập nhật khuyến mãi")
            }
        } catch (error: any) {
            console.error("Error updating promotion:", error)

            if (error.errors) {
                // Map validation errors to user-friendly messages
                const errorMap: Record<string, string> = {
                    'description': 'Mô tả',
                    'discount': 'Giảm giá',
                    'startDate': 'Ngày bắt đầu',
                    'endDate': 'Ngày kết thúc',
                    'quantity': 'Số lượng',
                    'code': 'Mã khuyến mãi'
                }

                // Display each error with field name
                Object.entries(error.errors).forEach(([field, messages]) => {
                    const fieldName = errorMap[field] || field
                    const errorMessages = (messages as string[]).join('. ')
                    toast.error(`${fieldName}: ${errorMessages}`)
                })
            } else {
                toast.error(error.message || "Có lỗi xảy ra khi cập nhật khuyến mãi")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Chỉnh sửa khuyến mãi" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <SiteHeader title="Chỉnh sửa khuyến mãi" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/promotions/${promotionId}`)}
                    >
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Chỉnh sửa khuyến mãi</h1>
                        <p className="text-muted-foreground">Cập nhật thông tin chương trình khuyến mãi</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Thông tin cơ bản */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khuyến mãi</CardTitle>
                            <CardDescription>Cập nhật chi tiết chương trình khuyến mãi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả khuyến mãi <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="description"
                                    placeholder="VD: Giảm 20% cho tour Hà Nội - Hạ Long"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="discount">Giảm giá (%) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="discount"
                                        type="number"
                                        placeholder="20"
                                        min="1"
                                        max="100"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Số lượng <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="100"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Ngày bắt đầu <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="startDate"
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Ngày kết thúc <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="endDate"
                                        type="datetime-local"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="code">Mã khuyến mãi (tùy chọn)</Label>
                                <Input
                                    id="code"
                                    placeholder="VD: TRAVEL20"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Để trống nếu không cần mã khuyến mãi
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit buttons */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/promotions/${promotionId}`)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                <>
                                    <IconEdit className="mr-2 h-4 w-4" />
                                    Cập nhật khuyến mãi
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}