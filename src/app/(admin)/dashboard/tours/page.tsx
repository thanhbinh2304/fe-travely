import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { tourColumns } from "./columns"
import { mockToursData } from "./mockToursData"

export default function ToursPage() {
    return (
        <>
            <SiteHeader title="Tours Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={tourColumns}
                        data={mockToursData}
                        searchKey="title"
                        searchPlaceholder="Tìm kiếm theo tên tour..."
                        addNewUrl="/dashboard/tours/create"
                        addNewLabel="Thêm tour mới"
                    />
                </div>
            </div>
        </>
    )
}