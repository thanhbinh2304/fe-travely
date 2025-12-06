"use client"

import { IconMail, IconPhone, IconMapPin, IconCalendar, IconClock, IconShoppingBag, IconCurrencyDong, IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserManagement } from "@/app/(admin)/dashboard/users/mockUsersData"

// Helper functions
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

interface UserDetailCardsProps {
    user: UserManagement
}

export function UserDetailCards({ user }: UserDetailCardsProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Thông tin cơ bản */}
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
                                <p className="text-sm">{user.email}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconPhone className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                                <p className="text-sm">{user.phoneNumber || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                                <p className="text-sm">{user.address || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Trạng thái tài khoản */}
                <Card>
                    <CardHeader>
                        <CardTitle>Trạng thái tài khoản</CardTitle>
                        <CardDescription>Thông tin về tài khoản và quyền hạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Vai trò</p>
                            <Badge className={getRoleColor(user.role_id)}>
                                {user.roleName}
                            </Badge>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Trạng thái</p>
                            <Badge className={getStatusColor(user.status)}>
                                {user.status === 'active' && <IconCircleCheckFilled className="mr-1 h-3 w-3" />}
                                {user.status === 'banned' && <IconCircleXFilled className="mr-1 h-3 w-3" />}
                                {user.status === 'active' ? 'Hoạt động' : user.status === 'inactive' ? 'Không hoạt động' : 'Bị ban'}
                            </Badge>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Xác thực email</p>
                            <div className="flex items-center gap-2">
                                {user.verified ? (
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

                {/* Thống kê hoạt động */}
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
                                <p className="text-2xl font-bold">{user.totalBookings}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Tổng chi tiêu</p>
                                <p className="text-2xl font-bold">{formatCurrency(user.totalSpent)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <IconCurrencyDong className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Chi tiêu trung bình</p>
                                <p className="text-lg font-semibold">
                                    {user.totalBookings > 0
                                        ? formatCurrency(user.totalSpent / user.totalBookings)
                                        : formatCurrency(0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Thông tin thời gian */}
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
                                <p className="text-sm">{formatDate(user.createdAt)}</p>
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

            {/* Lịch sử booking - placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử booking</CardTitle>
                    <CardDescription>Danh sách các booking gần đây</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <IconShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Chức năng đang được phát triển</p>
                        <p className="text-sm">Lịch sử booking sẽ hiển thị ở đây</p>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
