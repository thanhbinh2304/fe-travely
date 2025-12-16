"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconBan } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GenericDetailHeader } from "@/components/admin/GenericDetailHeader"
import { TourDetailCards } from "@/components/admin/TourDetailCards"
import { tourService } from "@/app/services/tourService"
import { Tour } from "@/types/tour"
import { toast } from "sonner"

export default function TourDetailPage() {
    const params = useParams()
    const router = useRouter()
    const tourId = params.id as string

    const [tour, setTour] = useState<Tour | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTourDetail()
    }, [tourId])

    const fetchTourDetail = async () => {
        try {
            setIsLoading(true)
            const data = await tourService.getTourById(tourId)
            setTour(data)
        } catch (error) {
            console.error('Error fetching tour:', error)
            toast.error('Không thể tải thông tin tour')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleAvailability = async () => {
        if (!tour) return

        try {
            await tourService.toggleAvailability(tourId)
            // Fetch lại tour đầy đủ để có images và itineraries
            await fetchTourDetail()
            toast.success(!tour.availability ? 'Đã mở tour' : 'Đã đóng tour')
        } catch (error) {
            console.error('Error toggling availability:', error)
            toast.error('Không thể thay đổi trạng thái tour')
        }
    }

    const handleDelete = async () => {
        if (!tour) return

        if (!confirm(`Bạn có chắc chắn muốn xóa tour "${tour.title}"?`)) {
            return
        }

        try {
            await tourService.deleteTour(tourId)
            toast.success('Đã xóa tour thành công')
            router.push('/dashboard/tours')
        } catch (error) {
            console.error('Error deleting tour:', error)
            toast.error('Không thể xóa tour')
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Chi tiết tour" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                </div>
            </>
        )
    }

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

    const statusBadge = tour.availability ? (
        <Badge className="bg-green-100 text-green-800 border-green-300">
            Còn chỗ
        </Badge>
    ) : (
        <Badge className="bg-red-100 text-red-800 border-red-300">
            Hết chỗ
        </Badge>
    )

    const actions = (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/tours/${tourId}/edit`)}
            >
                <IconEdit className="mr-2 h-4 w-4" />
                Chỉnh sửa
            </Button>
            {tour.availability ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleAvailability}
                >
                    <IconBan className="mr-2 h-4 w-4" />
                    Đóng tour
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleAvailability}
                >
                    Mở tour
                </Button>
            )}
            <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
            >
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa
            </Button>
        </>
    )

    return (
        <>
            <SiteHeader title="Chi tiết tour" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <GenericDetailHeader
                    title={tour.title}
                    subtitle={`ID: #${tour.tourID}`}
                    backUrl="/dashboard/tours"
                    statusBadge={statusBadge}
                    actions={actions}
                />
                <TourDetailCards tour={tour} />
            </div>
        </>
    )
}
