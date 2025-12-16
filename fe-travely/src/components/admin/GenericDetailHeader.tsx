"use client"

import { useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface GenericDetailHeaderProps {
    title: string
    subtitle?: string
    backUrl: string
    statusBadge?: ReactNode
    actions?: ReactNode
}

export function GenericDetailHeader({
    title,
    subtitle,
    backUrl,
    statusBadge,
    actions
}: GenericDetailHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(backUrl)}
            >
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
            </Button>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {statusBadge}
                </div>
                {subtitle && (
                    <p className="text-muted-foreground">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex gap-2">
                    {actions}
                </div>
            )}
        </div>
    )
}
