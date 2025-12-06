"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconPlus, IconTrash } from "@tabler/icons-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

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

    // Itineraries state
    const [itineraries, setItineraries] = useState([
        { dayNumber: 1, destination: "", activity: "" }
    ])

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

        // Simulate API call
        setTimeout(() => {
            toast.success("Tour đã được tạo thành công!")
            router.push("/dashboard/tours")
        }, 1000)
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
