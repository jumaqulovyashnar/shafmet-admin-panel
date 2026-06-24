import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import TasksEmployeeModal from '@/components/tasks/TasksEmployeeModal'
import { ichkiDokonEmployees, tashqiDokonEmployees, allEmployees } from '@/data/mockEmployees'

interface DepartmentCard {
    key: string
    title: string
    subtitle: string
    iconBg: string
    iconColor: string
}

const departments: DepartmentCard[] = [
    { key: 'ichki', title: "Ichki Do'kon", subtitle: "Ichki do'kon statistikasi umumiy", iconBg: 'bg-green-100', iconColor: 'text-green-500' },
    { key: 'tashqi', title: "Tashqi Do'kon", subtitle: "Tashqi do'kon statistikasi umumiy", iconBg: 'bg-red-100', iconColor: 'text-red-400' },
    { key: 'personallar', title: 'Personallar', subtitle: 'Personallar statistikasi umumiy', iconBg: 'bg-pink-100', iconColor: 'text-pink-400' },
    { key: 'buxgalter', title: 'Buxgalter', subtitle: 'Buxgalterlar statistikasi umumiy', iconBg: 'bg-green-100', iconColor: 'text-green-500' },
]

export default function TasksPage() {
    const [openDept, setOpenDept] = useState<string | null>(null)

    const getEmployees = (key: string) => {
        switch (key) {
            case 'ichki': return ichkiDokonEmployees
            case 'tashqi': return tashqiDokonEmployees
            case 'personallar': return allEmployees.slice(0, 30)
            case 'buxgalter': return allEmployees.slice(30, 50)
            default: return []
        }
    }

    const getTitle = (key: string) =>
        departments.find((d) => d.key === key)?.title ?? ''

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                {departments.map((dept) => (
                    <button
                        key={dept.key}
                        onClick={() => setOpenDept(dept.key)}
                        className="bg-white rounded-xl p-6 flex items-center gap-5 hover:shadow-md transition-shadow text-left group"
                    >
                        <div className={`w-14 h-14 rounded-full ${dept.iconBg} flex items-center justify-center shrink-0`}>
                            <ShoppingCart size={24} className={dept.iconColor} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                                {dept.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{dept.subtitle}</p>
                        </div>
                    </button>
                ))}
            </div>

            {openDept && (
                <TasksEmployeeModal
                    open={!!openDept}
                    onClose={() => setOpenDept(null)}
                    title={`${getTitle(openDept)} Xodimlari`}
                    employees={getEmployees(openDept)}
                />
            )}
        </div>
    )
}
