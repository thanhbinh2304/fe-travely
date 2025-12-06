"use client"

import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { UserDetailHeader } from "@/components/admin/UserDetailHeader"
import { UserDetailCards } from "@/components/admin/UserDetailCards"
import { mockUsersData } from "../mockUsersData"

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

    return (
        <>
            <SiteHeader title="Chi tiết người dùng" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <UserDetailHeader user={user} />
                <UserDetailCards user={user} />
            </div>
        </>
    )
}
