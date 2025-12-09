"use client"

import { IconCreditCard, IconCalendar, IconCurrencyDong, IconFileText, IconClock, IconReceipt, IconRefresh } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Payment } from "@/types/payment"

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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString))
}

const getPaymentMethodName = (method: string) => {
    const methodMap: Record<string, string> = {
        credit_card: 'Thẻ tín dụng',
        debit_card: 'Thẻ ghi nợ',
        bank_transfer: 'Chuyển khoản ngân hàng',
        e_wallet: 'Ví điện tử',
        cash: 'Tiền mặt',
        qr_code: 'QR Code',
    }
    return methodMap[method] || method
}

interface PaymentDetailCardsProps {
    payment: Payment
}

export function PaymentDetailCards({ payment }: PaymentDetailCardsProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Thông tin cơ bản */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin thanh toán</CardTitle>
                        <CardDescription>Chi tiết về giao dịch</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconReceipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Mã thanh toán</p>
                                <p className="text-sm font-semibold">#{payment.checkoutID}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Mã booking</p>
                                <p className="text-sm">#{payment.bookingID}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconCreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Phương thức</p>
                                <p className="text-sm font-semibold">{getPaymentMethodName(payment.paymentMethod)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Số tiền */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin số tiền</CardTitle>
                        <CardDescription>Chi tiết về giá trị giao dịch</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tổng tiền</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(payment.amount)}
                                </p>
                            </div>
                        </div>
                        {payment.refundAmount && (
                            <>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <IconRefresh className="h-5 w-5 text-orange-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Số tiền hoàn</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {formatCurrency(payment.refundAmount)}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Còn lại</p>
                                        <p className="text-xl font-semibold text-green-600">
                                            {formatCurrency(payment.amount - payment.refundAmount)}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Mã giao dịch */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mã giao dịch</CardTitle>
                        <CardDescription>Thông tin từ cổng thanh toán</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                                <p className="text-sm font-mono">
                                    {payment.transactionID || 'Chưa có'}
                                </p>
                            </div>
                        </div>
                        {payment.qrCode && (
                            <>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">QR Code</p>
                                        <p className="text-sm font-mono">{payment.qrCode}</p>
                                    </div>
                                </div>
                            </>
                        )}
                        {payment.paymentData && (
                            <>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Payment Data</p>
                                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                            {payment.paymentData}
                                        </pre>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Thông tin thời gian */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin thời gian</CardTitle>
                    <CardDescription>Lịch sử giao dịch</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-3">
                            <IconClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                                <p className="text-sm">
                                    {payment.createdAt ? formatDateTime(payment.createdAt) : '-'}
                                </p>
                            </div>
                        </div>
                        {payment.paymentDate && (
                            <div className="flex items-start gap-3">
                                <IconCalendar className="h-5 w-5 text-green-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Ngày thanh toán</p>
                                    <p className="text-sm font-semibold text-green-700">
                                        {formatDateTime(payment.paymentDate)}
                                    </p>
                                </div>
                            </div>
                        )}
                        {payment.refundDate && (
                            <div className="flex items-start gap-3">
                                <IconRefresh className="h-5 w-5 text-orange-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Ngày hoàn tiền</p>
                                    <p className="text-sm font-semibold text-orange-700">
                                        {formatDateTime(payment.refundDate)}
                                    </p>
                                </div>
                            </div>
                        )}
                        {payment.updatedAt && (
                            <div className="flex items-start gap-3">
                                <IconClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                                    <p className="text-sm">{formatDateTime(payment.updatedAt)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Thông tin hoàn tiền */}
            {(payment.refundAmount || payment.refundReason) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin hoàn tiền</CardTitle>
                        <CardDescription>Chi tiết về việc hoàn tiền</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {payment.refundReason && (
                                <div className="flex items-start gap-3">
                                    <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Lý do hoàn tiền</p>
                                        <p className="text-sm">{payment.refundReason}</p>
                                    </div>
                                </div>
                            )}
                            {payment.refundBy && (
                                <div className="flex items-start gap-3">
                                    <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Người xử lý</p>
                                        <p className="text-sm font-semibold">{payment.refundBy}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
