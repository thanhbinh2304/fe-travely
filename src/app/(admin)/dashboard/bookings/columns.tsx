"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconEye, IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react"
import { Booking } from "@/types/booking"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Helper function
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

// Actions cell component
function BookingActionsCell({ booking }: { booking: Booking }) {
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <IconDots className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/dashboard/bookings/${booking.bookingID}`)}>
                    <IconEye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Editing booking...')}>
                    <IconEdit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                </DropdownMenuItem>
                {booking.paymentStatus === 'pending' && (
                    <DropdownMenuItem onClick={() => toast.success(`Xác nhận thanh toán: ${booking.bookingID}`)}>
                        <IconCheck className="mr-2 h-4 w-4" />
                        Xác nhận thanh toán
                    </DropdownMenuItem>
                )}
                {booking.bookingStatus === 'confirmed' && (
                    <DropdownMenuItem onClick={() => toast.warning(`Hủy booking: ${booking.bookingID}`)}>
                        <IconX className="mr-2 h-4 w-4" />
                        Hủy booking
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => toast.error(`Delete booking: ${booking.bookingID}`)}
                    className="text-red-600"
                >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Xóa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const bookingColumns: ColumnDef<Booking>[] = [
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
    // {
    //     accessorKey: "bookingID",
    //     header: "Mã booking",
    //     cell: ({ row }) => (
    //         <div className="font-medium">#{row.getValue("bookingID")}</div>
    //     ),
    // },
    {
        accessorKey: "userName",
        header: "Khách hàng",
        cell: ({ row }) => {
            const booking = row.original
            return (
                <div>
                    <div className="font-medium">{booking.userName}</div>
                    <div className="text-sm text-muted-foreground">{booking.userEmail}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "tourTitle",
        header: "Tour",
        cell: ({ row }) => {
            const booking = row.original
            return (
                <div className="max-w-[300px]">
                    <div className="font-medium truncate">{booking.tourTitle}</div>
                    <div className="text-sm text-muted-foreground">{booking.tourDestination}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "bookingDate",
        header: "Ngày khởi hành",
        cell: ({ row }) => formatDate(row.getValue("bookingDate")),
    },
    {
        accessorKey: "numAdults",
        header: "Số người",
        cell: ({ row }) => {
            const adults = row.getValue("numAdults") as number
            const children = row.original.numChildren
            return (
                <div className="text-sm">
                    <div>{adults} người lớn</div>
                    {children > 0 && <div className="text-muted-foreground">{children} trẻ em</div>}
                </div>
            )
        },
    },
    {
        accessorKey: "totalPrice",
        header: "Tổng tiền",
        cell: ({ row }) => (
            <div className="font-semibold text-blue-600">
                {formatCurrency(row.getValue("totalPrice"))}
            </div>
        ),
    },
    {
        accessorKey: "paymentStatus",
        header: "Thanh toán",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string
            const statusMap = {
                completed: { label: "Đã thanh toán", class: "bg-green-100 text-green-800 border-green-300" },
                pending: { label: "Chờ thanh toán", class: "bg-yellow-100 text-yellow-800 border-yellow-300" },
                failed: { label: "Thất bại", class: "bg-red-100 text-red-800 border-red-300" },
            }
            const statusInfo = statusMap[status as keyof typeof statusMap]
            return <Badge className={statusInfo.class}>{statusInfo.label}</Badge>
        },
    },
    {
        accessorKey: "bookingStatus",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("bookingStatus") as string
            const statusMap = {
                confirmed: { label: "Đã xác nhận", class: "bg-blue-100 text-blue-800 border-blue-300" },
                cancelled: { label: "Đã hủy", class: "bg-gray-100 text-gray-800 border-gray-300" },
                completed: { label: "Hoàn thành", class: "bg-green-100 text-green-800 border-green-300" },
            }
            const statusInfo = statusMap[status as keyof typeof statusMap]
            return <Badge className={statusInfo.class}>{statusInfo.label}</Badge>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <BookingActionsCell booking={row.original} />,
    },
]
