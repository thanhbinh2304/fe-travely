"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { createBookingColumns } from "./columns"
import { bookingService } from "@/app/services/bookingService"
import { Booking } from "@/types/booking"
import { toast } from "sonner"

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setIsLoading(true)
            const response = await bookingService.adminGetAllBookings()
            // Response có thể có pagination, lấy data.data nếu có
            const bookingsData = response.data?.data || response.data || []
            setBookings(Array.isArray(bookingsData) ? bookingsData : [])
        } catch (error) {
            console.error('Error fetching bookings:', error)
            toast.error('Không thể tải danh sách booking')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (bookingID: number) => {
        try {
            await bookingService.adminDeleteBooking(bookingID)
            toast.success('Đã xóa booking thành công')
            // Refresh list
            fetchBookings()
        } catch (error: any) {
            console.error('Error deleting booking:', error)
            toast.error(error.message || 'Không thể xóa booking')
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Bookings Management" />
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
            <SiteHeader title="Bookings Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={createBookingColumns(handleDelete)}
                        data={bookings}
                        searchKey="user.userName"
                        searchPlaceholder="Tìm kiếm theo tên khách hàng..."
                        addNewUrl="/dashboard/bookings/create"
                        addNewLabel="Thêm booking mới"
                    />
                </div>
            </div>
        </>
    )
}
