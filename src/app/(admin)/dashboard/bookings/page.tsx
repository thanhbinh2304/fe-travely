import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { bookingColumns } from "./columns"
import { mockBookingsData } from "./mockBookingsData"

export default function BookingsPage() {
    return (
        <>
            <SiteHeader title="Bookings Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={bookingColumns}
                        data={mockBookingsData}
                        searchKey="userName"
                        searchPlaceholder="Tìm kiếm theo tên khách hàng..."
                        addNewUrl="/dashboard/bookings/create"
                        addNewLabel="Thêm booking mới"
                    />
                </div>
            </div>
        </>
    )
}
