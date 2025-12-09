"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { tourColumns } from "./columns"
import { tourService } from "@/app/services/tourService"
import { Tour } from "@/types/tour"
import { toast } from "sonner"

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTours()
    }, [])

    const fetchTours = async () => {
        try {
            setIsLoading(true)
            const data = await tourService.getAllTours()
            setTours(data)
        } catch (error) {
            console.error('Error fetching tours:', error)
            toast.error('Không thể tải danh sách tour')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Tours Management" />
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
            <SiteHeader title="Tours Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={tourColumns}
                        data={tours}
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