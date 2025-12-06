"use client"

import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconBan } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GenericDetailHeader } from "@/components/admin/GenericDetailHeader"
import { TourDetailCards } from "@/components/admin/TourDetailCards"
import { mockToursData } from "../mockToursData"
import { toast } from "sonner"

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
                onClick={() => toast.success('Editing tour...')}
            >
                <IconEdit className="mr-2 h-4 w-4" />
                Chỉnh sửa
            </Button>
            {tour.availability ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.warning(`Đóng tour: ${tour.title}`)}
                >
                    <IconBan className="mr-2 h-4 w-4" />
                    Đóng tour
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success(`Mở tour: ${tour.title}`)}
                >
                    Mở tour
                </Button>
            )}
            <Button
                variant="destructive"
                size="sm"
                onClick={() => toast.error(`Delete tour: ${tour.title}`)}
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
