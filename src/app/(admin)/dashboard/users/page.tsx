import { SiteHeader } from "@/components/site-header"
import { UsersDataTable } from "./UsersDataTable"
import { userColumns } from "./columns"
import { mockUsersData } from "./mockUsersData"

export default function UsersPage() {
    return (
        <>
            <SiteHeader title="Users Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <UsersDataTable
                        columns={userColumns}
                        data={mockUsersData}
                        searchKey="userName"
                        searchPlaceholder="Tìm kiếm theo tên người dùng..."
                    />
                </div>
            </div>
        </>
    )
}