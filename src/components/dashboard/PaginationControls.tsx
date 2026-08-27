import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

export function PaginationControls({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationControlsProps) {
    if (totalItems === 0) return null

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    // Generate page numbers
    const pages: number[] = []
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t bg-muted/10 text-sm">
            <p className="text-xs sm:text-sm text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{startItem}</span> -{" "}
                <span className="font-semibold text-foreground">{endItem}</span> dari{" "}
                <span className="font-semibold text-foreground">{totalItems}</span> data
            </p>

            <div className="flex items-center gap-1.5 self-center sm:self-auto">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="h-8 px-2 text-xs gap-1"
                >
                    <ChevronLeft className="size-3.5" /> Prev
                </Button>

                {pages.map((p) => {
                    const isActive = p === currentPage
                    return (
                        <Button
                            key={p}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(p)}
                            className={`h-8 w-8 p-0 text-xs font-semibold ${
                                isActive 
                                    ? "bg-palembang-red text-white hover:bg-palembang-red/90" 
                                    : "hover:bg-muted text-foreground"
                            }`}
                        >
                            {p}
                        </Button>
                    )
                })}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="h-8 px-2 text-xs gap-1"
                >
                    Next <ChevronRight className="size-3.5" />
                </Button>
            </div>
        </div>
    )
}
