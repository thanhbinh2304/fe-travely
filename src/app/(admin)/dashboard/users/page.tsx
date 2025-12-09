'use client'

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { GenericDataTable } from "@/components/admin/GenericDataTable"
import { userColumns } from "./columns"
import { userService } from "@/app/services/userService"
import { UserManagement } from "./mockUsersData"
import { useBulkDelete } from "@/hooks/useBulkDelete"

export default function UsersPage() {
    const [usersData, setUsersData] = useState<UserManagement[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRows, setSelectedRows] = useState<UserManagement[]>([])
    const { deleteItems, isDeleting } = useBulkDelete<UserManagement>()

    const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
        setUsersData(prevUsers =>
            prevUsers.map(user =>
                user.userID === userId
                    ? { ...user, status: newStatus }
                    : user
            )
        )
    }

    const handleDeleteSelected = () => {
        deleteItems({
            items: selectedRows,
            deleteFunction: (id) => userService.deleteUser(id),
            getItemId: (user) => user.userID,
            onSuccess: (deletedIds) => {
                setUsersData(prevUsers =>
                    prevUsers.filter(user => !deletedIds.includes(user.userID))
                )
                setSelectedRows([])
            },
            itemName: 'người dùng'
        })
    }

    const handleDeleteOne = (userId: string) => {
        const userToDelete = usersData.find(u => u.userID === userId)
        if (!userToDelete) return

        deleteItems({
            items: [userToDelete],
            deleteFunction: (id) => userService.deleteUser(id),
            getItemId: (user) => user.userID,
            onSuccess: (deletedIds) => {
                setUsersData(prevUsers =>
                    prevUsers.filter(user => !deletedIds.includes(user.userID))
                )
            },
            itemName: 'người dùng',
            confirmMessage: (count) =>
                `Bạn có chắc chắn muốn xóa người dùng "${userToDelete.userName}"?\n\nHành động này không thể hoàn tác.`,
            successMessage: (count) =>
                `Đã xóa người dùng ${userToDelete.userName} thành công!`
        })
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await userService.getAllUsers()

                // Transform User[] to UserManagement[]
                const transformed: UserManagement[] = users.map(user => {
                    // Get role name from role object, fallback to role_id mapping
                    let roleName = 'User'
                    if (user.role?.name) {
                        // Capitalize first letter
                        roleName = user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1)
                    } else if (user.role_id === 1) {
                        roleName = 'Admin'
                    } else if (user.role_id === 2) {
                        roleName = 'User'
                    }

                    return {
                        userID: user.userID,
                        userName: user.userName,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                        role_id: user.role_id || 2,
                        roleName: roleName,
                        status: user.is_active ? 'active' : 'inactive',
                        totalBookings: 0, // TODO: fetch from backend
                        totalSpent: 0, // TODO: fetch from backend
                        createdAt: user.created_at || new Date().toISOString(),
                        lastLogin: user.last_login,
                        verified: user.email_verified,
                    }
                })

                setUsersData(transformed)
            } catch (error) {
                console.error('Failed to fetch users:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (loading) {

        return (
            <>
                <SiteHeader title="Users Management" />
                <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                    <div className="rounded-lg border bg-card p-6">
                        <p>Đang tải...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <SiteHeader title="Users Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-lg border bg-card p-6">
                    <GenericDataTable
                        columns={userColumns(handleStatusChange, handleDeleteOne)}
                        data={usersData}
                        searchKey="userName"
                        searchPlaceholder="Tìm kiếm theo tên người dùng..."
                        onSelectedRowsChange={setSelectedRows}
                        selectedCount={selectedRows.length}
                        onDeleteSelected={handleDeleteSelected}
                    />
                </div>
            </div>
        </>
    )
}