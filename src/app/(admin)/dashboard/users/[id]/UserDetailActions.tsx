'use client'

import { useState } from "react"
import { IconEdit, IconTrash, IconBan, IconCircleCheckFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { UserDetailResponse, userService } from "@/app/services/userService"

interface UserDetailActionsProps {
    user: UserDetailResponse
    onStatusChange?: (newStatus: 'active' | 'inactive') => void
}

export function UserDetailActions({ user, onStatusChange }: UserDetailActionsProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleToggleStatus = async () => {
        const action = user.details.status === 'inactive' ? 'gỡ ban' : 'ban'
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn ${action} người dùng "${user.details.userName}"?\n\n` +
            `Hành động này sẽ ${user.details.status === 'inactive' ? 'mở khóa tài khoản và cho phép người dùng đăng nhập trở lại' : 'khóa tài khoản và ngăn người dùng đăng nhập'}.`
        )

        if (!confirmed) return

        setIsLoading(true)
        try {
            await userService.toggleAccountStatus(user.details.userID)
            const newStatus = user.details.status === 'inactive' ? 'active' : 'inactive'
            toast.success(`Đã ${action} người dùng ${user.details.userName} thành công!`)

            // Update local state instead of reload
            if (onStatusChange) {
                onStatusChange(newStatus)
            }
        } catch (error) {
            console.error('Error toggling user status:', error)
            toast.error(`Không thể ${action} người dùng. Vui lòng thử lại.`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Editing user...')}
                disabled={isLoading}
            >
                <IconEdit className="mr-2 h-4 w-4" />
                Chỉnh sửa
            </Button>
            {user.details.status === 'inactive' ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                >
                    <IconCircleCheckFilled className="mr-2 h-4 w-4" />
                    {isLoading ? 'Đang xử lý...' : 'Gỡ ban'}
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                >
                    <IconBan className="mr-2 h-4 w-4" />
                    {isLoading ? 'Đang xử lý...' : 'Ban người dùng'}
                </Button>
            )}
            <Button
                variant="destructive"
                size="sm"
                onClick={() => toast.error(`Delete ${user.details.userName}`)}
                disabled={isLoading}
            >
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa
            </Button>
        </>
    )
}
