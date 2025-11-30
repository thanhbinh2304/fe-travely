import { SiteHeader } from "@/components/site-header"

export default function ToursPage() {
    return (
        <>
            <SiteHeader title="Tours Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Tours Management</h1>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">Tours management content coming soon...</p>
                </div>
            </div>
        </>
    )
}