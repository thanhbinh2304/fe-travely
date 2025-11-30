import { SiteHeader } from "@/components/site-header"

export default function BookingsPage() {
    return (
        <>
            <SiteHeader title="Bookings Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Bookings Management</h1>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">Bookings management content coming soon...</p>
                </div>
            </div>
        </>
    )
}
