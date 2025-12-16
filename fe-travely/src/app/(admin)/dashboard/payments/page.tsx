"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { createPaymentColumns } from "./columns"
import { paymentService } from "@/app/services/paymentService"
import { useBulkDelete } from "@/hooks/useBulkDelete"
import { Payment } from "@/types/payment"
import { toast } from "sonner"

export default function PaymentsPage() {

  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<Payment[]>([])
  const { deleteItems, isDeleting } = useBulkDelete<Payment, string>()


  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      const response = await paymentService.adminGetAllPayments({ per_page: 1000 })

      // nếu API trả { data: Payment[] }
      const paymentsData = response.data?.data || [];
      setPayments(paymentsData)
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Không thể tải danh sách thanh toán")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleDeleteSelected = () => {
    deleteItems({
      items: selectedRows,
      deleteFunction: (id) => paymentService.adminDeletePayment(Number(id)),
      getItemId: (payment) => payment.checkoutID, // checkoutID là string
      onSuccess: (deletedIds) => {
        setPayments((prev) =>
          prev.filter((payment) => !deletedIds.includes(payment.checkoutID))
        )
        setSelectedRows([])
      },
      itemName: "thanh toán",
    })
  }

  if (isLoading) {
    return (
      <>
        <SiteHeader title="Quản lý thanh toán" />
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
      <SiteHeader title="Quản lý thanh toán" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="rounded-lg border bg-card p-6">
          <GenericDataTable
            columns={createPaymentColumns()}
            data={payments} //
            searchKey="checkoutID"
            searchPlaceholder="Tìm kiếm theo mã thanh toán..."
            addNewUrl="/dashboard/payments/create"
            addNewLabel="Thêm thanh toán"
            onSelectedRowsChange={setSelectedRows}
            selectedCount={selectedRows.length}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </div>
    </>
  )
}
