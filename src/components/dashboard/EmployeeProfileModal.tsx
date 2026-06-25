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
    Eye,
    EyeOff,
    ChevronRight,
    Upload,
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

type TabKey = 'info' | 'attendance' | 'tasks' | 'balance' | 'history' | 'documents'

interface Tab {
    key: TabKey
    label: string
}

const TABS: Tab[] = [
    { key: 'info', label: "Asosiy ma'lumot" },
    { key: 'attendance', label: 'Davomat' },
    { key: 'tasks', label: 'Topshiriqlar' },
    { key: 'balance', label: 'Balans' },
    { key: 'history', label: 'Tarix (faoliyat loglari)' },
    { key: 'documents', label: 'Hujjatlar' },
]

export default function EmployeeProfileModal({ open, onClose, employee }: EmployeeProfileModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState<TabKey>('info')
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: employee?.name || '',
        phone: employee?.phone || '',
        email: 'jane.cooper@email.com',
        location: employee?.location || 'Ichki do\'kon',
        position: 'Sotuvchi',
        startDate: '12.03.2023',
        xodimId: '#ID1258',
        balance: employee?.balance || 32000,
        password: '••••••••',
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

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-[1100px] max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl" hideClose>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT SIDEBAR */}
                    <div className="w-[220px] shrink-0 bg-white border-r border-gray-100 flex flex-col items-center pt-8 pb-6 px-4">
                        {/* Avatar */}
                        <div className="relative mb-3">
                            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                                <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-500 text-white text-2xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>

                        <h2 className="text-base font-bold text-gray-900 text-center mb-1">{employee.name}</h2>

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mb-2">
                            Faol
                        </span>

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-1">
                            {formData.location}
                        </span>
                        <p className="text-xs text-gray-500 mb-6">{formData.position}</p>

                        {/* Contact Info */}
                        <div className="w-full space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone size={13} className="text-gray-400 shrink-0" />
                                <span>{formData.phone || '(225) 555-0118'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail size={13} className="text-gray-400 shrink-0" />
                                <span className="truncate">{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Calendar size={13} className="text-gray-400 shrink-0" />
                                <span>{formData.startDate} dan beri</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin size={13} className="text-gray-400 shrink-0" />
                                <span>Xodim ID: {formData.xodimId}</span>
                            </div>
                        </div>

                        {/* Balance */}
                        <div className="mt-6 w-full bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-1">Joriy balans</p>
                            <p className="text-xl font-bold text-gray-900">{formData.balance.toLocaleString()} so'm</p>
                        </div>

                        <div className="mt-3 w-full space-y-2">
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-xs gap-1.5 h-8">
                                <Plus size={13} />
                                Balans qo'shish
                            </Button>
                            <Button size="sm" variant="outline" className="w-full text-xs gap-1.5 h-8 border-red-200 text-red-600 hover:bg-red-50">
                                <Trash2 size={13} />
                                Balansni 0 qilish
                            </Button>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-4 px-6 pt-6 pb-4">
                            <StatCard icon={Calendar} label="Kelgan kunlar" value={24} subtitle="Shu oy" iconColor="text-blue-500" iconBg="bg-blue-50" />
                            <StatCard icon={Clock} label="Kechikishlar" value={3} subtitle="Shu oy" iconColor="text-amber-500" iconBg="bg-amber-50" />
                            <StatCard icon={CheckCheck} label="Bajarilgan vazifalar" value={28} subtitle="Shu oy" iconColor="text-green-500" iconBg="bg-green-50" />
                            <StatCard icon={Wallet} label="Joriy balans" value={`${(formData.balance || 0).toLocaleString()} so'm`} subtitle="" iconColor="text-purple-500" iconBg="bg-purple-50" />
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 bg-white px-6">
                            <div className="flex gap-0">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.key
                                                ? 'text-blue-600'
                                                : 'text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.key && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {activeTab === 'info' && (
                                <InfoTab
                                    formData={formData}
                                    isEditing={isEditing}
                                    showPassword={showPassword}
                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                    onEdit={() => setIsEditing(true)}
                                    onSave={() => setIsEditing(false)}
                                    onCancel={() => setIsEditing(false)}
                                    updateField={updateField}
                                />
                            )}
                            {activeTab !== 'info' && (
                                <div className="text-center py-16 text-gray-400 text-sm">
                                    {TABS.find((t) => t.key === activeTab)?.label} ma'lumotlari bu yerda ko'rsatiladi
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Stat Card
function StatCard({
    icon: Icon,
    label,
    value,
    subtitle,
    iconColor,
    iconBg,
}: {
    icon: any
    label: string
    value: string | number
    subtitle: string
    iconColor: string
    iconBg: string
}) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                    <Icon size={16} className={iconColor} />
                </div>
                <span className="text-xs text-gray-500">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
    )
}

// Info Tab
function InfoTab({
    formData,
    isEditing,
    showPassword,
    onTogglePassword,
    onEdit,
    onSave,
    onCancel,
    updateField,
}: {
    formData: any
    isEditing: boolean
    showPassword: boolean
    onTogglePassword: () => void
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    updateField: (key: string, value: string | number) => void
}) {
    const activities = [
        { icon: CheckCircle2, iconBg: 'bg-green-100', iconColor: 'text-green-600', bg: 'bg-green-50', title: 'Topshiriq yakunlandi', desc: '"Hisabot tayyorlash" topshirigi bajarildi', time: 'Bugun, 14:25' },
        { icon: ArrowRight, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', bg: 'bg-blue-50', title: 'Ishga keldi', desc: 'Bugun ishga keldi', time: 'Bugun, 08:55' },
        { icon: DollarSign, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', bg: 'bg-amber-50', title: 'Balansga pul qo\'shildi', desc: '+50 000 so\'m qo\'shildi', time: 'Kecha, 16:40' },
        { icon: AlertCircle, iconBg: 'bg-red-100', iconColor: 'text-red-600', bg: 'bg-red-50', title: 'Kechikib keldi', desc: '15 daqiqa kechikib keldi', time: '23.04.2025, 09:15' },
        { icon: FileText, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', bg: 'bg-purple-50', title: 'Yangi topshiriq berildi', desc: '"CRM bazani yangilash" topshirigi berildi', time: '23.04.2025, 10:30' },
    ]

    return (
        <div className="grid grid-cols-2 gap-5">
            {/* Left: Personal Info */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Shaxsiy ma'lumotlar</h3>
                    {!isEditing ? (
                        <Button onClick={onEdit} variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                            <Pencil size={12} />
                            Ma'lumotlarni tahrirlash
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={onSave} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">Saqlash</Button>
                            <Button onClick={onCancel} variant="outline" size="sm" className="h-8 text-xs">Bekor qilish</Button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                    <InfoRow label="Ism Familiya" value={formData.name} isEditing={isEditing} onChange={(v) => updateField('name', v)} />
                    <InfoRow label="Lavozimi" value={formData.position} isEditing={isEditing} onChange={(v) => updateField('position', v)} />
                    <InfoRow label="Bo'limi" value={formData.location} isEditing={isEditing} onChange={(v) => updateField('location', v)} type="select" options={['Ichki do\'kon', 'Tashqi do\'kon']} />
                    <InfoRow label="Login (Email)" value={formData.email} isEditing={isEditing} onChange={(v) => updateField('email', v)} />
                    <InfoRow
                        label="Parol"
                        value={showPassword ? '12345678' : '••••••••'}
                        isEditing={isEditing}
                        onChange={(v) => updateField('password', v)}
                        type="password"
                        showPassword={showPassword}
                        onTogglePassword={onTogglePassword}
                    />
                    <InfoRow label="Telefon raqami" value={formData.phone || '(225) 555-0118'} isEditing={isEditing} onChange={(v) => updateField('phone', v)} />
                    <InfoRow label="Holati" value="Faol" isEditing={false} valueColor="text-green-600 font-semibold" />
                    <InfoRow label="Ishga kirgan sana" value={formData.startDate} isEditing={false} />
                    <InfoRow label="Xodim ID" value={formData.xodimId} isEditing={false} />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 px-4 pt-3 pb-2 uppercase tracking-wide">Tezkor amallar</p>
                    {[
                        { icon: Eye, label: "Parolni o'zgartirish", color: 'text-gray-600' },
                        { icon: Pencil, label: "Xodim ma'lumotlarini tahrirlash", color: 'text-gray-600' },
                        { icon: Calendar, label: 'Davomatni tahrirlash', color: 'text-gray-600' },
                        { icon: Trash2, label: "Xodimni o'chirish", color: 'text-red-500' },
                    ].map((action) => (
                        <button key={action.label} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors border-t border-gray-50 first:border-0">
                            <div className="flex items-center gap-2.5">
                                <action.icon size={14} className={action.color} />
                                <span className={`text-sm ${action.color}`}>{action.label}</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-300" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Activities + Charts */}
            <div className="space-y-4">
                {/* Activities */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">Oxirgi faoliyatlar</h3>
                        <button className="text-xs text-blue-600 font-medium hover:underline">Barchasini ko'rish</button>
                    </div>
                    <div className="space-y-2">
                        {activities.map((a, i) => {
                            const Icon = a.icon
                            return (
                                <div key={i} className={`${a.bg} rounded-xl p-3 flex items-start gap-3`}>
                                    <div className={`w-8 h-8 rounded-full ${a.iconBg} flex items-center justify-center shrink-0`}>
                                        <Icon size={15} className={a.iconColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Attendance + Tasks mini stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Davomat (shu oy)</p>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full border-4 border-green-500 flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-900">24</span>
                            </div>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /><span className="text-gray-600">Kelgan 24</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /><span className="text-gray-600">Kechikkan 3</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /><span className="text-gray-600">Kelmagan 1</span></div>
                            </div>
                        </div>
                        <button className="text-xs text-blue-600 mt-3 hover:underline">To'liq davomat tarixi</button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Topshiriqlar statistikasi</p>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full border-4 border-blue-500 flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-900">35</span>
                            </div>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /><span className="text-gray-600">Bajarilgan 28</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /><span className="text-gray-600">Jarayonda 5</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /><span className="text-gray-600">Bekor qilingan 2</span></div>
                            </div>
                        </div>
                        <button className="text-xs text-blue-600 mt-3 hover:underline">Barcha topshiriqlar</button>
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Hujjatlar</p>
                            <p className="text-xs text-gray-400">Xodimga tegishli hujjatlar va fayllar</p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                            <Upload size={12} />
                            Hujjat yuklash
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                        <div className="w-8 h-10 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">PDF</div>
                        <div>
                            <p className="text-xs font-medium text-gray-800">Mehnat_shartnomasi.pdf</p>
                            <p className="text-xs text-gray-400">PDF · 1.2 MB · 12.03.2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Info Row
function InfoRow({
    label,
    value,
    isEditing,
    onChange,
    type = 'text',
    options,
    valueColor,
    showPassword,
    onTogglePassword,
}: {
    label: string
    value: string
    isEditing: boolean
    onChange?: (v: string) => void
    type?: 'text' | 'password' | 'select'
    options?: string[]
    valueColor?: string
    showPassword?: boolean
    onTogglePassword?: () => void
}) {
    return (
        <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-gray-400 w-36 shrink-0">{label}</span>
            {isEditing && onChange ? (
                type === 'select' ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 h-8 border border-gray-200 rounded-lg px-2 text-sm"
                    >
                        {options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <div className="flex-1 relative">
                        <Input
                            type={type === 'password' && !showPassword ? 'password' : 'text'}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="h-8 text-sm pr-8"
                        />
                        {type === 'password' && onTogglePassword && (
                            <button
                                type="button"
                                onClick={onTogglePassword}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        )}
                    </div>
                )
            ) : (
                <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className={`text-sm font-medium ${valueColor || 'text-gray-800'}`}>{value}</span>
                    {type === 'password' && onTogglePassword && (
                        <button type="button" onClick={onTogglePassword} className="text-gray-400">
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}