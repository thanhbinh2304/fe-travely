"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import {
    IconDotsVertical,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconStar,
    IconEye,
    IconEdit,
    IconTrash,
    IconBan,
    IconCheck,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tour } from "@/types/tour"

// Helper functions
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(dateString))
}

const getAvailabilityBadge = (availability: boolean) => {
    if (availability) {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <IconCircleCheckFilled className="w-3 h-3 mr-1" />
                Còn chỗ
            </Badge>
        )
    }
    return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <IconCircleXFilled className="w-3 h-3 mr-1" />
            Hết chỗ
        </Badge>
    )
}

export const tourColumns: ColumnDef<Tour>[] = [
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
        accessorKey: "title",
        header: "Tên tour",
        cell: ({ row }) => (
            <div className="max-w-[300px]">
                <div className="font-medium truncate">{row.original.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <IconEye className="w-3 h-3" />
                    {row.original.totalReviews || 0} đánh giá
                </div>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "destination",
        header: "Điểm đến",
        cell: ({ row }) => (
            <div className="text-sm">{row.original.destination}</div>
        ),
    },
    {
        accessorKey: "priceAdult",
        header: () => <div className="text-right">Giá người lớn</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium">
                {formatCurrency(row.original.priceAdult)}
            </div>
        ),
    },
    {
        accessorKey: "priceChild",
        header: () => <div className="text-right">Giá trẻ em</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium text-muted-foreground">
                {formatCurrency(row.original.priceChild)}
            </div>
        ),
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center">Số chỗ</div>,
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.original.quantity}
            </div>
        ),
    },
    {
        accessorKey: "averageRating",
        header: "Đánh giá",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <IconStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{row.original.averageRating || 0}</span>
            </div>
        ),
    },
    {
        accessorKey: "availability",
        header: "Trạng thái",
        cell: ({ row }) => getAvailabilityBadge(row.original.availability),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => <TourActionsCell tour={row.original} />,
    },
]

// Component riêng cho actions
function TourActionsCell({ tour }: { tour: Tour }) {
    const router = useRouter()

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
                        router.push(`/dashboard/tours/${tour.tourID}`)
                    }}
                >
                    <IconEye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        toast.success(`Editing tour: ${tour.title}`)
                    }}
                >
                    <IconEdit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {tour.availability ? (
                    <DropdownMenuItem
                        onClick={() => {
                            toast.warning(`Đóng tour: ${tour.title}`)
                        }}
                        className="text-orange-600"
                    >
                        <IconBan className="mr-2 h-4 w-4" />
                        Đóng tour
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={() => {
                            toast.success(`Mở tour: ${tour.title}`)
                        }}
                    >
                        <IconCheck className="mr-2 h-4 w-4" />
                        Mở tour
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={() => {
                        toast.error(`Deleted tour: ${tour.title}`)
                    }}
                    className="text-red-600"
                >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Xóa tour
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
