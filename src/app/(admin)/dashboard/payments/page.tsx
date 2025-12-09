import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { paymentColumns } from "./columns"
import { mockPaymentsData } from "./mockPaymentsData"

export default function PaymentsPage() {
    return (
        <>
            <SiteHeader title="Payments Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={paymentColumns}
                        data={mockPaymentsData}
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
