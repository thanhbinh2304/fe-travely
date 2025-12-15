"use client"

import { useEffect, useMemo, useState } from "react"
import { IconMail, IconPhone, IconMapPin, IconCalendar, IconClock, IconShoppingBag, IconCurrencyDong, IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserDetailResponse, userService } from "@/app/services/userService"
import { Button } from "@/components/ui/button"

interface UserDetailCardsProps {
    user: UserDetailResponse;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString))
}

const getRoleColor = (roleId: number) => {
    switch (roleId) {
        case 1:
            return "bg-yellow-100 text-yellow-800 border-yellow-300"
        case 3:
            return "bg-blue-100 text-blue-800 border-blue-300"
        default:
            return "bg-gray-100 text-gray-800 border-gray-300"
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return "bg-green-100 text-green-800 border-green-300"
        case 'inactive':
            return "bg-gray-100 text-gray-800 border-gray-300"
        case 'banned':
            return "bg-red-100 text-red-800 border-red-300"
        default:
            return "bg-gray-100 text-gray-800 border-gray-300"
    }
}

export function UserDetailCards({ user }: UserDetailCardsProps) {
    // Booking UI state
    const [bookingsPage, setBookingsPage] = useState<any | null>(null)
    const [loadingBookings, setLoadingBookings] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
    const [search, setSearch] = useState("")

    // Normalize paginated object (accept either direct paginate obj or { bookings: paginate })
    const pag = useMemo(() => {
        if (!bookingsPage) return null
        return bookingsPage.bookings ? bookingsPage.bookings : bookingsPage
    }, [bookingsPage])

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoadingBookings(true)
                const res = await userService.getUserBookings(user.details.userID, {
                    status: statusFilter,
                    per_page: perPage,
                    page,
                })
                // If search is used, fallback to client filtering (backend doesn't support tour title search here)
                setBookingsPage(res)
            } catch (err) {
                console.error('Failed to fetch user bookings', err)
                setBookingsPage(null)
            } finally {
                setLoadingBookings(false)
            }
        }
        fetch()
    }, [user.details.userID, statusFilter, perPage, page])

    // derived list (apply search client-side)
    const bookingsList = useMemo(() => {
        const list = pag?.data || []
        if (!search) return list
        const q = search.toLowerCase()
        return list.filter((b: any) => (b.tour?.title || '').toLowerCase().includes(q))
    }, [pag, search])

    // pagination helpers: show window of pages
    const pageWindow = useMemo(() => {
        const last = pag?.last_page || 1
        const current = pag?.current_page || page
        const radius = 2 // show current +/- radius
        const start = Math.max(1, current - radius)
        const end = Math.min(last, current + radius)
        const arr = []
        for (let i = start; i <= end; i++) arr.push(i)
        return { arr, last, current }
    }, [pag, page])

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cá nhân</CardTitle>
                        <CardDescription>Thông tin cơ bản của người dùng</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconMail className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-sm">{user.details.email}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconPhone className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                                <p className="text-sm">{user.details.phoneNumber || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                                <p className="text-sm">{user.details.address || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Trạng thái tài khoản</CardTitle>
                        <CardDescription>Thông tin về tài khoản và quyền hạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Vai trò</p>
                            <Badge className={getRoleColor(user.details.role_id)}>
                                {user.roleName}
                            </Badge>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Trạng thái</p>
                            <Badge className={getStatusColor(user.details.status)}>
                                {user.details.status === 'active' && <IconCircleCheckFilled className="mr-1 h-3 w-3" />}
                                {user.details.status === 'banned' && <IconCircleXFilled className="mr-1 h-3 w-3" />}
                                {user.details.status === 'active' ? 'Hoạt động' : user.details.status === 'inactive' ? 'Không hoạt động' : 'Bị ban'}
                            </Badge>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Xác thực email</p>
                            <div className="flex items-center gap-2">
                                {user.details.verified ? (
                                    <>
                                        <IconCircleCheckFilled className="h-5 w-5 text-green-500" />
                                        <span className="text-sm">Đã xác thực</span>
                                    </>
                                ) : (
                                    <>
                                        <IconCircleXFilled className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm">Chưa xác thực</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê hoạt động</CardTitle>
                        <CardDescription>Thông tin về hoạt động và giao dịch</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <IconShoppingBag className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tổng số booking</p>
                                <p className="text-2xl font-bold">{user.stats.total_bookings}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tổng chi tiêu</p>
                                <p className="text-2xl font-bold">{formatCurrency(user.stats.total_spent)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Chi tiêu trung bình</p>
                                <p className="text-lg font-semibold">
                                    {user.stats.total_bookings > 0
                                        ? formatCurrency(user.stats.total_spent / user.stats.total_bookings)
                                        : formatCurrency(0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin thời gian</CardTitle>
                    <CardDescription>Lịch sử hoạt động của tài khoản</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <IconCalendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Ngày đăng ký</p>
                                <p className="text-sm">{formatDate(user.details.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <IconClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Lần đăng nhập cuối</p>
                                <p className="text-sm">
                                    {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa từng đăng nhập'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking history with filters and improved pagination */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full gap-4">
                        <div>
                            <CardTitle>Lịch sử booking</CardTitle>
                            <CardDescription>Danh sách các booking của người dùng</CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            <select value={statusFilter || ""} onChange={(e) => { setStatusFilter(e.target.value || undefined); setPage(1); }} className="border rounded px-2 py-1">
                                <option value="">Tất cả</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>

                            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>

                            <input placeholder="Tìm kiếm tour..." value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded px-2 py-1" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingBookings ? (
                        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
                    ) : !pag || (pag.data && pag.data.length === 0) ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <IconShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Chưa có booking</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bookingsList.map((b: any) => (
                                <div key={b.bookingID} className="flex items-center justify-between p-3 border rounded">
                                    <div>
                                        <div className="font-medium">{b.tour?.title || '—'}</div>
                                        <div className="text-sm text-muted-foreground">{new Date(b.bookingDate).toLocaleString('vi-VN')}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm">{b.bookingStatus}</div>
                                        <div className="text-sm font-semibold">{b.invoice?.amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.invoice.amount) : b.totalPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalPrice) : '-'}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Button disabled={page <= 1} onClick={() => setPage(1)}>First</Button>
                                <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>

                                {pageWindow.arr.map((pnum) => (
                                    <button key={pnum} onClick={() => setPage(pnum)} className={`px-3 py-1 rounded ${pnum === page ? 'bg-sky-500 text-white' : 'border'}`}>
                                        {pnum}
                                    </button>
                                ))}

                                <Button disabled={page >= pageWindow.last} onClick={() => setPage((p) => p + 1)}>Next</Button>
                                <Button disabled={page >= pageWindow.last} onClick={() => setPage(pageWindow.last)}>Last</Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground mt-2">Trang {pag.current_page} / {pag.last_page} — Tổng {pag.total} booking</div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
