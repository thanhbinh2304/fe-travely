"use client"

import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconEdit, IconTrash, IconBan } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GenericDetailHeader } from "@/components/admin/GenericDetailHeader"
import { UserDetailCards } from "@/components/admin/UserDetailCards"
import { mockUsersData } from "../mockUsersData"
import { toast } from "sonner"

export default function UserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const userId = params.id as string

    // Tìm user theo ID
    const user = mockUsersData.find(u => u.userID === userId)

    if (!user) {
        return (
            <>
                <SiteHeader title="User Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Không tìm thấy người dùng</h2>
                        <p className="text-muted-foreground mb-4">User ID: {userId}</p>
                        <Button onClick={() => router.push('/dashboard/users')}>
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách
                        </Button>
                    </div>
                </div>
            </>
        )
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

    const statusBadge = (
        <Badge className={getRoleColor(user.role_id)}>
            {user.roleName}
        </Badge>
    )

    const actions = (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Editing user...')}
            >
                <IconEdit className="mr-2 h-4 w-4" />
                Chỉnh sửa
            </Button>
            {user.status === 'banned' ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success(`Unban ${user.userName}`)}
                >
                    Gỡ ban
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.warning(`Ban ${user.userName}`)}
                >
                    <IconBan className="mr-2 h-4 w-4" />
                    Ban
                </Button>
            )}
            <Button
                variant="destructive"
                size="sm"
                onClick={() => toast.error(`Delete ${user.userName}`)}
            >
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa
            </Button>
        </>
    )

    return (
        <>
            <SiteHeader title="Chi tiết người dùng" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <GenericDetailHeader
                    title={user.userName}
                    subtitle={`ID: #${user.userID}`}
                    backUrl="/dashboard/users"
                    statusBadge={statusBadge}
                    actions={actions}
                />
                <UserDetailCards user={user} />
            </div>
        </>
    )
}
