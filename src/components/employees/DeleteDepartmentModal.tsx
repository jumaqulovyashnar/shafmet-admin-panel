import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeleteDepartmentModalProps {
    open: boolean
    onClose: () => void
    department: { key: string; label: string; count: number } | null
    onConfirm: (key: string) => void
}

export default function DeleteDepartmentModal({ open, onClose, department, onConfirm }: DeleteDepartmentModalProps) {
    const handleDelete = () => {
        if (department) {
            onConfirm(department.key)
            onClose()
        }
    }

    if (!department) return null

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Bo'limni <span className="text-red-600">O'chirish</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Warning Icon */}
                    <div className="flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertTriangle size={32} className="text-red-600" />
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="text-center space-y-2">
                        <p className="text-[14px] font-semibold text-gray-900">
                            "{department.label}" bo'limini o'chirmoqchimisiz?
                        </p>
                        <p className="text-[12px] text-gray-500">
                            Bu bo'limda {department.count} ta hodim mavjud. Bu amalni bekor qilish mumkin emas.
                        </p>
                    </div>

                    {/* Department Info */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] text-red-600 font-medium mb-0.5">O'chiriladigan bo'lim</p>
                                <p className="text-[13px] font-semibold text-gray-900">{department.label}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] text-gray-500 mb-0.5">Hodimlar</p>
                                <p className="text-[14px] font-bold text-gray-900">{department.count} ta</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-1">
                        <Button onClick={onClose} variant="outline" size="sm" className="h-10 px-6 rounded-xl text-[13px]">
                            Bekor qilish
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 h-10 px-6 rounded-xl text-[13px] font-semibold"
                        >
                            O'chirish
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
