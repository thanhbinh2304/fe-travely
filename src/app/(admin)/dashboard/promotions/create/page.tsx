"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconPlus } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { promotionService } from "@/app/services/promotionService"

export default function CreatePromotionPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [description, setDescription] = useState("")
    const [discount, setDiscount] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [quantity, setQuantity] = useState("")
    const [code, setCode] = useState("")

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

            console.log('Submitting promotion data:', promotionData)
            console.log('Data types:', {
                description: typeof description,
                discount: typeof discountValue,
                startDate: typeof startDate,
                endDate: typeof endDate,
                quantity: typeof quantityValue,
                code: typeof code
            })

            // Call API to create promotion
            const response = await promotionService.createPromotion(promotionData)

            console.log('Response:', response)

            if (response.success !== false && response.data) {
                toast.success("Khuyến mãi đã được tạo thành công!")
                router.push("/dashboard/promotions")
            } else {
                toast.error(response.message || "Có lỗi xảy ra khi tạo khuyến mãi")
            }
        } catch (error: any) {
            console.error("Error creating promotion:", error)
            console.error("Error details:", JSON.stringify(error, null, 2))

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
            } else if (error.message) {
                toast.error(error.message)
            } else if (typeof error === 'string') {
                toast.error(error)
            } else if (error.status === 401) {
                toast.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại với tài khoản admin.")
            } else if (error.status === 403) {
                toast.error("Bạn không có quyền admin để thực hiện thao tác này.")
            } else if (error.status === 422) {
                toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.")
            } else if (error.status) {
                toast.error(`Lỗi HTTP ${error.status}: ${error.statusText || 'Unknown error'}`)
            } else {
                toast.error("Có lỗi xảy ra khi tạo khuyến mãi. Vui lòng kiểm tra console để biết chi tiết.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <SiteHeader title="Tạo khuyến mãi mới" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/dashboard/promotions')}
                    >
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Tạo khuyến mãi mới</h1>
                        <p className="text-muted-foreground">Điền thông tin chi tiết cho chương trình khuyến mãi</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Thông tin cơ bản */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khuyến mãi</CardTitle>
                            <CardDescription>Thông tin chi tiết về chương trình khuyến mãi</CardDescription>
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
                            onClick={() => router.push('/dashboard/promotions')}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <IconPlus className="mr-2 h-4 w-4" />
                                    Tạo khuyến mãi
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}