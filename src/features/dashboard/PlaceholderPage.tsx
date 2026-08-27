"use client"

export function PlaceholderPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="rounded-[1.5rem] border bg-background p-8 text-center text-muted-foreground">
                <p>Halaman ini sedang dalam pengembangan.</p>
            </div>
        </div>
    )
}