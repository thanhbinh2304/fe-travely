'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { GenericDetailHeader } from "@/components/admin/GenericDetailHeader"
import { UserDetailCards } from "@/components/admin/UserDetailCards"
import { userService, UserDetailResponse } from "@/app/services/userService"
import { UserDetailActions } from "./UserDetailActions"
import { BackToListButton } from "./BackToListButton"

export default function UserDetailPage() {
    const params = useParams()
    const userId = params.id as string

    const [user, setUser] = useState<UserDetailResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userService.getUserById(userId)
                setUser(userData)
            } catch (err) {
                console.error('Failed to fetch user:', err)
                setError('Không thể tải thông tin người dùng')
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [userId])

    if (loading) {
        return (
            <>
                <SiteHeader title="Chi tiết người dùng" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                </div>
            </>
        )
    }

    if (error || !user) {
        return (
            <>
                <SiteHeader title="User Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Không tìm thấy người dùng</h2>
                        <p className="text-muted-foreground mb-4">{error || `User ID: ${userId}`}</p>
                        <BackToListButton />
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

    const handleStatusChange = (newStatus: 'active' | 'inactive') => {
        setUser(prev => {
            if (!prev) return prev
            return {
                ...prev,
                details: {
                    ...prev.details,
                    status: newStatus
                }
            }
        })
    }

    const statusBadge = (
        <Badge className={getRoleColor(user.details.role_id)}>
            {user.roleName}
        </Badge>
    )

    return (
        <>
            <SiteHeader title="Chi tiết người dùng" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <GenericDetailHeader
                    title={user.details.userName}
                    subtitle={`ID: #${user.details.userID}`}
                    backUrl="/dashboard/users"
                    statusBadge={statusBadge}
                    actions={<UserDetailActions user={user} onStatusChange={handleStatusChange} />}
                />
                <UserDetailCards user={user} />
            </div>
        </>
    )
}
