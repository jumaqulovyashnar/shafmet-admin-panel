import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, SlidersHorizontal, Search, ChevronDown, UserPlus, ShieldPlus, Folder, Store, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Pagination from '@/components/ui/pagination'
import AddEmployeeModal from '@/components/employees/AddEmployeeModal'
import AddRoleModal from '@/components/employees/AddRoleModal'
import { ichkiDokonEmployees, tashqiDokonEmployees, allEmployees } from '@/data/mockEmployees'
import type { Employee } from '@/types/dashboard'

/* ---- Department folder config ---- */
interface DeptFolder {
    key: string
    label: string
    count: number
    isCustomRole?: boolean
    icon?: React.ReactNode
    bgColor?: string
    iconColor?: string
}

const defaultFolders: DeptFolder[] = [
    {
        key: 'ichki',
        label: 'Ichki dokon ishchilari',
        count: ichkiDokonEmployees.length,
        icon: <Store size={28} />,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-500'
    },
    {
        key: 'tashqi',
        label: 'Tashqi dokon ishchilari',
        count: tashqiDokonEmployees.length,
        icon: <Store size={28} />,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-500'
    },
    {
        key: 'personallar',
        label: 'Personallar',
        count: 500,
        icon: <Users size={28} />,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-500'
    },
]

// Folder icon color — static va custom rollarga
const folderColors = [
    'text-amber-400', 'text-teal-400', 'text-blue-400',
    'text-violet-400', 'text-pink-400', 'text-orange-400',
    'text-green-400', 'text-red-400', 'text-cyan-400',
]

const folderBgColors = [
    'bg-amber-100', 'bg-teal-100', 'bg-blue-100',
    'bg-violet-100', 'bg-pink-100', 'bg-orange-100',
    'bg-green-100', 'bg-red-100', 'bg-cyan-100',
]

function getDeptEmployees(key: string): Employee[] {
    switch (key) {
        case 'ichki': return ichkiDokonEmployees
        case 'tashqi': return tashqiDokonEmployees
        case 'personallar': return allEmployees.slice(0, 500)
        default: return []
    }
}

function genPassword(i: number) {
    return String(10000000 + ((i * 123456789) % 89999999))
}

const ITEMS_PER_PAGE = 10

/* ---- Folder list view ---- */
function FolderList({
    folders,
    onSelect,
}: {
    folders: DeptFolder[]
    onSelect: (key: string) => void
}) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {folders.map((d, idx) => (
                <button
                    key={d.key}
                    onClick={() => onSelect(d.key)}
                    className="bg-white rounded-2xl p-6 text-left hover:shadow-md transition-all group border border-transparent hover:border-blue-100"
                >
                    {/* Icon from lucide-react */}
                    <div className="mb-4">
                        <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center ${d.bgColor || folderBgColors[idx % folderBgColors.length]
                                }`}
                        >
                            <span className={d.iconColor || folderColors[idx % folderColors.length]}>
                                {d.icon || <Folder size={28} className={folderColors[idx % folderColors.length]} />}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-[14px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {d.label}
                    </h3>
                    <p className="text-[12px] text-gray-400 mt-1">{d.count} ta</p>
                </button>
            ))}
        </div>
    )
}

/* ---- Employee table view ---- */
function EmployeeTable({ employees }: { employees: Employee[] }) {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    const filtered = employees.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="bg-white rounded-2xl p-5">
            {/* Table header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[17px] font-bold text-gray-900">Barcha Hodimlar</h3>
                    <p className="text-[12px] text-blue-500 font-medium mt-0.5">umumiy Hodimlar</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <Input
                            placeholder="Qidirish"
                            className="pl-8 h-8 text-[12px] w-40"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        />
                    </div>
                    <button className="flex items-center gap-1.5 text-[12px] border border-gray-200 rounded-lg px-3 h-8 text-gray-600 hover:bg-gray-50 transition-colors">
                        Tanlash: Ichki Dokon
                        <ChevronDown size={12} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Ism Familiyasi</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Ish Joyi</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Telefon Raqami</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Paroli</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Ish Soati</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Boshqalar</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map((emp, i) => (
                        <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-3 text-[13px] font-semibold text-gray-800">{emp.name}</td>
                            <td className="py-3 px-3 text-[12px] text-gray-500">{emp.location}</td>
                            <td className="py-3 px-3 text-[12px] text-gray-500">{emp.phone}</td>
                            <td className="py-3 px-3 text-[12px] text-gray-600 font-mono">{genPassword(i)}</td>
                            <td className="py-3 px-3 text-[12px] text-gray-400">—</td>
                            <td className="py-3 px-3 text-[12px] text-gray-400">—</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
    )
}

/* ---- Main page ---- */

// Folders state ni session da saqlaymiz — route o'zgarganda yo'qolmasin
const SESSION_KEY = 'shafmet_folders'

function loadFolders(): DeptFolder[] {
    try {
        const saved = sessionStorage.getItem(SESSION_KEY)
        if (saved) return JSON.parse(saved) as DeptFolder[]
    } catch { /* ignore */ }
    return defaultFolders
}

function saveFolders(folders: DeptFolder[]) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(folders))
    } catch { /* ignore */ }
}

export default function EmployeesPage() {
    const { dept } = useParams<{ dept?: string }>()
    const navigate = useNavigate()
    const [folders, setFolders] = useState<DeptFolder[]>(loadFolders)
    const [showAdd, setShowAdd] = useState(false)
    const [showAddRole, setShowAddRole] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Yangi rol qo'shilganda folders ga yangi card qo'shiladi va sessionStorage ga saqlanadi
    const handleAddRole = (role: { title: string; principle: string; showInDiagram: boolean }) => {
        const key = `role_${Date.now()}`
        const updated = [
            ...folders,
            { key, label: role.title, count: 0, isCustomRole: true },
        ]
        setFolders(updated)
        saveFolders(updated)
        // Folder listga qaytish uchun /employees ga navigate
        if (dept) navigate('/employees')
    }

    const currentFolder = folders.find((d) => d.key === dept)
    const employees = dept ? getDeptEmployees(dept) : []

    return (
        <div className="space-y-4">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <div className="relative" ref={dropdownRef}>
                    <Button
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="bg-[#64b5f6] hover:bg-[#42a5f5] h-9 px-4 rounded-xl gap-1.5 text-[13px] font-semibold"
                    >
                        <Plus size={15} />
                        Yangi Qoshish
                    </Button>

                    {dropdownOpen && (
                        <div className="absolute left-full top-0 ml-2 bg-white rounded-xl border border-gray-200 shadow-lg z-20 min-w-[200px] overflow-hidden">
                            <button
                                onClick={() => { setShowAdd(true); setDropdownOpen(false) }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#64b5f6]/10 hover:text-[#64b5f6] transition-colors"
                            >
                                <UserPlus size={15} />
                                Yangi Hodim
                            </button>
                            <div className="h-px bg-gray-100 mx-2" />
                            <button
                                onClick={() => { setShowAddRole(true); setDropdownOpen(false) }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#64b5f6]/10 hover:text-[#64b5f6] transition-colors"
                            >
                                <ShieldPlus size={15} />
                                Yangi Rol
                            </button>
                        </div>
                    )}
                </div>

                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <SlidersHorizontal size={15} />
                </button>
            </div>

            {/* Content */}
            {!dept ? (
                <FolderList
                    folders={folders}
                    onSelect={(key) => navigate(`/employees/${key}`)}
                />
            ) : (
                <EmployeeTable employees={employees} />
            )}

            {/* Modals */}
            <AddEmployeeModal
                open={showAdd}
                onClose={() => setShowAdd(false)}
                defaultLocation={currentFolder?.label}
            />
            <AddRoleModal
                open={showAddRole}
                onClose={() => setShowAddRole(false)}
                onAdd={handleAddRole}
            />
        </div>
    )
}
