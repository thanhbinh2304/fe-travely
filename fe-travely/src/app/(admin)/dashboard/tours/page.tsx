"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { createTourColumns } from "./columns"
import { tourService } from "@/app/services/tourService"
import { useBulkDelete } from "@/hooks/useBulkDelete"
import { Tour } from "@/types/tour"
import { toast } from "sonner"

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedRows, setSelectedRows] = useState<Tour[]>([])
    const { deleteItems, isDeleting } = useBulkDelete<Tour>()

    useEffect(() => {
        fetchTours()
    }, [])

    const fetchTours = async () => {
        try {
            setIsLoading(true)
            const data = await tourService.getAllTours({ per_page: 1000 })
            setTours(data)
        } catch (error) {
            console.error('Error fetching tours:', error)
            toast.error('Không thể tải danh sách tour')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteSelected = () => {
        deleteItems({
            items: selectedRows,
            deleteFunction: (id) => tourService.deleteTour(id.toString()),
            getItemId: (tour) => tour.tourID,
            onSuccess: (deletedIds) => {
                setTours(prevTours =>
                    prevTours.filter(tour => !deletedIds.includes(tour.tourID))
                )
                setSelectedRows([])
            },
            itemName: 'tour'
        })
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Quản lý tour du lịch" />
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

    function handleRefresh(): void {
        throw new Error("Function not implemented.")
    }

    return (
        <>
            <SiteHeader title="Quản lý tour du lịch" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={createTourColumns(handleRefresh)}
                        data={tours}
                        searchKey="title"
                        searchPlaceholder="Tìm kiếm theo tên tour..."
                        addNewUrl="/dashboard/tours/create"
                        addNewLabel="Thêm tour mới"
                        onSelectedRowsChange={setSelectedRows}
                        selectedCount={selectedRows.length}
                        onDeleteSelected={handleDeleteSelected}
                    />
                </div>
            </div>
        </>
    )
}