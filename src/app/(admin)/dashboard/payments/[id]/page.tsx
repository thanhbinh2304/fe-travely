"use client"

import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconCheck, IconRefresh } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GenericDetailHeader } from "@/components/admin/GenericDetailHeader"
import { PaymentDetailCards } from "@/components/admin/PaymentDetailCards"
import { mockPaymentsData } from "../mockPaymentsData"
import { toast } from "sonner"

export default function PaymentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const checkoutId = params.id as string

    // Tìm payment theo ID
    const payment = mockPaymentsData.find(p => p.checkoutID === checkoutId)

    if (!payment) {
        return (
            <>
                <SiteHeader title="Payment Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Không tìm thấy thanh toán</h2>
                        <p className="text-muted-foreground mb-4">Payment ID: {checkoutId}</p>
                        <Button onClick={() => router.push('/dashboard/payments')}>
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    // Status badge
    const statusBadge = (() => {
        switch (payment.paymentStatus) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800 border-green-300">Đã thanh toán</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Chờ thanh toán</Badge>
            case 'failed':
                return <Badge className="bg-red-100 text-red-800 border-red-300">Thất bại</Badge>
            case 'refunded':
                return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Đã hoàn tiền</Badge>
            case 'partially_refunded':
                return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Hoàn một phần</Badge>
        }
    })()

    const actions = (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Editing payment...')}
            >
                <IconEdit className="mr-2 h-4 w-4" />
                Chỉnh sửa
            </Button>
            {payment.paymentStatus === 'pending' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                    onClick={() => toast.success(`Xác nhận thanh toán: ${payment.checkoutID}`)}
                >
                    <IconCheck className="mr-2 h-4 w-4" />
                    Xác nhận thanh toán
                </Button>
            )}
            {payment.paymentStatus === 'completed' && !payment.refundAmount && (
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100"
                    onClick={() => toast.info(`Xử lý hoàn tiền: ${payment.checkoutID}`)}
                >
                    <IconRefresh className="mr-2 h-4 w-4" />
                    Hoàn tiền
                </Button>
            )}
            <Button
                variant="destructive"
                size="sm"
                onClick={() => toast.error(`Delete payment: ${payment.checkoutID}`)}
            >
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa
            </Button>
        </>
    )

    return (
        <>
            <SiteHeader title="Chi tiết thanh toán" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <GenericDetailHeader
                    title={`Payment #${payment.checkoutID}`}
                    subtitle={`Booking: #${payment.bookingID}`}
                    backUrl="/dashboard/payments"
                    statusBadge={statusBadge}
                    actions={actions}
                />
                <PaymentDetailCards payment={payment} />
            </div>
        </>
    )
}
