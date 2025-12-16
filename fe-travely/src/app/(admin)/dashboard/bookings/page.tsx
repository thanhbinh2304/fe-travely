"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { createBookingColumns } from "./columns"
import { bookingService } from "@/app/services/bookingService"
import { useBulkDelete } from "@/hooks/useBulkDelete"
import { Booking } from "@/types/booking"
import { toast } from "sonner"
import { id } from "zod/v4/locales"

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedRows, setSelectedRows] = useState<Booking[]>([])
    const { deleteItems, isDeleting } = useBulkDelete<Booking>()

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setIsLoading(true)
            const response = await bookingService.adminGetAllBookings({ per_page: 1000 })
            const rawData = response.data as Booking[] | { data?: Booking[] }
            const bookingsData: Booking[] = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData.data)
                    ? rawData.data
                    : []
            setBookings(bookingsData)
        } catch (error) {
            console.error('Error fetching bookings:', error)
            toast.error('Không thể tải danh sách booking')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteSelected = () => {
        deleteItems({
            items: selectedRows,
            deleteFunction: (id) => bookingService.adminDeleteBooking(Number(id)),
            getItemId: (booking) => String(booking.bookingID),
            onSuccess: (deletedIds) => {
                setBookings(prevBookings =>
                    prevBookings.filter(booking => !deletedIds.includes(String(booking.bookingID)))
                )
                setSelectedRows([])
            },
            itemName: 'booking'
        })
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

    function handleDelete(id: number): void {
        throw new Error("Function not implemented.")
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
                        searchPlaceholder="Tìm kiếm theo tên khách hàng..."
                        addNewUrl="/dashboard/bookings/create"
                        addNewLabel="Thêm booking mới"
                        onSelectedRowsChange={setSelectedRows}
                        selectedCount={selectedRows.length}
                        onDeleteSelected={handleDeleteSelected}
                    />
                </div>
            </div>
        </>
    )
}
