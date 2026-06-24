import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Mail, Phone, Calendar, Clock, ClipboardList, Timer, CheckCircle2, AlertCircle, X } from 'lucide-react'
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
            <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-50"
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto max-h-[90vh] p-6">
                    {/* Stats cards */}
                    <div className="mb-6">
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                                    <ClipboardList className="text-white" size={18} />
                                </div>
                                <p className="text-xl font-bold text-gray-900 mb-0.5">{stats.jamiVazifalar}</p>
                                <p className="text-[10px] text-gray-600 leading-tight">Jami vazifalar</p>
                            </div>
                            <div className="bg-amber-50 rounded-2xl p-3 text-center border border-amber-100">
                                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-2">
                                    <Timer className="text-white" size={18} />
                                </div>
                                <p className="text-xl font-bold text-gray-900 mb-0.5">{stats.bajarilmoqda}</p>
                                <p className="text-[10px] text-gray-600 leading-tight">Bajarilmoqda</p>
                            </div>
                            <div className="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle2 className="text-white" size={18} />
                                </div>
                                <p className="text-xl font-bold text-gray-900 mb-0.5">{stats.bajarildi}</p>
                                <p className="text-[10px] text-gray-600 leading-tight">Bajarildi</p>
                            </div>
                            <div className="bg-red-50 rounded-2xl p-3 text-center border border-red-100">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-2">
                                    <AlertCircle className="text-white" size={18} />
                                </div>
                                <p className="text-xl font-bold text-gray-900 mb-0.5">{stats.muddatOtgan}</p>
                                <p className="text-[10px] text-gray-600 leading-tight">Muddat o'tgan</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact information */}
                    <div className="mb-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Aloqa ma'lumotlari</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                                    <Phone className="text-white" size={18} />
                                </div>
                                <span className="text-gray-800 text-[15px] font-medium">{employee.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3 border border-purple-100">
                                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
                                    <Mail className="text-white" size={18} />
                                </div>
                                <span className="text-gray-800 text-[15px] font-medium">
                                    {employee.name.toLowerCase().replace(/\s+/g, '.')}@example.com
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Work info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Ish ma'lumotlari</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Clock className="text-blue-500" size={15} />
                                    <span className="text-[11px] text-gray-600 font-medium">Kelgan vaqt</span>
                                </div>
                                <p className="text-[16px] font-bold text-gray-900">{employee.arrivalTime}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Calendar className="text-green-500" size={15} />
                                    <span className="text-[11px] text-gray-600 font-medium">Ishga kirgan sana</span>
                                </div>
                                <p className="text-[16px] font-bold text-gray-900">12.03.2023</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[11px] text-gray-600 font-medium">💰 Balans</span>
                                </div>
                                <p className="text-[16px] font-bold text-gray-900">
                                    {employee.balance.toLocaleString()} so'm
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[11px] text-gray-600 font-medium">📊 Faolligi</span>
                                </div>
                                <p className="text-[16px] font-bold text-gray-900">{employee.efficiency}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
