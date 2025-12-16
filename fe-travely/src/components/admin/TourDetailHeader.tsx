"use client"

import { useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconBan } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Tour } from "@/types/tour"

interface TourDetailHeaderProps {
    tour: Tour
}

export function TourDetailHeader({ tour }: TourDetailHeaderProps) {
    const router = useRouter()

    const getStatusBadge = () => {
        if (tour.availability) {
            return (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                    Còn chỗ
                </Badge>
            )
        }
        return (
            <Badge className="bg-red-100 text-red-800 border-red-300">
                Hết chỗ
            </Badge>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/tours')}
            >
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
            </Button>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{tour.title}</h1>
                    {getStatusBadge()}
                </div>
                <p className="text-muted-foreground">ID: #{tour.tourID}</p>
            </div>
            <div className="flex gap-2">
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
            </div>
        </div>
    )
}
