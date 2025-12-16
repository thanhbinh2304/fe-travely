'use client'

import { useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function BackToListButton() {
    const router = useRouter()

    return (
        <Button onClick={() => router.push('/dashboard/users')}>
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
        </Button>
    )
}
