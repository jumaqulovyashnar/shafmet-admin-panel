import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Mail, Phone, Calendar, Clock, ClipboardList, BarChart2, Wallet, CheckCircle2, AlertCircle, Loader, X } from 'lucide-react'
import type { Employee } from '@/types/dashboard'

interface EmployeeProfileModalProps {
    open: boolean
    onClose: () => void
    employee: Employee | null
}

export default function EmployeeProfileModal({ open, onClose, employee }: EmployeeProfileModalProps) {
    if (!employee) return null

    const stats = {
        jamiVazifalar: 12,
        bajarilmoqda: 5,
        bajarildi: 7,
        muddatOtgan: 2,
    }

    const initials = employee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden rounded-2xl" hideClose>
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 relative">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 font-medium text-lg shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-[17px] font-medium text-gray-900 mb-0.5">{employee.name}</p>
                        <p className="text-[13px] text-gray-500">{employee.phone} · IT bo'limi</p>
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 text-[11px] font-medium px-2.5 py-1 rounded-full mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
                            Ishda
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[72vh]">
                    {/* Stats */}
                    <div>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">Vazifalar holati</p>
                        <div className="grid grid-cols-4 gap-2.5">
                            {[
                                { icon: ClipboardList, label: 'Jami', value: stats.jamiVazifalar, bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-700' },
                                { icon: Loader, label: 'Jarayonda', value: stats.bajarilmoqda, bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-700' },
                                { icon: CheckCircle2, label: 'Bajarildi', value: stats.bajarildi, bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-700' },
                                { icon: AlertCircle, label: "Muddati o'tdi", value: stats.muddatOtgan, bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-700' },
                            ].map(({ icon: Icon, label, value, bg, iconBg, text }) => (
                                <div key={label} className={`${bg} rounded-2xl p-3 text-center border border-white`}>
                                    <div className={`w-8 h-8 ${iconBg} rounded-[10px] flex items-center justify-center mx-auto mb-2`}>
                                        <Icon className={text} size={16} />
                                    </div>
                                    <p className={`text-[22px] font-medium ${text} leading-none mb-1`}>{value}</p>
                                    <p className="text-[11px] text-gray-500 leading-tight">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contacts */}
                    <div>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">Aloqa</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100">
                                <div className="w-[34px] h-[34px] rounded-[9px] bg-blue-100 flex items-center justify-center shrink-0">
                                    <Phone className="text-blue-700" size={16} />
                                </div>
                                <span className="text-[14px] text-gray-800">{employee.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100">
                                <div className="w-[34px] h-[34px] rounded-[9px] bg-purple-100 flex items-center justify-center shrink-0">
                                    <Mail className="text-purple-700" size={16} />
                                </div>
                                <span className="text-[14px] text-gray-800">
                                    {employee.name.toLowerCase().replace(/\s+/g, '.')}@example.com
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Work info */}
                    <div>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">Ish ma'lumotlari</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Clock className="text-gray-400" size={13} />
                                    <span className="text-[11px] text-gray-500">Kelgan vaqt</span>
                                </div>
                                <p className="text-[16px] font-medium text-gray-900">{employee.arrivalTime}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Calendar className="text-gray-400" size={13} />
                                    <span className="text-[11px] text-gray-500">Ishga kirgan</span>
                                </div>
                                <p className="text-[16px] font-medium text-gray-900">12.03.2023</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Wallet className="text-gray-400" size={13} />
                                    <span className="text-[11px] text-gray-500">Balans</span>
                                </div>
                                <p className="text-[16px] font-medium text-gray-900">{employee.balance.toLocaleString()} so'm</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <BarChart2 className="text-gray-400" size={13} />
                                    <span className="text-[11px] text-gray-500">Faolligi</span>
                                </div>
                                <p className="text-[16px] font-medium text-gray-900">{employee.efficiency}%</p>
                                <div className="h-1 rounded-full bg-gray-200 mt-2 overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${employee.efficiency}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}