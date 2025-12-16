"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import {
    IconDotsVertical,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconShieldCheck,
    IconUser,
    IconCrown,
    IconAlertCircle,
    IconEye,
    IconEdit,
    IconTrash,
    IconBan,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserManagement } from "./mockUsersData"

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
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString))
}

const getRoleIcon = (roleId: number) => {
    switch (roleId) {
        case 1:
            return <IconCrown className="w-4 h-4 text-yellow-500" />
        case 3:
            return <IconShieldCheck className="w-4 h-4 text-blue-500" />
        default:
            return <IconUser className="w-4 h-4 text-gray-500" />
    }
}

const getRoleBadgeVariant = (roleId: number) => {
    switch (roleId) {
        case 1:
            return "default" // Admin
        case 3:
            return "secondary" // Tour Guide
        default:
            return "outline" // User
    }
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <IconCircleCheckFilled className="w-3 h-3 mr-1" />
                    Active
                </Badge>
            )
        case 'inactive':
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    <IconAlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                </Badge>
            )
        case 'banned':
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <IconCircleXFilled className="w-3 h-3 mr-1" />
                    Banned
                </Badge>
            )
        default:
            return status
    }
}

export const userColumns = (
    onStatusChange?: (userId: string, newStatus: 'active' | 'inactive') => void,
    onDelete?: (userId: string) => void
): ColumnDef<UserManagement>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "userName",
            header: "Tên người dùng",
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.userName}</div>
                    <div className="text-xs text-muted-foreground">{row.original.email}</div>
                </div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "phoneNumber",
            header: "Số điện thoại",
            cell: ({ row }) => (
                <div className="text-sm">{row.original.phoneNumber || 'N/A'}</div>
            ),
        },
        {
            accessorKey: "address",
            header: "Địa chỉ",
            cell: ({ row }) => (
                <div className="text-sm max-w-[200px] truncate">
                    {row.original.address || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "roleName",
            header: "Vai trò",
            cell: ({ row }) => (
                <Badge variant={getRoleBadgeVariant(row.original.role_id)}>
                    <span className="mr-1">{getRoleIcon(row.original.role_id)}</span>
                    {row.original.roleName}
                </Badge>
            ),
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => getStatusBadge(row.original.status),
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => <UserActionsCell user={row.original} onStatusChange={onStatusChange} onDelete={onDelete} />,
        },
    ]

// Component riêng cho actions để sử dụng hooks
function UserActionsCell({ user, onStatusChange, onDelete }: {
    user: UserManagement,
    onStatusChange?: (userId: string, newStatus: 'active' | 'inactive') => void,
    onDelete?: (userId: string) => void
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleToggleStatus = async () => {
        // Show confirmation dialog
        const action = user.status === 'inactive' ? 'gỡ ban' : 'ban'
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn ${action} người dùng "${user.userName}"?\n\n` +
            `Hành động này sẽ ${user.status === 'inactive' ? 'mở khóa tài khoản và cho phép người dùng đăng nhập trở lại' : 'khóa tài khoản và ngăn người dùng đăng nhập'}.`
        )

        if (!confirmed) return

        setIsLoading(true)

        try {
            const { userService } = await import('@/app/services/userService')
            const result = await userService.toggleAccountStatus(user.userID)

            const newStatus = user.status === 'inactive' ? 'active' : 'inactive'
            toast.success(`Đã ${action} người dùng ${user.userName} thành công!`)

            // Update local state instead of reload
            onStatusChange?.(user.userID, newStatus)
        } catch (error) {
            console.error('[handleToggleStatus] Error:', error)
            toast.error(`Không thể ${action} người dùng. Vui lòng thử lại.`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = () => {
        onDelete?.(user.userID)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                    size="icon"
                    disabled={isLoading}
                >
                    <IconDotsVertical />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault()
                        router.push(`/dashboard/users/${user.userID}`)
                    }}
                    disabled={isLoading}
                >
                    <IconEye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.status === 'inactive' ? (
                    <DropdownMenuItem asChild>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleToggleStatus()
                            }}
                            disabled={isLoading}
                            className="w-full"
                        >
                            <IconCircleCheckFilled className="mr-2 h-4 w-4" />
                            {isLoading ? 'Đang xử lý...' : 'Gỡ ban'}
                        </button>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem asChild>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleToggleStatus()
                            }}
                            disabled={isLoading}
                            className="w-full text-orange-600"
                        >
                            <IconBan className="mr-2 h-4 w-4" />
                            {isLoading ? 'Đang xử lý...' : 'Ban người dùng'}
                        </button>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDelete()
                        }}
                        disabled={isLoading}
                        className="w-full text-red-600"
                    >
                        <IconTrash className="mr-2 h-4 w-4" />
                        {isLoading ? 'Đang xóa...' : 'Xóa người dùng'}
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
