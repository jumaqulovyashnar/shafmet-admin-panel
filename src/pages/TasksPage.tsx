import { useState } from 'react'
import { ShoppingCart, User, Loader2 } from 'lucide-react'
import TasksEmployeeModal from '@/components/tasks/TasksEmployeeModal'
import { useWorkers } from '@/hooks/useWorkers'
import type { Worker } from '@/types/inspection'

interface DepartmentCard {
    key: string
    title: string
    subtitle: string
    iconBg: string
    iconColor: string
    icon: React.ReactNode
}

const departments: DepartmentCard[] = [
    { key: 'worker', title: 'Ishchilar', subtitle: "Ishchilar bo'yicha vazifalar", iconBg: 'bg-green-100', iconColor: 'text-green-500', icon: <ShoppingCart size={24} /> },
    { key: 'manager', title: 'Menejerlar', subtitle: "Menejerlar bo'yicha vazifalar", iconBg: 'bg-blue-100', iconColor: 'text-blue-500', icon: <ShoppingCart size={24} /> },
    { key: 'boss', title: 'Rahbarlar', subtitle: "Rahbarlar bo'yicha vazifalar", iconBg: 'bg-purple-100', iconColor: 'text-purple-400', icon: <ShoppingCart size={24} /> },
    { key: 'admin', title: 'Adminlar', subtitle: "Adminlar bo'yicha vazifalar", iconBg: 'bg-orange-100', iconColor: 'text-orange-500', icon: <User size={24} /> },
]

export default function TasksPage() {
    const [openDept, setOpenDept] = useState<string | null>(null)
    const { workers, loading } = useWorkers()

    const getWorkersByRole = (key: string): Worker[] => {
        switch (key) {
            case 'worker': return workers.filter(w => w.role === 'worker')
            case 'manager': return workers.filter(w => w.role === 'manager')
            case 'boss': return workers.filter(w => w.role === 'boss')
            case 'admin': return workers.filter(w => w.role === 'admin')
            default: return workers
        }
    }

    const getTitle = (key: string) =>
        departments.find((d) => d.key === key)?.title ?? ''

    // Har bir department uchun worker sonini ko'rsatish
    const getDeptCount = (key: string) => getWorkersByRole(key).length

    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="ml-3 text-gray-500">Yuklanmoqda...</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {departments.map((dept) => (
                        <button
                            key={dept.key}
                            onClick={() => setOpenDept(dept.key)}
                            className="bg-white rounded-xl p-6 flex items-center gap-5 hover:shadow-md transition-shadow text-left group"
                        >
                            <div className={`w-14 h-14 rounded-full ${dept.iconBg} flex items-center justify-center shrink-0 ${dept.iconColor}`}>
                                {dept.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#64b5f6] transition-colors">
                                    {dept.title}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    {dept.subtitle} ({getDeptCount(dept.key)} ta)
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {openDept && (
                <TasksEmployeeModal
                    open={!!openDept}
                    onClose={() => setOpenDept(null)}
                    title={`${getTitle(openDept)} Xodimlari`}
                    workers={getWorkersByRole(openDept)}
                />
            )}
        </div>
    )
}
