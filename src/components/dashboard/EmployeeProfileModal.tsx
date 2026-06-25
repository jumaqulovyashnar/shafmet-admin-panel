import { useState } from 'react'
import {
    X,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    CheckCircle2,
    ArrowRight,
    DollarSign,
    AlertCircle,
    FileText,
    Clock,
    CheckCheck,
    Wallet,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Employee } from '@/types/dashboard'

interface EmployeeProfileModalProps {
    open: boolean
    onClose: () => void
    employee: Employee | null
}

type TabKey = 'info' | 'attendance' | 'tasks' | 'balance' | 'history'

interface Tab {
    key: TabKey
    label: string
}

interface StatCard {
    icon: any
    label: string
    value: string | number
    subtitle: string
    color: string
}

interface Activity {
    icon: any
    color: string
    title: string
    desc: string
    time: string
    bg: string
    iconBg: string
    iconColor: string
}

const TABS: Tab[] = [
    { key: 'info', label: "Asosiy ma'lumot" },
    { key: 'attendance', label: 'Davomat' },
    { key: 'tasks', label: 'Topshiriqlar' },
    { key: 'balance', label: 'Balans' },
    { key: 'history', label: 'Tarix (faoliyat loglari)' },
]

export default function EmployeeProfileModal({ open, onClose, employee }: EmployeeProfileModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState<TabKey>('info')
    const [formData, setFormData] = useState({
        name: employee?.name || '',
        phone: employee?.phone || '',
        email: 'jane.cooper@email.com',
        location: employee?.location || '',
        position: 'Sotuvchi',
        startDate: '12.03.2023',
        xodimId: '#ID1258',
        balance: employee?.balance || 0,
        password: '********',
    })

    if (!employee) return null

    const initials = employee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)

    const updateField = (key: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        setIsEditing(false)
        // Save logic here
    }

    const statCards: StatCard[] = [
        {
            icon: Calendar,
            label: 'Kelgan kunlar',
            value: 24,
            subtitle: 'Shu oy',
            color: 'text-blue-600',
        },
        {
            icon: Clock,
            label: 'Kechikishlar',
            value: 3,
            subtitle: 'Shu oy',
            color: 'text-amber-600',
        },
        {
            icon: CheckCheck,
            label: 'Bajarilgan vazifalar',
            value: 28,
            subtitle: 'Shu oy',
            color: 'text-green-600',
        },
        {
            icon: Wallet,
            label: 'Joriy balans',
            value: (employee.balance || 0).toLocaleString(),
            subtitle: "so'm",
            color: 'text-purple-600',
        },
    ]

    const activities: Activity[] = [
        {
            icon: CheckCircle2,
            color: 'green',
            title: 'Topshiriq yakunlandi',
            desc: '"Hisabot tayyorlash" topshirigi bajarildi',
            time: 'Bugun, 14:25',
            bg: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ArrowRight,
            color: 'blue',
            title: 'Ishga keldi',
            desc: 'Bugun ishga keldi',
            time: 'Bugun, 08:55',
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: DollarSign,
            color: 'amber',
            title: 'Balansga pul qoshildi',
            desc: '+50 000 som qoshildi',
            time: 'Kecha, 18:40',
            bg: 'bg-amber-50',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
        },
        {
            icon: AlertCircle,
            color: 'red',
            title: 'Kechikib keldi',
            desc: '15 daqiqa kechikib keldi',
            time: '23.04.2025, 09:15',
            bg: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: FileText,
            color: 'purple',
            title: 'Yangi topshiriq berildi',
            desc: '"CRM bazani yangilash" topshirigi berildi',
            time: '23.04.2025, 10:30',
            bg: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ]

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col p-0" hideClose>
                {/* Header */}
                <Header employee={employee} initials={initials} formData={formData} statCards={statCards} onClose={onClose} />

                {/* Tabs */}
                <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {activeTab === 'info' && (
                        <InfoTab
                            formData={formData}
                            isEditing={isEditing}
                            onEdit={() => setIsEditing(true)}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                            updateField={updateField}
                            activities={activities}
                        />
                    )}

                    {activeTab !== 'info' && (
                        <EmptyTabContent message={`${TABS.find((t) => t.key === activeTab)?.label} ma'lumotlari bu yerda ko'rsatiladi`} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Header Component
function Header({
    employee,
    initials,
    formData,
    statCards,
    onClose,
}: {
    employee: Employee
    initials: string
    formData: any
    statCards: StatCard[]
    onClose: () => void
}) {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 pt-8 pb-6 relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 transition-colors shadow-sm"
            >
                <X size={18} />
            </button>

            <div className="flex items-start gap-6">
                {/* Avatar */}
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                {/* Profile Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{employee.name}</h2>
                    <p className="text-sm text-gray-600 mb-1">{formData.location}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Faol
                    </span>

                    {/* Quick Stats */}
                    <div className="flex gap-4 mt-6">
                        {statCards.map((stat) => (
                            <StatCard key={stat.label} stat={stat} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Stat Card Component
function StatCard({ stat }: { stat: StatCard }) {
    const IconComponent = stat.icon
    return (
        <div className="bg-white rounded-xl px-6 py-4 shadow-sm min-w-[160px]">
            <div className={`flex items-center gap-2 ${stat.color} mb-1`}>
                <IconComponent size={16} />
                <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
        </div>
    )
}

// Tab Navigation Component
function TabNavigation({ tabs, activeTab, onTabChange }: { tabs: Tab[]; activeTab: TabKey; onTabChange: (key: TabKey) => void }) {
    return (
        <div className="border-b border-gray-200 px-8">
            <div className="flex gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.key ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                    </button>
                ))}
            </div>
        </div>
    )
}

// Info Tab Component
function InfoTab({
    formData,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    updateField,
    activities,
}: {
    formData: any
    isEditing: boolean
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    updateField: (key: string, value: string | number) => void
    activities: Activity[]
}) {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <PersonalInfoSection
                formData={formData}
                isEditing={isEditing}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                updateField={updateField}
            />

            {/* Right Column */}
            <ActivitySection activities={activities} />
        </div>
    )
}

// Personal Info Section
function PersonalInfoSection({
    formData,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    updateField,
}: {
    formData: any
    isEditing: boolean
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    updateField: (key: string, value: string | number) => void
}) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Shaxsiy ma'lumotlar</h3>
                {!isEditing ? (
                    <Button onClick={onEdit} variant="outline" size="sm" className="gap-2">
                        <Pencil size={14} />
                        Ma'lumotlarni tahrirlash
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={onSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Saqlash
                        </Button>
                        <Button onClick={onCancel} variant="outline" size="sm">
                            Bekor qilish
                        </Button>
                    </div>
                )}
            </div>

            {/* Form Fields */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <FormField label="Ism Familiya" value={formData.name} isEditing={isEditing} onChange={(v) => updateField('name', v)} />
                <FormField label="Lavozimi" value={formData.position} isEditing={isEditing} onChange={(v) => updateField('position', v)} />
                <FormField
                    label="Bo'limi"
                    value={formData.location}
                    isEditing={isEditing}
                    onChange={(v) => updateField('location', v)}
                    type="select"
                    options={['Ichki dokon', 'Tashqi dokon']}
                />
                <FormField label="Login (Email)" value={formData.email} isEditing={isEditing} onChange={(v) => updateField('email', v)} />
                <FormField
                    label="Parol"
                    value={formData.password}
                    isEditing={isEditing}
                    onChange={(v) => updateField('password', v)}
                    type="password"
                />
                <FormField label="Telefon raqami" value={formData.phone} isEditing={isEditing} onChange={(v) => updateField('phone', v)} />
                <FormField label="Holati" value="Faol" isEditing={false} readOnlyColor="text-green-600" />
                <FormField label="Ishga kirgan sana" value={formData.startDate} isEditing={false} />
                <FormField label="Xodim ID" value={formData.xodimId} isEditing={false} />
            </div>

            {/* Balance Section */}
            <BalanceSection balance={formData.balance} />
        </div>
    )
}

// Form Field Component
function FormField({
    label,
    value,
    isEditing,
    onChange,
    type = 'text',
    options,
    readOnlyColor,
}: {
    label: string
    value: string
    isEditing: boolean
    onChange?: (value: string) => void
    type?: 'text' | 'password' | 'select'
    options?: string[]
    readOnlyColor?: string
}) {
    return (
        <div>
            <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
            {isEditing && onChange ? (
                type === 'select' ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm"
                    >
                        {options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                ) : (
                    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-10" />
                )
            ) : (
                <p className={`text-sm font-medium ${readOnlyColor || 'text-gray-900'}`}>{value}</p>
            )}
        </div>
    )
}

// Balance Section Component
function BalanceSection({ balance }: { balance: number }) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Joriy balans</h4>
            <p className="text-3xl font-bold text-gray-900 mb-4">{balance.toLocaleString()} so'm</p>
            <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 gap-2">
                    <Plus size={14} />
                    Balans qo'shish
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-2 border-red-300 text-red-600 hover:bg-red-50">
                    <Trash2 size={14} />
                    Balansni 0 qilish
                </Button>
            </div>
        </div>
    )
}

// Activity Section Component
function ActivitySection({ activities }: { activities: Activity[] }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Oxirgi faoliyatlar</h3>

            <div className="space-y-3">
                {activities.map((activity, idx) => (
                    <ActivityCard key={idx} activity={activity} />
                ))}
            </div>

            <Button variant="outline" className="w-full">
                Barcha tarixni ko'rish
            </Button>
        </div>
    )
}

// Activity Card Component
function ActivityCard({ activity }: { activity: Activity }) {
    const IconComponent = activity.icon
    return (
        <div className={`${activity.bg} rounded-lg p-3 flex items-start gap-3`}>
            <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
                <IconComponent size={16} className={activity.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{activity.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
        </div>
    )
}

// Empty Tab Content Component
function EmptyTabContent({ message }: { message: string }) {
    return <div className="text-center py-12 text-gray-500">{message}</div>
}
