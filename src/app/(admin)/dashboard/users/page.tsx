import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { userColumns } from "./columns"
import { mockUsersData } from "./mockUsersData"

export default function UsersPage() {
    return (
        <>
            <SiteHeader title="Users Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={userColumns}
                        data={mockUsersData}
                        searchKey="userName"
                        searchPlaceholder="Tìm kiếm theo tên người dùng..."
                        addNewUrl="/dashboard/users/create"
                        addNewLabel="Thêm người dùng"
                    />
                </div>
            </div>
        </>
    )
}