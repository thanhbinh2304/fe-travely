"use client"

import { useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconBan } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { UserDetailResponse } from "@/app/services/userService"

interface UserDetailHeaderProps {
    user: UserDetailResponse
}

export function UserDetailHeader({ user }: UserDetailHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/users')}
            >
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
            </Button>
            <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.details.userName}</h1>
                <p className="text-muted-foreground">ID: #{user.details.userID}</p>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success('Editing user...')}
                >
                    <IconEdit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                </Button>
                {user.details.status === 'banned' ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success(`Unban ${user.details.userName}`)}
                    >
                        Gỡ ban
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.warning(`Ban ${user.details.userName}`)}
                    >
                        <IconBan className="mr-2 h-4 w-4" />
                        Ban
                    </Button>
                )}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => toast.error(`Delete ${user.details.userName}`)}
                >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Xóa
                </Button>
            </div>
        </div>
    )
}
