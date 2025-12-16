"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GenericDetailHeader } from "@/components/admin/GenericDetailHeader"
import { BookingDetailCards } from "@/components/admin/BookingDetailCards"
import { bookingService } from "@/app/services/bookingService"
import { Booking } from "@/types/booking"
import { toast } from "sonner"

export default function BookingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const bookingId = params.id as string
    const [booking, setBooking] = useState<Booking | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBookingDetail()
    }, [bookingId])

    const fetchBookingDetail = async () => {
        try {
            setIsLoading(true)
            const response = await bookingService.adminGetBookingById(parseInt(bookingId))
            setBooking(response.data)
        } catch (error) {
            console.error('Error fetching booking detail:', error)
            toast.error('Không thể tải thông tin booking')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Chi tiết booking" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                </div>
            </>
        )
    }

    if (!booking) {
        return (
            <>
                <SiteHeader title="Booking Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Không tìm thấy booking</h2>
                        <p className="text-muted-foreground mb-4">Booking ID: {bookingId}</p>
                        <Button onClick={() => router.push('/dashboard/bookings')}>
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    // Payment status badge
    const paymentStatusBadge = (() => {
        switch (booking.paymentStatus) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-800 border-green-300">Đã thanh toán</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Chờ thanh toán</Badge>
            case 'refunded':
                return <Badge className="bg-red-100 text-red-800 border-red-300">Đã hoàn tiền</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Chưa rõ</Badge>
        }
    })()

    // Booking status badge
    const bookingStatusBadge = (() => {
        switch (booking.bookingStatus) {
            case 'confirmed':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-300 ml-2">Đã xác nhận</Badge>
            case 'cancelled':
                return <Badge className="bg-gray-100 text-gray-800 border-gray-300 ml-2">Đã hủy</Badge>
            case 'completed':
                return <Badge className="bg-green-100 text-green-800 border-green-300 ml-2">Hoàn thành</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800 border-gray-300 ml-2">Chưa rõ</Badge>
        }
    })()

    const actions = (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Editing booking...')}
            >
                <IconEdit className="mr-2 h-4 w-4" />
                Chỉnh sửa
            </Button>
            {booking.paymentStatus === 'pending' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                    onClick={() => toast.success(`Xác nhận thanh toán: ${booking.bookingID}`)}
                >
                    <IconCheck className="mr-2 h-4 w-4" />
                    Xác nhận thanh toán
                </Button>
            )}
            {booking.bookingStatus === 'confirmed' && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.warning(`Hủy booking: ${booking.bookingID}`)}
                >
                    <IconX className="mr-2 h-4 w-4" />
                    Hủy booking
                </Button>
            )}
            <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                    if (window.confirm(`Bạn có chắc muốn xóa booking #${booking.bookingID}?`)) {
                        try {
                            await bookingService.adminDeleteBooking(booking.bookingID)
                            toast.success('Đã xóa booking thành công')
                            router.push('/dashboard/bookings')
                        } catch (error: any) {
                            toast.error(error.message || 'Không thể xóa booking')
                        }
                    }
                }}
            >
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa
            </Button>
        </>
    )

    return (
        <>
            <SiteHeader title="Chi tiết booking" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <GenericDetailHeader
                    title={`Booking #${booking.bookingID}`}
                    subtitle={`Khách hàng: ${booking.user?.userName || 'N/A'}`}
                    backUrl="/dashboard/bookings"
                    statusBadge={
                        <div className="flex items-center gap-2">
                            {paymentStatusBadge}
                            {bookingStatusBadge}
                        </div>
                    }
                    actions={actions}
                />
                <BookingDetailCards booking={booking} />
            </div>
        </>
    )
}
