"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { IconArrowLeft, IconPlus, IconTrash } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { tourService } from "@/app/services/tourService"
import { Tour } from "@/types/tour"

export default function EditTourPage() {
    const router = useRouter()
    const params = useParams()
    const tourId = params.id as string

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Form states
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [destination, setDestination] = useState("")
    const [priceAdult, setPriceAdult] = useState("")
    const [priceChild, setPriceChild] = useState("")
    const [quantity, setQuantity] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [availability, setAvailability] = useState(true)

    // Images state
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    // Itineraries state
    const [itineraries, setItineraries] = useState([
        { dayNumber: 1, destination: "", activity: "" }
    ])

    // Fetch tour data on mount
    useEffect(() => {
        fetchTourData()
    }, [tourId])

    const fetchTourData = async () => {
        try {
            setIsLoading(true)
            const tour = await tourService.getTourById(tourId)

            // Populate form with existing data
            setTitle(tour.title)
            setDescription(tour.description)
            setDestination(tour.destination)
            setPriceAdult(tour.priceAdult.toString())
            setPriceChild(tour.priceChild.toString())
            setQuantity(tour.quantity.toString())

            // Format dates for input type="date" (YYYY-MM-DD)
            setStartDate(tour.startDate.split('T')[0])
            setEndDate(tour.endDate.split('T')[0])
            setAvailability(tour.availability)


            // Populate existing images
            if (tour.images && tour.images.length > 0) {
                setExistingImages(tour.images.map(img => (img as any).imageURL || img.imageUrl))
            }

            // Populate itineraries if they exist
            if (tour.itineraries && tour.itineraries.length > 0) {
                setItineraries(tour.itineraries.map(item => ({
                    dayNumber: item.dayNumber,
                    destination: item.destination,
                    activity: item.activity
                })))
            }
        } catch (error) {
            console.error('Error fetching tour:', error)
            toast.error('Không thể tải thông tin tour')
            router.push('/dashboard/tours')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddItinerary = () => {
        setItineraries([
            ...itineraries,
            { dayNumber: itineraries.length + 1, destination: "", activity: "" }
        ])
    }

    const handleRemoveItinerary = (index: number) => {
        if (itineraries.length > 1) {
            const newItineraries = itineraries.filter((_, i) => i !== index)
            // Re-number the days
            setItineraries(newItineraries.map((item, idx) => ({
                ...item,
                dayNumber: idx + 1
            })))
        }
    }

    const handleItineraryChange = (index: number, field: string, value: string) => {
        const newItineraries = [...itineraries]
        newItineraries[index] = { ...newItineraries[index], [field]: value }
        setItineraries(newItineraries)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const newFiles = Array.from(files)
            setImageFiles([...imageFiles, ...newFiles])

            // Create preview URLs
            newFiles.forEach((file) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    setImagePreviews((prev) => [...prev, e.target?.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const handleRemoveFileImage = (index: number) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index))
        setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    }

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Validate form
        if (!title || !description || !destination || !priceAdult || !priceChild || !quantity || !startDate || !endDate) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            setIsSubmitting(false)
            return
        }

        try {
            // Prepare tour data
            const tourData: any = {
                title,
                description,
                destination,
                priceAdult: parseFloat(priceAdult),
                priceChild: parseFloat(priceChild),
                quantity: parseInt(quantity),
                startDate,
                endDate,
                availability,
                itineraries: itineraries.filter(item => item.destination && item.activity)
            }

            // Only include images if there are changes
            if (imageFiles.length > 0 || existingImages.length > 0) {
                tourData.images = existingImages;
            }

            // Call API to update tour with new image files
            const response = await tourService.update(tourId, tourData, imageFiles.length > 0 ? imageFiles : undefined)

            if (response.success) {
                toast.success("Tour đã được cập nhật thành công!")
                router.push(`/dashboard/tours/${tourId}`)
            } else {
                toast.error(response.message || "Có lỗi xảy ra khi cập nhật tour")
            }
        } catch (error: any) {
            console.error("Error updating tour:", error)
            console.error("Validation errors:", error.errors)
            if (error.errors) {
                // Handle validation errors from backend
                const errorMessages = Object.values(error.errors).flat().join(", ")
                toast.error(errorMessages as string)
            } else {
                toast.error(error.message || "Có lỗi xảy ra khi cập nhật tour")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <SiteHeader title="Chỉnh sửa tour" />
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <SiteHeader title="Chỉnh sửa tour" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/tours/${tourId}`)}
                    >
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Chỉnh sửa tour</h1>
                        <p className="text-muted-foreground">Cập nhật thông tin chi tiết cho tour du lịch</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Thông tin cơ bản */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                            <CardDescription>Thông tin chung về tour</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Tên tour <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="title"
                                        placeholder="VD: Khám phá Hà Nội - Hạ Long 3N2Đ"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="destination">Điểm đến <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="destination"
                                        placeholder="VD: Hà Nội - Hạ Long"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả tour <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="description"
                                    placeholder="Mô tả chi tiết về tour..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Giá và số lượng */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Giá và số lượng</CardTitle>
                            <CardDescription>Thông tin về giá tour và số chỗ</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="priceAdult">Giá người lớn (VNĐ) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="priceAdult"
                                        type="number"
                                        placeholder="3500000"
                                        value={priceAdult}
                                        onChange={(e) => setPriceAdult(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priceChild">Giá trẻ em (VNĐ) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="priceChild"
                                        type="number"
                                        placeholder="2500000"
                                        value={priceChild}
                                        onChange={(e) => setPriceChild(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Số chỗ <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="30"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Thời gian */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thời gian tour</CardTitle>
                            <CardDescription>Ngày bắt đầu và kết thúc</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Ngày bắt đầu <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Ngày kết thúc <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hình ảnh */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hình ảnh</CardTitle>
                            <CardDescription>Quản lý ảnh tour</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Existing images */}
                            {existingImages.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Ảnh hiện tại ({existingImages.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {existingImages.map((image, index) => (
                                            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border">
                                                <img
                                                    src={image}
                                                    alt={`Tour ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleRemoveExistingImage(index)}
                                                >
                                                    <IconTrash className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload new files */}
                            <div className="space-y-2">
                                <Label>Upload ảnh mới</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Chấp nhận: JPG, PNG, GIF, WEBP (tối đa 5MB/ảnh)
                                </p>
                            </div>

                            {/* Preview new uploads */}
                            {imagePreviews.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Ảnh mới ({imagePreviews.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-green-500">
                                                <img
                                                    src={preview}
                                                    alt={`New ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleRemoveFileImage(index)}
                                                >
                                                    <IconTrash className="h-3 w-3" />
                                                </Button>
                                                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                                    Mới
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Lịch trình */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch trình tour</CardTitle>
                            <CardDescription>Thêm lịch trình chi tiết cho từng ngày</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {itineraries.map((itinerary, index) => (
                                <div key={index} className="space-y-4 p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">Ngày {index + 1}</h4>
                                        {itineraries.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItinerary(index)}
                                            >
                                                <IconTrash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Điểm đến</Label>
                                            <Input
                                                placeholder="VD: Hà Nội"
                                                value={itinerary.destination}
                                                onChange={(e) => handleItineraryChange(index, 'destination', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Hoạt động</Label>
                                            <Textarea
                                                placeholder="Mô tả hoạt động trong ngày..."
                                                value={itinerary.activity}
                                                onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddItinerary}
                                className="w-full"
                            >
                                <IconPlus className="mr-2 h-4 w-4" />
                                Thêm ngày
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Trạng thái */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Trạng thái</CardTitle>
                            <CardDescription>Cấu hình trạng thái tour</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Tour có sẵn để đặt</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Cho phép khách hàng đặt tour này
                                    </p>
                                </div>
                                <Switch
                                    checked={availability}
                                    onCheckedChange={setAvailability}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/tours/${tourId}`)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật tour"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}
