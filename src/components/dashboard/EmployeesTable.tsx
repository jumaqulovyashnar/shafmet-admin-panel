import { useState } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import Pagination from '@/components/ui/pagination'
import type { Attendance } from '@/types/inspection'

interface EmployeesTableProps {
    attendances: Attendance[]
    loading?: boolean
    page?: number
    totalPages?: number
    onPageChange?: (page: number) => void
    search?: string
    onSearchChange?: (search: string) => void
    filter?: string
    onFilterChange?: (filter: string) => void
}

const FILTERS = ['Barchasi', 'Yuz Tasdiqlangan', 'Joy Tasdiqlangan', 'Muvaffaqiyatli']

export default function EmployeesTable({ 
    attendances, 
    loading, 
    page = 1, 
    totalPages = 1, 
    onPageChange,
    search = '',
    onSearchChange,
    filter = 'Barchasi',
    onFilterChange 
}: EmployeesTableProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const formatTime = (timeString: string) => {
        try {
            const date = new Date(timeString)
            return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
        } catch {
            return timeString
        }
    }

    const formatDate = (timeString: string) => {
        try {
            const date = new Date(timeString)
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
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h3 className="font-semibold text-gray-900">Davomat Tarixi</h3>
                    <p className="text-xs text-[#64b5f6] mt-0.5">barcha davomatlar ({attendances.length} ta)</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <Input
                            placeholder="Qidirish"
                            className="pl-8 h-8 text-xs w-44"
                            value={search}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>
                    {/* Filter dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 h-8 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Tanlash: {filter}
                            <ChevronDown size={12} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40 py-1">
                                {FILTERS.map((f) => (
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
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Ism</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Telefon</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Sana</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Vaqt</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Turi</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Yuz</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Joy</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Muvaffaqiyat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    {Array.from({ length: 8 }).map((_, j) => (
                                        <td key={j} className="py-3 px-3">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : paginatedAttendances.map((a) => (
                                <tr
                                    key={a.id}
                                    className="border-b border-gray-50 hover:bg-[#e3f2fd] transition-colors cursor-pointer"
                                >
                                    <td className="py-3 px-3 font-medium text-gray-800 text-sm">
                                        {a.user_full_name || `User #${a.user}`}
                                    </td>
                                    <td className="py-3 px-3 text-gray-500 text-xs">
                                        {a.user_phone || '-'}
                                    </td>
                                    <td className="py-3 px-3 text-gray-500 text-xs">
                                        {formatDate(a.created_at)}
                                    </td>
                                    <td className="py-3 px-3 text-gray-500 text-xs">
                                        {formatTime(a.created_at)}
                                    </td>
                                    <td className="py-3 px-3 text-gray-700 text-xs">
                                        {a.attendance_type === 'in' ? 'Kirish' : 'Chiqish'}
                                    </td>
                                    <td className="py-3 px-3">
                                        {a.face_verified ? (
                                            <Check className="text-green-500" size={16} />
                                        ) : (
                                            <X className="text-red-500" size={16} />
                                        )}
                                    </td>
                                    <td className="py-3 px-3">
                                        {a.location_verified ? (
                                            <Check className="text-green-500" size={16} />
                                        ) : (
                                            <X className="text-red-500" size={16} />
                                        )}
                                    </td>
                                    <td className="py-3 px-3">
                                        {a.is_success ? (
                                            <Check className="text-green-500" size={16} />
                                        ) : (
                                            <X className="text-red-500" size={16} />
                                        )}
                                    </td>
                                </tr>
                            ))}
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
