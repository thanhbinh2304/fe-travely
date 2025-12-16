"use client"

// Promotion columns for admin dashboard - recreated

import * as React from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import {
    IconDotsVertical,
    IconEye,
    IconEdit,
    IconTrash,
    IconTag,
    IconCalendar,
    IconPercentage,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Promotion } from "@/types/promotion"
import { promotionService } from "@/app/services/promotionService"
import { Checkbox } from "@/components/ui/checkbox"

// Helper functions
const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
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

export function createPromotionColumns(onRefresh: () => void): ColumnDef<Promotion>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "description",
            header: "Mô tả khuyến mãi",
            cell: ({ row }) => (
                <div className="max-w-[300px]">
                    <div className="font-medium truncate">{row.original.description}</div>
                    {row.original.code && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <IconTag className="w-3 h-3" />
                            Mã: {row.original.code}
                        </div>
                    )}
                </div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "discount",
            header: () => <div className="text-center">Giảm giá</div>,
            cell: ({ row }) => (
                <div className="text-center font-medium flex items-center justify-center gap-1">
                    <IconPercentage className="w-4 h-4 text-green-600" />
                    {row.original.discount}%
                </div>
            ),
        },
        {
            accessorKey: "startDate",
            header: "Ngày bắt đầu",
            cell: ({ row }) => (
                <div className="text-sm">{formatDate(row.original.startDate)}</div>
            ),
        },
        {
            accessorKey: "endDate",
            header: "Ngày kết thúc",
            cell: ({ row }) => (
                <div className="text-sm">{formatDate(row.original.endDate)}</div>
            ),
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-center">Số lượng</div>,
            cell: ({ row }) => (
                <div className="text-center font-medium">
                    {row.original.quantity}
                </div>
            ),
        },
        {
            id: "status",
            header: "Trạng thái",
            cell: ({ row }) => getStatusBadge(row.original),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => <PromotionActionsCell promotion={row.original} onRefresh={onRefresh} />,
        },
    ]
}

// Component riêng cho actions
function PromotionActionsCell({ promotion, onRefresh }: { promotion: Promotion; onRefresh: () => void }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleDelete = async () => {
        if (isLoading) return

        if (!confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${promotion.description}"?`)) {
            return
        }

        try {
            setIsLoading(true)
            await promotionService.deletePromotion(promotion.promotionID)
            toast.success('Đã xóa khuyến mãi thành công')
            // Refresh data
            onRefresh()
        } catch (error) {
            console.error('Error deleting promotion:', error)
            toast.error('Không thể xóa khuyến mãi')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                    size="icon"
                >
                    <IconDotsVertical />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => {
                        router.push(`/dashboard/promotions/${promotion.promotionID}`)
                    }}
                >
                    <IconEye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        router.push(`/dashboard/promotions/${promotion.promotionID}/edit`)
                    }}
                >
                    <IconEdit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-red-600"
                >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Xóa khuyến mãi
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}