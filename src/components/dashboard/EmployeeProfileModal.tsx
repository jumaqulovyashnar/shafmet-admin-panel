import { useState, useEffect } from 'react'
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
    Clock,
    CheckCheck,
    Wallet,
    Eye,
    EyeOff,
    ChevronRight,
    Upload,
    Loader2,
    Star
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { inspectionService } from '@/services/inspectionService'
import { getAbsoluteImageUrl } from '@/lib/api-base-url'

interface EmployeeProfileModalProps {
    open: boolean
    onClose: () => void
    workerId: number | null
    onUpdate?: () => void
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

export default function EmployeeProfileModal({ open, onClose, workerId, onUpdate }: EmployeeProfileModalProps) {
    const [worker, setWorker] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState<TabKey>('info')
    const [showPassword, setShowPassword] = useState(false)
    const [submitMethod, setSubmitMethod] = useState<'PUT' | 'PATCH'>('PATCH')

    // Local state for editing fields
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        branch: 'Ichki_dokon',
        salary: '150',
        balance: '0',
        password: '',
        is_active: true,
        avatar: ''
    })

    // Stats calculations
    const [stats, setStats] = useState({
        presentDays: 24,
        lateDays: 3,
        absentDays: 1,
        balance: 32000
    })

    // Tasks list and assessments
    const [tasks, setTasks] = useState<any[]>([])
    const [assessments, setAssessments] = useState<any[]>([])
    const [tasksLoading, setTasksLoading] = useState(false)

    // Inline assessment states
    const [ratingTaskId, setRatingTaskId] = useState<number | null>(null)
    const [evalScore, setEvalScore] = useState('')
    const [evalFeedback, setEvalFeedback] = useState('')

    // Fetch employee details and logs
    useEffect(() => {
        if (!open || !workerId) return

        const loadEmployeeData = async () => {
            setLoading(true)
            try {
                // Fetch employee detail — try worker endpoint first (reliable)
                let detail: any
                try {
                    detail = await inspectionService.getWorkerById(workerId)
                } catch (e) {
                    throw e
                }

                if (detail) {
                    setWorker(detail)

                    // Resolve photo: photo_url > photo > avatar
                    const resolvedPhoto = detail.photo_url || detail.photo || detail.avatar || ''

                    setFormData({
                        full_name: detail.full_name || detail.name || '',
                        phone: detail.phone || '',
                        branch: detail.branch || 'Ichki_dokon',
                        salary: String(detail.salary || '150'),
                        balance: String(detail.balance || '0'),
                        password: '',
                        is_active: detail.is_active !== undefined ? detail.is_active : true,
                        avatar: resolvedPhoto
                    })

                    // Calculate real attendance stats
                    try {
                        const profileData = await inspectionService.getWorkerProfile(workerId)
                        if (profileData && profileData.stats) {
                            setStats({
                                presentDays: profileData.stats.present_days || 0,
                                lateDays: profileData.stats.late_days || 0,
                                absentDays: profileData.stats.absent_days || 0,
                                balance: detail.balance !== undefined ? Number(detail.balance) : 0
                            })
                        } else {
                            // Fallback
                            setStats({
                                presentDays: 0,
                                lateDays: 0,
                                absentDays: 0,
                                balance: detail.balance !== undefined ? Number(detail.balance) : 0
                            })
                        }
                    } catch (e) {
                        console.error("Worker profile statistics fetch error:", e)
                    }
                }

                // Load tasks and assessments
                await loadTasksAndAssessments()
            } catch (err) {
                console.error("Error loading employee profile details:", err)
                toast.error("Xodim ma'lumotlarini yuklashda xatolik")
            } finally {
                setLoading(false)
            }
        }

        loadEmployeeData()
    }, [open, workerId])

    const loadTasksAndAssessments = async () => {
        if (!workerId) return
        setTasksLoading(true)
        try {
            const [taskList, assessmentList] = await Promise.all([
                inspectionService.getTasks(),
                inspectionService.getAssessmentsByWorker(workerId)
            ])
            const filteredTasks = (taskList || []).filter((t: any) => t.assigned_to === workerId)
            setTasks(filteredTasks)
            setAssessments(assessmentList || [])
        } catch (e) {
            console.error("Tasks or assessments load error:", e)
        } finally {
            setTasksLoading(false)
        }
    }

    if (!workerId || (!worker && !loading)) return null

    const initials = formData.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    const updateField = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSaveProfile = async () => {
        const updateId = toast.loading("Saqlanmoqda...")
        try {
            const payload: any = {
                full_name: formData.full_name,
                phone: formData.phone,
                branch: formData.branch,
                salary: Number(formData.salary),
                balance: Number(formData.balance),
                is_active: formData.is_active,
            }
            if (formData.password) {
                payload.password = formData.password
            }
            if (formData.avatar && formData.avatar.startsWith('data:')) {
                payload.avatar = formData.avatar
                payload.new_photo = formData.avatar
            }

            let updated: any
            if (submitMethod === 'PUT') {
                updated = await inspectionService.replaceWorker(workerId, payload)
            } else {
                updated = await inspectionService.updateWorker(workerId, payload)
            }

            toast.dismiss(updateId)
            toast.success("Ma'lumotlar muvaffaqiyatli saqlandi!")
            setWorker(updated)
            setIsEditing(false)
            onUpdate?.()
        } catch (err) {
            toast.dismiss(updateId)
            toast.error("Saqlashda xatolik yuz berdi")
            console.error(err)
        }
    }

    const handleDeleteEmployee = async () => {
        if (!confirm("Haqiqatan ham ushbu xodimni o'chirmoqchimisiz?")) return
        const deleteId = toast.loading("Xodim o'chirilmoqda...")
        try {
            await inspectionService.deleteWorker(workerId)
            toast.dismiss(deleteId)
            toast.success("Xodim muvaffaqiyatli o'chirildi")
            onClose()
            onUpdate?.()
        } catch (err) {
            toast.dismiss(deleteId)
            toast.error("O'chirishda xatolik yuz berdi")
            console.error(err)
        }
    }

    const handleAddBalance = async () => {
        const amountStr = prompt("Qancha balans qo'shmoqchisiz (so'm)?")
        if (amountStr === null) return
        const amount = Number(amountStr.replace(/\s/g, ''))
        if (isNaN(amount) || amount <= 0) {
            alert("Noto'g'ri miqdor kiritildi")
            return
        }

        const newBalance = Number(formData.balance) + amount
        const updateId = toast.loading("Balans yangilanmoqda...")
        try {
            await inspectionService.updateEmployeeV1Patch(workerId, { balance: String(newBalance) })
            toast.dismiss(updateId)
            toast.success("Balans muvaffaqiyatli qo'shildi!")
            updateField('balance', String(newBalance))
            setStats(prev => ({ ...prev, balance: newBalance }))
            onUpdate?.()
        } catch (err) {
            toast.dismiss(updateId)
            toast.error("Balansni yangilashda xatolik")
        }
    }

    const handleResetBalance = async () => {
        if (!confirm("Haqiqatan ham balansni 0 qilmoqchimisiz?")) return
        const updateId = toast.loading("Balans nolga tushirilmoqda...")
        try {
            await inspectionService.updateEmployeeV1Patch(workerId, { balance: '0' })
            toast.dismiss(updateId)
            toast.success("Balans nolga tushirildi!")
            updateField('balance', '0')
            setStats(prev => ({ ...prev, balance: 0 }))
            onUpdate?.()
        } catch (err) {
            toast.dismiss(updateId)
            toast.error("Balansni yangilashda xatolik")
        }
    }

    // Avatar Photo Change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                updateField('avatar', reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Tasks API: status toggle
    const handleToggleTaskStatus = async (taskId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
        try {
            await inspectionService.updateTaskStatusPatch(taskId, newStatus)
            toast.success("Vazifa holati yangilandi!")
            loadTasksAndAssessments()
        } catch {
            toast.error("Vazifa holatini yangilashda xatolik")
        }
    }

    // Tasks API: delete task
    const handleDeleteTask = async (taskId: number) => {
        if (!confirm("Ushbu vazifani o'chirib tashlamoqchimisiz?")) return
        try {
            await inspectionService.deleteTask(taskId)
            toast.success("Vazifa o'chirildi")
            loadTasksAndAssessments()
        } catch {
            toast.error("Vazifani o'chirishda xatolik")
        }
    }

    // Assessment API: create or edit evaluation
    const handleSaveAssessment = async (taskId: number, existingAssessmentId?: number) => {
        const scoreNum = Number(evalScore)
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
            alert("Baho 0 va 100 oralig'ida bo'lishi kerak")
            return
        }

        const loadId = toast.loading("Baho saqlanmoqda...")
        try {
            const payload = {
                worker: workerId,
                task: taskId,
                score: scoreNum,
                feedback: evalFeedback
            }

            if (existingAssessmentId) {
                // PATCH or PUT edit
                await inspectionService.updateAssessmentPatch(existingAssessmentId, payload)
            } else {
                // Create
                await inspectionService.createAssessment(payload)
            }

            toast.dismiss(loadId)
            toast.success("Baho muvaffaqiyatli saqlandi!")
            setRatingTaskId(null)
            setEvalScore('')
            setEvalFeedback('')
            loadTasksAndAssessments()
        } catch {
            toast.dismiss(loadId)
            toast.error("Bahoni saqlashda xatolik")
        }
    }

    // Assessment API: delete assessment
    const handleDeleteAssessment = async (assessmentId: number) => {
        if (!confirm("Haqiqatan ham ushbu bahoni o'chirmoqchimisiz?")) return
        const loadId = toast.loading("Baho o'chirilmoqda...")
        try {
            await inspectionService.deleteAssessment(assessmentId)
            toast.dismiss(loadId)
            toast.success("Baho o'chirildi")
            loadTasksAndAssessments()
        } catch {
            toast.dismiss(loadId)
            toast.error("Bahoni o'chirishda xatolik")
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-[1300px] max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl bg-white border-0 shadow-2xl" hideClose>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
                        <span className="text-gray-500 text-sm font-medium">Xodim ma'lumotlari yuklanmoqda...</span>
                    </div>
                ) : (
                    <div className="flex flex-1 overflow-hidden h-[85vh]">
                        {/* LEFT SIDEBAR */}
                        <div className="w-[240px] shrink-0 bg-white border-r border-gray-100 flex flex-col items-center pt-10 pb-6 px-5 select-none">
                            {/* Avatar */}
                            <div className="relative mb-4 group">
                                <Avatar className="w-24 h-24 border-4 border-gray-50 shadow-md">
                                    {formData.avatar ? (
                                        <img src={getAbsoluteImageUrl(formData.avatar)} alt={formData.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-2xl font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                {isEditing && (
                                    <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="text-white w-6 h-6" />
                                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </label>
                                )}
                            </div>

                            <h2 className="text-base font-bold text-gray-900 text-center mb-1 line-clamp-1">{formData.full_name}</h2>

                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${formData.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {formData.is_active ? 'Faol' : 'Nofaol'}
                            </span>

                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 mb-1">
                                {formData.branch === 'Ichki_dokon' ? "Ichki do'kon" : formData.branch === 'Tashqi_dokon' ? "Tashqi do'kon" : "Bosh bo'lim"}
                            </span>
                            <p className="text-xs text-gray-400 mb-6 font-medium">Xodim</p>

                            {/* Contact Info */}
                            <div className="w-full space-y-3.5 flex flex-col items-start px-2">
                                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                                    <Phone size={14} className="text-gray-400 shrink-0" />
                                    <span className="font-medium">{formData.phone || '(225) 555-0118'}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                                    <Mail size={14} className="text-gray-400 shrink-0" />
                                    <span className="truncate font-medium">{worker?.email || `xodim_${workerId}@shafmet.uz`}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                                    <Calendar size={14} className="text-gray-400 shrink-0" />
                                    <span className="font-medium">{new Date(worker?.created_at || Date.now()).toLocaleDateString('uz-UZ')} dan beri</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                                    <MapPin size={14} className="text-gray-400 shrink-0" />
                                    <span className="font-medium">Xodim ID: #ID{workerId}</span>
                                </div>
                            </div>

                            {/* Balance */}
                            <div className="mt-8 w-full bg-[#f4fbf7] rounded-xl p-3.5 border border-[#e2f5ec] text-center select-text">
                                <p className="text-[11px] text-[#4dbb83] font-semibold mb-1">Joriy balans</p>
                                <p className="text-xl font-bold text-[#1e8a55]">{stats.balance.toLocaleString()} so'm</p>
                            </div>

                            <div className="mt-4 w-full space-y-2">
                                <Button onClick={handleAddBalance} size="sm" className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-xs gap-1.5 h-8.5 rounded-xl font-semibold shadow-sm cursor-pointer">
                                    <Plus size={14} />
                                    Balans qo'shish
                                </Button>
                                <Button onClick={handleResetBalance} size="sm" variant="outline" className="w-full text-xs gap-1.5 h-8.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-semibold cursor-pointer">
                                    <Trash2 size={14} />
                                    Balansni 0 qilish
                                </Button>
                            </div>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                            {/* Stats Row */}
                            <div className="grid grid-cols-4 gap-4 px-6 pt-6 pb-4 select-none">
                                <StatCard icon={Calendar} label="Kelgan kunlar" value={stats.presentDays} subtitle="Shu oy" iconColor="text-blue-500" iconBg="bg-blue-50" />
                                <StatCard icon={Clock} label="Kechikishlar" value={stats.lateDays} subtitle="Shu oy" iconColor="text-amber-500" iconBg="bg-amber-50" />
                                <StatCard icon={CheckCheck} label="Bajarilgan vazifalar" value={tasks.filter(t => t.status === 'completed').length} subtitle="Shu oy" iconColor="text-green-500" iconBg="bg-green-50" />
                                <StatCard icon={Wallet} label="Joriy balans" value={`${stats.balance.toLocaleString()} so'm`} subtitle="" iconColor="text-purple-500" iconBg="bg-purple-50" />
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-gray-200 bg-white px-6">
                                <div className="flex gap-0">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`px-4 py-3.5 text-[13px] font-bold transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab.key
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-400 hover:text-gray-700'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                {activeTab === 'info' && (
                                    <div className="grid grid-cols-2 gap-5">
                                        {/* Left: Personal Info */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-900">Shaxsiy ma'lumotlar</h3>
                                                {!isEditing ? (
                                                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-1.5 h-8 text-xs rounded-lg cursor-pointer">
                                                        <Pencil size={12} />
                                                        Ma'lumotlarni tahrirlash
                                                    </Button>
                                                ) : (
                                                    <div className="flex gap-2 items-center">
                                                        <select
                                                            className="text-xs border border-gray-200 rounded-md p-1 h-7 text-gray-600 bg-white"
                                                            value={submitMethod}
                                                            onChange={(e) => setSubmitMethod(e.target.value as any)}
                                                        >
                                                            <option value="PATCH">PATCH (Update)</option>
                                                            <option value="PUT">PUT (Replace)</option>
                                                        </select>
                                                        <Button onClick={handleSaveProfile} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">Saqlash</Button>
                                                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="h-8 text-xs rounded-lg cursor-pointer">Bekor</Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                                                <InfoRow label="Ism Familiya" value={formData.full_name} isEditing={isEditing} onChange={(v) => updateField('full_name', v)} />
                                                <InfoRow label="Lavozimi" value="Xodim" isEditing={false} />
                                                <InfoRow label="Bo'limi" value={formData.branch === 'Ichki_dokon' ? "Ichki do'kon" : "Tashqi do'kon"} isEditing={isEditing} onChange={(v) => updateField('branch', v)} type="select" options={['Ichki_dokon', 'Tashqi_dokon']} />
                                                <InfoRow label="Salary (Ish haqi)" value={formData.salary} isEditing={isEditing} onChange={(v) => updateField('salary', v)} />
                                                <InfoRow label="Telefon raqami" value={formData.phone} isEditing={isEditing} onChange={(v) => updateField('phone', v)} />
                                                <InfoRow
                                                    label="Yangi Parol"
                                                    value={showPassword ? formData.password : '••••••••'}
                                                    isEditing={isEditing}
                                                    onChange={(v) => updateField('password', v)}
                                                    type="password"
                                                    showPassword={showPassword}
                                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                                />
                                                <InfoRow label="Holati" value={formData.is_active ? 'Faol' : 'Nofaol'} isEditing={isEditing} onChange={(v) => updateField('is_active', v === 'Faol')} type="select" options={['Faol', 'Nofaol']} valueColor={formData.is_active ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'} />
                                                <InfoRow label="Ishga kirgan sana" value={new Date(worker?.created_at || Date.now()).toLocaleDateString('uz-UZ')} isEditing={false} />
                                                <InfoRow label="Xodim ID" value={`#ID${workerId}`} isEditing={false} />
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="bg-white rounded-xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 px-4 pt-3 pb-2 uppercase tracking-wider">Tezkor amallar</p>
                                                {[
                                                    { icon: Pencil, label: "Xodim ma'lumotlarini tahrirlash", color: 'text-gray-600', action: () => setIsEditing(true) },
                                                    { icon: Trash2, label: "Xodimni o'chirish (DELETE)", color: 'text-red-500', action: handleDeleteEmployee },
                                                ].map((action, i) => (
                                                    <button key={i} onClick={action.action} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors border-t border-gray-50 first:border-0 cursor-pointer">
                                                        <div className="flex items-center gap-2.5">
                                                            <action.icon size={14} className={action.color} />
                                                            <span className={`text-xs ${action.color}`}>{action.label}</span>
                                                        </div>
                                                        <ChevronRight size={14} className="text-gray-300" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right Side: Activity history */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-sm font-semibold text-gray-900">Oxirgi faoliyatlar</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="bg-green-50 rounded-xl p-3 flex items-start gap-3 border border-green-100">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900">Topshiriq yakunlandi</p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5">Davomat va kunlik hisobot topshirildi</p>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">Bugun, 14:25</span>
                                                </div>
                                                <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-3 border border-blue-100">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                                        <ArrowRight size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900">Ishga keldi</p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5">Yuz va geolokatsiya tekshirildi</p>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">Bugun, 08:55</span>
                                                </div>
                                                <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-3 border border-amber-100">
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                                                        <DollarSign size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900">Balansga pul qo'shildi</p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5">Kunlik bonus (+15,000 so'm)</p>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">Kecha, 16:40</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tasks' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900">Biriktirilgan Topshiriqlar</h3>
                                            <span className="text-xs text-blue-600 font-semibold">{tasks.length} ta topshiriq</span>
                                        </div>

                                        {tasksLoading ? (
                                            <div className="flex justify-center py-10">
                                                <Loader2 className="animate-spin text-blue-500" />
                                            </div>
                                        ) : tasks.length === 0 ? (
                                            <div className="text-center py-12 text-xs text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                                Hozircha biriktirilgan topshiriqlar mavjud emas
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3">
                                                {tasks.map((task) => {
                                                    const scoreData = assessments.find((ev: any) => ev.task === task.id)
                                                    const isRating = ratingTaskId === task.id

                                                    return (
                                                        <div key={task.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{task.title}</h4>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${task.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                                        {task.status === 'completed' ? 'Tugatilgan' : 'Jarayonda'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                                                                <p className="text-[10px] text-gray-400 font-medium">Muddati: {new Date(task.due_date).toLocaleDateString()}</p>
                                                                
                                                                {scoreData && (
                                                                    <div className="mt-2.5 p-2 bg-[#f4f7fc] rounded-lg border border-[#e2e8f5] flex items-center gap-2">
                                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                                                        <div>
                                                                            <p className="text-xs font-bold text-gray-800">Baho: {scoreData.score}/100</p>
                                                                            {scoreData.feedback && <p className="text-[11px] text-gray-500 mt-0.5">Fikr: {scoreData.feedback}</p>}
                                                                        </div>
                                                                        <button onClick={() => handleDeleteAssessment(scoreData.id)} className="ml-auto text-red-500 hover:text-red-600 shrink-0 cursor-pointer">
                                                                            <Trash2 size={13} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-col gap-2 shrink-0 justify-end items-end">
                                                                <div className="flex gap-2">
                                                                    <Button onClick={() => handleToggleTaskStatus(task.id, task.status)} size="sm" variant="outline" className="text-xs h-8 rounded-lg cursor-pointer">
                                                                        {task.status === 'completed' ? 'Faollashtirish' : 'Tugatildi'}
                                                                    </Button>
                                                                    <Button onClick={() => {
                                                                        setRatingTaskId(task.id)
                                                                        setEvalScore(scoreData ? String(scoreData.score) : '')
                                                                        setEvalFeedback(scoreData ? scoreData.feedback : '')
                                                                    }} size="sm" className="text-xs h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-lg gap-1 cursor-pointer">
                                                                        <Star size={12} />
                                                                        {scoreData ? 'Qayta Baholash' : 'Baholash'}
                                                                    </Button>
                                                                    <Button onClick={() => handleDeleteTask(task.id)} size="sm" variant="outline" className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50 rounded-lg cursor-pointer">
                                                                        <Trash2 size={13} />
                                                                    </Button>
                                                                </div>

                                                                {isRating && (
                                                                    <div className="mt-2 w-full max-w-[280px] bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2 text-left self-end">
                                                                        <p className="text-xs font-bold text-gray-800 mb-1">Baho berish (POST/PATCH)</p>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Ball (0-100)"
                                                                            value={evalScore}
                                                                            className="h-8 text-xs bg-white"
                                                                            onChange={(e) => setEvalScore(e.target.value)}
                                                                        />
                                                                        <Input
                                                                            placeholder="Fikr / Izoh"
                                                                            value={evalFeedback}
                                                                            className="h-8 text-xs bg-white"
                                                                            onChange={(e) => setEvalFeedback(e.target.value)}
                                                                        />
                                                                        <div className="flex justify-end gap-1.5">
                                                                            <Button onClick={() => setRatingTaskId(null)} size="sm" variant="outline" className="h-7 text-[10px] px-2 rounded-md cursor-pointer">Bekor</Button>
                                                                            <Button onClick={() => handleSaveAssessment(task.id, scoreData?.id)} size="sm" className="h-7 text-[10px] px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer">Saqlash</Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab !== 'info' && activeTab !== 'tasks' && (
                                    <div className="text-center py-20 text-gray-400 text-sm font-medium bg-white rounded-xl border border-gray-100">
                                        {TABS.find((t) => t.key === activeTab)?.label} bo'limi tez kunda ishga tushadi
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={15} className={iconColor} />
                </div>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{subtitle}</p>}
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
    value: any
    isEditing: boolean
    onChange?: (v: string) => void
    type?: 'text' | 'password' | 'select'
    options?: string[]
    valueColor?: string
    showPassword?: boolean
    onTogglePassword?: () => void
}) {
    return (
        <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-gray-400 font-medium w-36 shrink-0">{label}</span>
            {isEditing && onChange ? (
                type === 'select' ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 h-8 border border-gray-200 rounded-lg px-2 text-xs bg-white text-gray-700 focus:ring-1 focus:ring-blue-500"
                    >
                        {options?.map((opt) => <option key={opt} value={opt}>{opt === 'Ichki_dokon' ? "Ichki do'kon" : opt === 'Tashqi_dokon' ? "Tashqi do'kon" : opt}</option>)}
                    </select>
                ) : (
                    <div className="flex-1 relative">
                        <Input
                            type={type === 'password' && !showPassword ? 'password' : 'text'}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="h-8 text-xs pr-8 bg-white"
                        />
                        {type === 'password' && onTogglePassword && (
                            <button
                                type="button"
                                onClick={onTogglePassword}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                        )}
                    </div>
                )
            ) : (
                <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className={`font-semibold ${valueColor || 'text-gray-800'}`}>{String(value === 'Ichki_dokon' ? "Ichki do'kon" : value === 'Tashqi_dokon' ? "Tashqi do'kon" : value)}</span>
                    {type === 'password' && onTogglePassword && (
                        <button type="button" onClick={onTogglePassword} className="text-gray-400">
                            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}