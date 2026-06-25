import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import EmployeeProfileModal from './EmployeeProfileModal'
import type { Employee } from '@/types/dashboard'

interface EmployeesTableProps {
    employees: Employee[]
    loading?: boolean
}

const FILTERS = ['Ichki Dokon', 'Tashqi Dokon', 'Barchasi']

function efficiencyStyle(val: number) {
    if (val >= 70) return 'bg-emerald-100 text-emerald-700'
    if (val >= 40) return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
}

export default function EmployeesTable({ employees, loading }: EmployeesTableProps) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('Barchasi')
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    const filtered = employees.filter((e) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
        const matchFilter =
            filter === 'Barchasi' ||
            (filter === 'Ichki Dokon' && e.location === 'Ichki dokon') ||
            (filter === 'Tashqi Dokon' && e.location === 'Tashqi dokon')
        return matchSearch && matchFilter
    })

    return (
        <div className="bg-white rounded-xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h3 className="font-semibold text-gray-900">Barcha Xodimlar</h3>
                    <p className="text-xs text-[#64b5f6] mt-0.5">umumiy faolliglar</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <Input
                            placeholder="Qidirish"
                            className="pl-8 h-8 text-xs w-44"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Filter dropdown */}
                    <div className="relative">
                        <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 h-8 text-gray-600 hover:bg-gray-50 transition-colors">
                            Tanlash: {filter}
                            <ChevronDown size={12} />
                        </button>
                        {/* Simple dropdown */}
                        <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-36 hidden group-focus:block">
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Ism Familiyasi</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Ism Joyi</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Telefon Raqami</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Kelgan Vaqt</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Balansi</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Faolligi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <td key={j} className="py-3 px-3">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : filtered.map((emp) => (
                                <tr
                                    key={emp.id}
                                    onClick={() => setSelectedEmployee(emp)}
                                    className="border-b border-gray-50 hover:bg-[#e3f2fd] transition-colors cursor-pointer"
                                >
                                    <td className="py-3 px-3 font-medium text-gray-800 text-sm">{emp.name}</td>
                                    <td className="py-3 px-3 text-gray-500 text-xs">{emp.location}</td>
                                    <td className="py-3 px-3 text-gray-500 text-xs">{emp.phone}</td>
                                    <td className="py-3 px-3 text-gray-500 text-xs">{emp.arrivalTime}</td>
                                    <td className="py-3 px-3 text-gray-700 text-xs">
                                        {emp.balance.toLocaleString()} so'm
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold ${efficiencyStyle(emp.efficiency)}`}>
                                            {emp.efficiency}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Employee Profile Modal */}
            <EmployeeProfileModal
                open={selectedEmployee !== null}
                onClose={() => setSelectedEmployee(null)}
                employee={selectedEmployee}
            />
        </div>
    )
}
