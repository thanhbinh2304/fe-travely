"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChartBar,
  IconCreditCard,
  IconDashboard,
  IconHelp,
  IconMapPin,
  IconReceipt,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/hooks/useAuth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Bảng điều khiển",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Người dùng",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Tour du lịch",
      url: "/dashboard/tours",
      icon: IconMapPin,
    },
    {
      title: "Đặt tour",
      url: "/dashboard/bookings",
      icon: IconReceipt,
    },
    {
      title: "Thanh toán",
      url: "/dashboard/payments",
      icon: IconCreditCard,
    },
    {
      title: "Thống kê",
      url: "/dashboard/statistics",
      icon: IconChartBar,
      items: [
        {
          title: "Báo cáo doanh thu",
          url: "/dashboard/statistics/revenue",
        },
        {
          title: "Báo cáo tours bán chạy",
          url: "/dashboard/statistics/best-selling-tours",
        },
        {
          title: "Báo cáo đánh giá khách hàng",
          url: "/dashboard/statistics/customer-reviews",
        },
        {
          title: "Báo cáo tỷ lệ hủy bookings",
          url: "/dashboard/statistics/cancellation-rate",
        },
        {
          title: "Báo cáo trạng thái booking",
          url: "/dashboard/statistics/booking-status",
        },
        {
          title: "Báo cáo người dùng mới",
          url: "/dashboard/statistics/new-users",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Cài đặt",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Trợ giúp",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Tìm kiếm",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconMapPin className="size-5!" />
                <span className="text-base font-semibold">Travely Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
