import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Mail, Phone, Calendar, Clock, ClipboardList, Timer, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Employee } from '@/types/dashboard'

interface EmployeeProfileModalProps {
    open: boolean
    onClose: () => void
    employee: Employee | null
}

export default function EmployeeProfileModal({ open, onClose, employee }: EmployeeProfileModalProps) {
    if (!employee) return null

    // Mock statistika - real API'dan kelishi kerak
    const stats = {
        jamiVazifalar: 12,
        bajarilmoqda: 5,
        bajarildi: 7,
        muddatOtgan: 2,
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
                {/* Stats cards */}
                <div className="px-6 pt-6 pb-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                                <ClipboardList className="text-blue-600" size={22} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.jamiVazifalar}</p>
                            <p className="text-xs text-gray-500">Jami vazifalar</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                <Timer className="text-amber-600" size={22} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.bajarilmoqda}</p>
                            <p className="text-xs text-gray-500">Bajarilmoqda</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="text-green-600" size={22} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.bajarildi}</p>
                            <p className="text-xs text-gray-500">Bajarildi</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="text-red-600" size={22} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.muddatOtgan}</p>
                            <p className="text-xs text-gray-500">Muddat o'tgan</p>
                        </div>
                    </div>
                </div>

                {/* Contact information */}
                <div className="px-6 pb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Aloqa ma'lumotlari</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <Phone className="text-gray-600" size={18} />
                            </div>
                            <span className="text-gray-700 text-[15px]">{employee.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <Mail className="text-gray-600" size={18} />
                            </div>
                            <span className="text-gray-700 text-[15px]">
                                {employee.name.toLowerCase().replace(/\s+/g, '.')}@example.com
                            </span>
                        </div>
                    </div>
                </div>

                {/* Work info */}
                <div className="px-6 pb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Ish ma'lumotlari</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="text-gray-500" size={16} />
                                <span className="text-xs text-gray-500">Kelgan vaqt</span>
                            </div>
                            <p className="text-[15px] font-semibold text-gray-900">{employee.arrivalTime}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="text-gray-500" size={16} />
                                <span className="text-xs text-gray-500">Ishga kirgan sana</span>
                            </div>
                            <p className="text-[15px] font-semibold text-gray-900">12.03.2023</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Balans</span>
                            </div>
                            <p className="text-[15px] font-semibold text-gray-900">
                                {employee.balance.toLocaleString()} so'm
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Faolligi</span>
                            </div>
                            <p className="text-[15px] font-semibold text-gray-900">{employee.efficiency}%</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
