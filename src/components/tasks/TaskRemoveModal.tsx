import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TaskRemoveModalProps {
    open: boolean
    onClose: () => void
    employeeName: string
}

export default function TaskRemoveModal({ open, onClose, employeeName }: TaskRemoveModalProps) {
    const [form, setForm] = useState({ title: '', description: '' })

    const handleRemove = () => {
        onClose()
        setForm({ title: '', description: '' })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Topshiriq Olish{' '}
                        <span className="text-red-500">Hodimdan</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 mt-1">
                    <div>
                        <label className="text-xs text-gray-600 mb-1 block">Topshiriq Sarlavhasi</label>
                        <Input
                            placeholder="Kocha Tashlash..."
                            className="h-9 text-sm"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-600 mb-1 block">Topshiriq Mazmuni</label>
                        <Input
                            placeholder="Yon tomonidagi kocha"
                            className="h-9 text-sm"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        />
                    </div>

                    {/* Empty area like design */}
                    <div className="h-16" />

                    <div className="flex justify-end">
                        <Button
                            onClick={handleRemove}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 h-10"
                        >
                            O'chirish
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
