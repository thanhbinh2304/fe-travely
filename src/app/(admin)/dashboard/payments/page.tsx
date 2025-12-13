"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { createPaymentColumns } from "./columns"
import { paymentService } from "@/app/services/paymentService"
import { Payment } from "@/types/payment"
import { toast } from "sonner"

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            setIsLoading(true)
            const response = await paymentService.adminGetAllPayments()
            // Response có thể có pagination, lấy data.data nếu có
            const paymentsData = response.data?.data || response.data || []
            setPayments(Array.isArray(paymentsData) ? paymentsData : [])
        } catch (error) {
            console.error('Error fetching payments:', error)
            toast.error('Không thể tải danh sách thanh toán')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (checkoutID: number) => {
        try {
            await paymentService.adminDeletePayment(checkoutID)
            toast.success('Đã xóa payment thành công')
            // Refresh list
            fetchPayments()
        } catch (error: any) {
            console.error('Error deleting payment:', error)
            toast.error(error.message || 'Không thể xóa payment')
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Payments Management" />
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
            <SiteHeader title="Payments Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={createPaymentColumns(handleDelete)}
                        data={payments}
                        searchKey="checkoutID"
                        searchPlaceholder="Tìm kiếm theo mã thanh toán..."
                        addNewUrl="/dashboard/payments/create"
                        addNewLabel="Thêm thanh toán"
                    />
                </div>
            </div>
        </>
    )
}
