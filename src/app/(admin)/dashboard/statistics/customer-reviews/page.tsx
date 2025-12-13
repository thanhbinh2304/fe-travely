"use client"

import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconStar, IconStarFilled } from "@tabler/icons-react"

export default function CustomerReviewsPage() {
    return (
        <>
            <SiteHeader title="Báo cáo đánh giá khách hàng" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <IconStarFilled className="h-8 w-8 text-yellow-500" />
                            Báo cáo đánh giá khách hàng
                        </h1>
                        <p className="text-muted-foreground mt-1">Thống kê đánh giá và phản hồi từ khách hàng</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tổng quan đánh giá</CardTitle>
                        <CardDescription>Tính năng đang được phát triển</CardDescription>
                    </CardHeader>
                    <CardContent className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <IconStar key={star} className="h-8 w-8 text-yellow-500" />
                                ))}
                            </div>
                            <p className="text-muted-foreground">
                                Tính năng báo cáo đánh giá khách hàng sẽ sớm được cập nhật
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Bao gồm: Đánh giá trung bình, phân bố đánh giá, bình luận nổi bật
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
