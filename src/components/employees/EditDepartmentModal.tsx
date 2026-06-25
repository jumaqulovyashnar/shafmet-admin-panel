import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EditDepartmentModalProps {
    open: boolean
    onClose: () => void
    department: { key: string; label: string; count: number } | null
    onSave: (key: string, newLabel: string) => void
}

export default function EditDepartmentModal({ open, onClose, department, onSave }: EditDepartmentModalProps) {
    const [label, setLabel] = useState('')

    useEffect(() => {
        if (department) {
            setLabel(department.label)
        }
    }, [department])

    const handleSave = () => {
        if (department && label.trim()) {
            onSave(department.key, label.trim())
            onClose()
        }
    }

    if (!department) return null

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Bo'limni <span className="text-[#64b5f6]">Tahrirlash</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div>
                        <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">Bo'lim nomi</label>
                        <Input
                            placeholder="Bo'lim nomini kiriting..."
                            className="h-11 text-[13px] rounded-xl border-gray-200"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] text-gray-500 mb-1">Hodimlar soni</p>
                        <p className="text-[14px] font-semibold text-gray-900">{department.count} ta</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                        <Button onClick={onClose} variant="outline" size="sm" className="h-10 px-6 rounded-xl text-[13px]">
                            Bekor qilish
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!label.trim()}
                            className="bg-[#64b5f6] hover:bg-[#42a5f5] h-10 px-6 rounded-xl text-[13px] font-semibold"
                        >
                            Saqlash
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
