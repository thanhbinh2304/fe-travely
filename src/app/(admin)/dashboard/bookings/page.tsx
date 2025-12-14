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
            const rawData = response.data as Booking[] | { data?: Booking[] }
            const bookingsData: Booking[] = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData.data)
                    ? rawData.data
                    : []
            setBookings(bookingsData)
        } catch (error) {
            console.error('Error fetching bookings:', error)
            toast.error('Kh“ng th? t?i danh s ch booking')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (bookingID: number) => {
        try {
            await bookingService.adminDeleteBooking(bookingID)
            toast.success('Da x¢a booking th…nh c“ng')
            // Refresh list
            fetchBookings()
        } catch (error: any) {
            console.error('Error deleting booking:', error)
            toast.error(error.message || 'Kh“ng th? x¢a booking')
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Đặt tour du lịch" />
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
            <SiteHeader title="Đặt tour du lịch" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={createBookingColumns(handleDelete)}
                        data={bookings}
                        searchKey="user.userName"
                        searchPlaceholder="Tm ki?m theo tˆn kh ch h…ng..."
                        addNewUrl="/dashboard/bookings/create"
                        addNewLabel="Thˆm booking m?i"
                    />
                </div>
            </div>
        </>
    )
}
