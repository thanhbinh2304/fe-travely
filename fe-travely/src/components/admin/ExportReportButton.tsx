"use client";

import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { statisticService } from "@/app/services/statisticService";

interface ExportReportButtonProps {
    /** Giá trị period có thể có hoặc không */
    period?: string;
    /** API endpoint khác nhau nếu cần */
    endpoint?: string;
    /** Tham số bổ sung */
    limit?: number;
    start_date?: string;
    end_date?: string;
}

export default function ExportReportButton({
    period,
    endpoint = "top-tours", // giá trị mặc định
    limit = 50,
    start_date,
    end_date,
}: ExportReportButtonProps) {
    const handleExport = () => {
        let exportUrl: string;

        switch (endpoint) {
            case "booking-stats":
                exportUrl = statisticService.exportBookingStats({ start_date, end_date });
                break;
            case "top-tours":
                exportUrl = statisticService.exportTopTours({ limit, period: period as any });
                break;
            case "revenue":
                exportUrl = statisticService.exportRevenue({ period: period as any, start_date, end_date });
                break;
            case "user-growth":
                exportUrl = statisticService.exportUserGrowth({ period: period as any, start_date, end_date });
                break;
            case "cancellation-rate":
                // Sử dụng booking-stats cho cancellation rate vì nó bao gồm cancelled
                exportUrl = statisticService.exportBookingStats({ start_date, end_date });
                break;
            default:
                exportUrl = statisticService.exportTopTours({ limit, period: period as any });
        }

        window.open(exportUrl, "_blank");
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={handleExport}
        >
            <IconDownload className="h-4 w-4 mr-1" />
            Xuất báo cáo
        </Button>
    );
}
