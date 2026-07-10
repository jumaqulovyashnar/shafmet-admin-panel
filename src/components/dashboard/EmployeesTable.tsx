import { useState } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import Pagination from '@/components/ui/pagination'
import type { V1Attendance } from '@/types/inspection'
import { getAbsoluteImageUrl } from '@/lib/api-base-url'

interface EmployeesTableProps {
    attendances: V1Attendance[]
    loading?: boolean
    page?: number
    totalPages?: number
    onPageChange?: (page: number) => void
    search?: string
    onSearchChange?: (search: string) => void
    filter?: string
    onFilterChange?: (filter: string) => void
    filterOptions?: string[]
    onWorkerClick?: (workerId: number) => void
}

const DEFAULT_FILTERS = ['Barchasi', 'Ichki Do\'kon', 'Tashqi Do\'kon', 'Personallar', 'Buxgalterlar']



export default function EmployeesTable({ 
    attendances, 
    loading, 
    page = 1, 
    totalPages = 1, 
    onPageChange,
    search = '',
    onSearchChange,
    filter = 'Barchasi',
    onFilterChange,
    filterOptions,
    onWorkerClick
}: EmployeesTableProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const formatTime = (timeString: string) => {
        if (!timeString || timeString === 'null') return '-'
        
        // Agar faqat vaqt kelsa, masalan "08:30" yoki "08:30:00"
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
            return timeString.substring(0, 5)
        }

        try {
            const date = new Date(timeString)
            if (isNaN(date.getTime())) return '-' // Fix Invalid Date issue
            return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
        } catch {
            return '-'
        }
    }

    const formatDate = (timeString: string) => {
        if (!timeString || timeString === 'null') return '-'
        try {
            const date = new Date(timeString)
            if (isNaN(date.getTime())) return timeString
            return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
        } catch {
            return timeString
        }
    }

    const ITEMS_PER_PAGE = 100
    const paginatedAttendances = attendances.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="bg-white rounded-xl p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">Davomat Tarixi</h3>
                    <p className="text-xs text-[#64b5f6] mt-0.5">barcha davomatlar ({attendances.length} ta)</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <Input
                            placeholder="Qidirish"
                            className="pl-8 h-8 text-xs w-full sm:w-44"
                            value={search}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>
                    {/* Filter dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 h-8 text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            Tanlash: {filter}
                            <ChevronDown size={12} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40 py-1">
                                {(filterOptions || DEFAULT_FILTERS).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => {
                                            onFilterChange?.(f)
                                            setIsDropdownOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${filter === f ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
                <table className="w-full table-fixed min-w-[850px] text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 h-12">
                            <th className="w-[6%] text-left pl-3 py-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Rasm</th>
                            <th className="w-[14%] text-left pl-2 py-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Ism</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Sana</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Kelgan vaqt</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Turi</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Status</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Ketgan vaqt</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Turi</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Status</th>
                            <th className="w-[10%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Umumiy soat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50 h-12">
                                    {Array.from({ length: 10 }).map((_, j) => (
                                        <td key={j} className="py-2 px-2 text-center align-middle">
                                            <Skeleton className="h-4 w-16 mx-auto" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : paginatedAttendances.map((a, idx) => {
                                const avatarUrl = getAbsoluteImageUrl(a.rasm)
 
                                return (
                                    <tr
                                        key={a.id || idx}
                                        onClick={() => a.user && onWorkerClick?.(a.user)}
                                        className="border-b border-gray-50 h-12 hover:bg-[#e3f2fd] transition-colors cursor-pointer"
                                    >
                                        <td className="py-1.5 pl-3 text-left align-middle">
                                            <div className="flex justify-start items-center">
                                                {avatarUrl ? (
                                                    <img
                                                        src={avatarUrl}
                                                        alt={a.ism}
                                                        className="w-7 h-7 rounded-full object-cover border border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                                                        {(a.ism || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-1.5 pl-2 text-left align-middle">
                                            <span className="font-semibold text-gray-800 text-[12px] truncate block max-w-[120px]" title={a.ism || `User #${a.user}`}>
                                                {a.ism || `User #${a.user}`}
                                            </span>
                                        </td>
                                        <td className="py-1.5 px-2 text-gray-500 text-[11px] text-center align-middle">
                                            {formatDate(a.sana)}
                                        </td>
                                        <td className="py-1.5 px-2 text-gray-500 text-[11px] text-center align-middle">
                                            {a.kelgan_vaqt ? formatTime(a.kelgan_vaqt) : '-'}
                                        </td>
                                        <td className="py-1.5 px-2 text-[11px] text-center align-middle">
                                            <div className="flex justify-center items-center">
                                                {a.is_late || a.turi_kirish?.toLowerCase() === 'kechikkan' ? (
                                                    <span className="px-1.5 py-0.5 rounded-full font-medium bg-orange-50 text-orange-700 border border-orange-100 text-[10px]">
                                                        Kechikkan
                                                    </span>
                                                ) : a.turi_kirish ? (
                                                    a.turi_kirish.toLowerCase() === 'kelmagan' ? (
                                                        <span className="px-1.5 py-0.5 rounded-full font-medium bg-red-50 text-red-700 border border-red-100 text-[10px]">
                                                            Kelmagan
                                                        </span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 rounded-full font-medium bg-green-50 text-green-700 border border-green-100 text-[10px]">
                                                            {a.turi_kirish}
                                                        </span>
                                                    )
                                                ) : a.status_kirish === false ? (
                                                    <span className="px-1.5 py-0.5 rounded-full font-medium bg-red-50 text-red-700 border border-red-100 text-[10px]">
                                                        Kelmagan
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-1.5 px-2 text-center align-middle">
                                            <div className="flex justify-center items-center">
                                                {a.status_kirish === true ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                                                        <Check size={12} className="stroke-[3]" />
                                                    </span>
                                                ) : a.status_kirish === false ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">
                                                        <X size={12} className="stroke-[3]" />
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-1.5 px-2 text-gray-500 text-[11px] text-center align-middle">
                                            {a.ketgan_vaqt ? formatTime(a.ketgan_vaqt) : '-'}
                                        </td>
                                        <td className="py-1.5 px-2 text-[11px] text-center align-middle">
                                            <div className="flex justify-center items-center">
                                                {a.turi_chiqish ? (
                                                    <span className="px-1.5 py-0.5 rounded-full font-medium bg-gray-50 text-gray-600 border border-gray-100 text-[10px]">
                                                        {a.turi_chiqish}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-1.5 px-2 text-center align-middle">
                                            <div className="flex justify-center items-center">
                                                {a.status_chiqish === true ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                                                        <Check size={12} className="stroke-[3]" />
                                                    </span>
                                                ) : a.status_chiqish === false ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">
                                                        <X size={12} className="stroke-[3]" />
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-1.5 px-2 text-[11px] text-gray-700 font-semibold text-center align-middle">
                                            {a.umumiy_soat || '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>

            {onPageChange && totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
                </div>
            )}
        </div>
    )
}
