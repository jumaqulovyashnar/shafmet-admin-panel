import { cn } from '@/lib/utils'

interface PaginationProps {
    page: number
    totalPages: number
    onChange: (page: number) => void
    dateLabel?: string
}

export default function Pagination({ page, totalPages, onChange, dateLabel }: PaginationProps) {
    const getPages = () => {
        const pages: (number | '...')[] = []
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        pages.push(1)
        if (page > 3) pages.push('...')
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i)
        }
        if (page < totalPages - 2) pages.push('...')
        pages.push(totalPages)
        return pages
    }

    return (
        <div className="flex items-center justify-end pt-3 border-t border-gray-100 mt-2 shrink-0">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 font-bold text-lg"
                >‹</button>

                {getPages().map((p, idx) =>
                    p === '...' ? (
                        <span key={`dot-${idx}`} className="w-8 text-center text-gray-400 text-sm font-semibold">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p as number)}
                            className={cn(
                                'w-8 h-8 rounded text-sm font-semibold transition-colors',
                                page === p ? 'bg-[#64b5f6] text-white' : 'text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 font-bold text-lg"
                >›</button>
            </div>
        </div>
    )
}
