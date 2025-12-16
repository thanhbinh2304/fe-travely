"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { createPromotionColumns } from "./columns"
import { promotionService } from "@/app/services/promotionService"
import { Promotion } from "@/types/promotion"
import { toast } from "sonner"


export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPromotions()
    }, [])

    const fetchPromotions = async () => {
        try {
            setIsLoading(true)
            const response = await promotionService.getPromotions({ per_page: 1000 })
            setPromotions(response.data || [])
        } catch (error) {
            console.error('Error fetching promotions:', error)
            toast.error('Không thể tải danh sách khuyến mãi')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = () => {
        fetchPromotions()
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Quản lý khuyến mãi" />
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
            <SiteHeader title="Quản lý khuyến mãi" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={createPromotionColumns(handleRefresh)}
                        data={promotions}
                        searchKey="description"
                        searchPlaceholder="Tìm kiếm theo mô tả khuyến mãi..."
                        addNewUrl="/dashboard/promotions/create"
                        addNewLabel="Thêm khuyến mãi mới"
                    />
                </div>
            </div>
        </>
    )
}