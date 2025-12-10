"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconPlus, IconTrash, IconX, IconUpload, IconPhoto } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { tourService } from "@/app/services/tourService"

// Helper to convert HTTP image URLs to HTTPS proxy
const getProxiedImageUrl = (url: string) => {
    if (url.startsWith('http://')) {
        return `/api/image-proxy?url=${encodeURIComponent(url)}`
    }
    return url
}

export default function CreateTourPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

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
    const [images, setImages] = useState<string[]>([])
    const [imageInput, setImageInput] = useState("")
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    // Itineraries state
    const [itineraries, setItineraries] = useState([
        { dayNumber: 1, destination: "", activity: "" }
    ])

    const handleAddImage = () => {
        if (imageInput.trim()) {
            setImages([...images, imageInput.trim()])
            setImageInput("")
        }
    }

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const newFiles = Array.from(files)

            // Validate files
            const maxSize = 5 * 1024 * 1024 // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']

            for (const file of newFiles) {
                if (!allowedTypes.includes(file.type)) {
                    toast.error(`File ${file.name} không đúng định dạng. Chỉ chấp nhận: JPG, PNG, GIF, WEBP`)
                    return
                }
                if (file.size > maxSize) {
                    toast.error(`File ${file.name} quá lớn. Kích thước tối đa: 5MB`)
                    return
                }
            }

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



    const handleAddItinerary = () => {
        setItineraries([
            ...itineraries,
            { dayNumber: itineraries.length + 1, destination: "", activity: "" }
        ])
    }

    const handleRemoveItinerary = (index: number) => {
        if (itineraries.length > 1) {
            setItineraries(itineraries.filter((_, i) => i !== index))
        }
    }

    const handleItineraryChange = (index: number, field: string, value: string) => {
        const newItineraries = [...itineraries]
        newItineraries[index] = { ...newItineraries[index], [field]: value }
        setItineraries(newItineraries)
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
            // Filter out empty or invalid images
            const validImages = images.filter(img => img && img.trim() !== '')

            // Prepare tour data
            const tourData = {
                title,
                description,
                destination,
                priceAdult: parseFloat(priceAdult),
                priceChild: parseFloat(priceChild),
                quantity: parseInt(quantity),
                startDate,
                endDate,
                availability,
                images: validImages.length > 0 ? validImages : undefined,
                itineraries: itineraries.filter(item => item.destination && item.activity)
            }

            console.log('Submitting tour data:', tourData)

            // Call API to create tour with image files
            const response = await tourService.store(tourData, imageFiles)

            console.log('Response:', response)

            if (response.success) {
                toast.success("Tour đã được tạo thành công!")
                router.push("/dashboard/tours")
            } else {
                toast.error(response.message || "Có lỗi xảy ra khi tạo tour")
            }
        } catch (error: any) {
            console.error("Error creating tour:", error)

            if (error.errors) {
                // Map validation errors to user-friendly messages
                const errorMap: Record<string, string> = {
                    'title': 'Tiêu đề',
                    'description': 'Mô tả',
                    'destination': 'Điểm đến',
                    'priceAdult': 'Giá người lớn',
                    'priceChild': 'Giá trẻ em',
                    'quantity': 'Số lượng',
                    'startDate': 'Ngày bắt đầu',
                    'endDate': 'Ngày kết thúc',
                    'availability': 'Trạng thái',
                    'images': 'Hình ảnh',
                    'itineraries': 'Lịch trình'
                }

                // Display each error with field name
                Object.entries(error.errors).forEach(([field, messages]) => {
                    // Handle image file errors (e.g., image_files.0, image_files.1)
                    let fieldName = errorMap[field] || field
                    if (field.startsWith('image_files.')) {
                        const index = field.split('.')[1]
                        fieldName = `Hình ảnh ${parseInt(index) + 1}`
                    }

                    const errorMessages = (messages as string[]).join('. ')
                    toast.error(`${fieldName}: ${errorMessages}`)
                })
            } else {
                toast.error(error.message || "Có lỗi xảy ra khi tạo tour")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <SiteHeader title="Tạo tour mới" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/dashboard/tours')}
                    >
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Tạo tour mới</h1>
                        <p className="text-muted-foreground">Điền thông tin chi tiết cho tour du lịch</p>
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

                    {/* Hình ảnh tour */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hình ảnh tour</CardTitle>
                            <CardDescription>Thêm ảnh minh họa cho tour (URL hoặc upload file)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Danh sách ảnh hiện tại */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-video rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                                                <img
                                                    src={getProxiedImageUrl(image)}
                                                    alt={`Tour image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                                <IconPhoto className="absolute h-12 w-12 text-muted-foreground opacity-30" />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <IconX className="h-4 w-4" />
                                            </Button>
                                            {index === 0 && (
                                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                    Ảnh chính
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Thêm ảnh bằng URL */}
                            <div className="space-y-2">
                                <Label>Thêm ảnh bằng URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddImage()
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddImage}
                                        disabled={!imageInput.trim()}
                                    >
                                        <IconPlus className="h-4 w-4 mr-2" />
                                        Thêm
                                    </Button>
                                </div>
                            </div>

                            {/* Upload file */}
                            <div className="space-y-2">
                                <Label>Hoặc upload file ảnh</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="cursor-pointer"
                                    />
                                    <IconUpload className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Chấp nhận: JPG, PNG, GIF, WEBP (tối đa 5MB/ảnh). Ảnh đầu tiên sẽ là ảnh chính.
                                </p>
                            </div>

                            {/* Preview uploaded files */}
                            {imagePreviews.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Ảnh đã upload ({imagePreviews.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border">
                                                <img
                                                    src={preview}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    onClick={() => handleRemoveFileImage(index)}
                                                >
                                                    <IconX className="h-4 w-4" />
                                                </Button>
                                                {index === 0 && (
                                                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                                        Ảnh chính
                                                    </span>
                                                )}
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
                            onClick={() => router.push('/dashboard/tours')}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang tạo..." : "Tạo tour"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}
