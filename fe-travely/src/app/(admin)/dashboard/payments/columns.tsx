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
import { IconDots, IconEye, IconEdit, IconTrash, IconCheck, IconRefresh } from "@tabler/icons-react"
import { Payment } from "@/types/payment"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Helper functions
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString))
}

const getPaymentMethodName = (method: string) => {
    const methodMap: Record<string, string> = {
        credit_card: 'Thẻ tín dụng',
        debit_card: 'Thẻ ghi nợ',
        bank_transfer: 'Chuyển khoản',
        e_wallet: 'Ví điện tử',
        cash: 'Tiền mặt',
        qr_code: 'QR Code',
    }
    return methodMap[method] || method
}

// Actions cell component
function PaymentActionsCell({ payment, onDelete }: { payment: Payment, onDelete?: (id: number) => void }) {
    const router = useRouter()

    const handleDelete = async () => {
        if (window.confirm(`Bạn có chắc muốn xóa payment #${payment.checkoutID}?`)) {
            if (onDelete) {
                onDelete(Number(payment.checkoutID))
            }
        }
    }

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
                <DropdownMenuItem onClick={() => router.push(`/dashboard/payments/${payment.checkoutID}`)}>
                    <IconEye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Editing payment...')}>
                    <IconEdit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                </DropdownMenuItem>
                {payment.paymentStatus === 'pending' && (
                    <DropdownMenuItem onClick={() => toast.success(`Xác nhận thanh toán: ${payment.checkoutID}`)}>
                        <IconCheck className="mr-2 h-4 w-4" />
                        Xác nhận thanh toán
                    </DropdownMenuItem>
                )}
                {(payment.paymentStatus === 'completed' || payment.paymentStatus === 'refunded') && (
                    <DropdownMenuItem onClick={() => toast.info(`Xử lý hoàn tiền: ${payment.checkoutID}`)}>
                        <IconRefresh className="mr-2 h-4 w-4" />
                        Hoàn tiền
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Xóa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const paymentColumns: ColumnDef<Payment>[] = [
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
        accessorKey: "checkoutID",
        header: "Mã thanh toán",
        cell: ({ row }) => (
            <div className="font-medium">#{row.getValue("checkoutID")}</div>
        ),
    },
    {
        accessorKey: "bookingID",
        header: "Mã booking",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">#{row.getValue("bookingID")}</div>
        ),
    },
    {
        accessorKey: "paymentMethod",
        header: "Phương thức",
        cell: ({ row }) => {
            const method = row.getValue("paymentMethod") as string
            return (
                <div className="text-sm">
                    {getPaymentMethodName(method)}
                </div>
            )
        },
    },
    {
        accessorKey: "amount",
        header: "Số tiền",
        cell: ({ row }) => (
            <div className="font-semibold text-blue-600">
                {formatCurrency(row.getValue("amount"))}
            </div>
        ),
    },
    {
        accessorKey: "paymentStatus",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string
            const statusMap: Record<string, { label: string; class: string }> = {
                pending: { label: "Chờ thanh toán", class: "bg-yellow-100 text-yellow-800 border-yellow-300" },
                completed: { label: "Đã thanh toán", class: "bg-green-100 text-green-800 border-green-300" },
                failed: { label: "Thất bại", class: "bg-red-100 text-red-800 border-red-300" },
                refunded: { label: "Đã hoàn tiền", class: "bg-gray-100 text-gray-800 border-gray-300" },
                partially_refunded: { label: "Hoàn một phần", class: "bg-orange-100 text-orange-800 border-orange-300" },
            }
            const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800 border-gray-300" }
            return <Badge className={statusInfo.class}>{statusInfo.label}</Badge>
        },
    },
    {
        accessorKey: "transactionID",
        header: "Mã giao dịch",
        cell: ({ row }) => {
            const txnId = row.getValue("transactionID") as string
            return txnId ? (
                <div className="text-sm font-mono">{txnId}</div>
            ) : (
                <div className="text-sm text-muted-foreground">-</div>
            )
        },
    },
    {
        accessorKey: "paymentDate",
        header: "Ngày thanh toán",
        cell: ({ row }) => {
            const date = row.getValue("paymentDate") as string
            return date ? (
                <div className="text-sm">{formatDateTime(date)}</div>
            ) : (
                <div className="text-sm text-muted-foreground">Chưa thanh toán</div>
            )
        },
    },
    {
        accessorKey: "refundAmount",
        header: "Hoàn tiền",
        cell: ({ row }) => {
            const refundAmount = row.original.refundAmount
            return refundAmount ? (
                <div className="text-sm font-semibold text-orange-600">
                    {formatCurrency(refundAmount)}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">-</div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <PaymentActionsCell payment={row.original} />,
    },
]

// Create columns with delete callback
export const createPaymentColumns = (onDelete?: (id: number) => void): ColumnDef<Payment>[] => {
    const columns = [...paymentColumns]
    const actionsIndex = columns.findIndex(col => col.id === 'actions')
    if (actionsIndex !== -1) {
        columns[actionsIndex] = {
            id: "actions",
            cell: ({ row }) => <PaymentActionsCell payment={row.original} onDelete={onDelete} />,
        }
    }
    return columns
}
