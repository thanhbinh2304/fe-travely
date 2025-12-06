"use client"

import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { TourDetailHeader } from "@/components/admin/TourDetailHeader"
import { TourDetailCards } from "@/components/admin/TourDetailCards"
import { mockToursData } from "../mockToursData"

export default function TourDetailPage() {
    const params = useParams()
    const router = useRouter()
    const tourId = params.id as string

    // Tìm tour theo ID
    const tour = mockToursData.find(t => t.tourID === tourId)

    if (!tour) {
        return (
            <>
                <SiteHeader title="Tour Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Không tìm thấy tour</h2>
                        <p className="text-muted-foreground mb-4">Tour ID: {tourId}</p>
                        <Button onClick={() => router.push('/dashboard/tours')}>
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <SiteHeader title="Chi tiết tour" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <TourDetailHeader tour={tour} />
                <TourDetailCards tour={tour} />
            </div>
        </>
    )
}
