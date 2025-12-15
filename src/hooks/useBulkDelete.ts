import { useState } from 'react'
import { toast } from 'sonner'

interface DeleteConfig<T, ID = string|number, R = any> {
    items: T[]
    onSuccess: (deletedIds: string[]) => void
    deleteFunction: (id:ID) => Promise<R>
    getItemId: (item: T) => string
    confirmMessage?: (count: number) => string
    successMessage?: (count: number) => string
    errorMessage?: string
    itemName?: string
}

export function useBulkDelete<T, ID = string|number, R = any>() {
    const [isDeleting, setIsDeleting] = useState(false)

    const deleteItems = async (config: DeleteConfig<T>) => {
        const {
            items,
            onSuccess,
            deleteFunction,
            getItemId,
            confirmMessage,
            successMessage,
            errorMessage,
            itemName = 'mục'
        } = config

        if (items.length === 0) return

        const message = confirmMessage
            ? confirmMessage(items.length)
            : `Bạn có chắc chắn muốn xóa ${items.length} ${itemName} đã chọn?\n\nHành động này không thể hoàn tác.`

        const confirmed = window.confirm(message)

        if (!confirmed) return

        setIsDeleting(true)

        try {
            const deletePromises = items.map(item =>
                deleteFunction(getItemId(item))
            )

            await Promise.all(deletePromises)

            const deletedIds = items.map(item => getItemId(item))
            onSuccess(deletedIds)

            const success = successMessage
                ? successMessage(items.length)
                : `Đã xóa ${items.length} ${itemName} thành công!`

            toast.success(success)
        } catch (error) {
            console.error('Failed to delete items:', error)
            const errorMsg = errorMessage || `Không thể xóa ${itemName}. Vui lòng thử lại.`
            toast.error(errorMsg)
        } finally {
            setIsDeleting(false)
        }
    }

    return { deleteItems, isDeleting }
}
