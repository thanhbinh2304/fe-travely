import { SiteHeader } from "@/components/site-header"
import { ToursDataTable } from "./ToursDataTable"
import { tourColumns } from "./columns"
import { mockToursData } from "./mockToursData"

export default function ToursPage() {
    return (
        <>
            <SiteHeader title="Tours Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <ToursDataTable
                        columns={tourColumns}
                        data={mockToursData}
                        searchKey="title"
                        searchPlaceholder="Tìm kiếm theo tên tour..."
                    />
                </div>
            </div>
        </>
    )
}