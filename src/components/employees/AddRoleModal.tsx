import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AddRoleModalProps {
    open: boolean
    onClose: () => void
    onAdd: (role: { title: string; principle: string; showInDiagram: boolean }) => void
}

export default function AddRoleModal({ open, onClose, onAdd }: AddRoleModalProps) {
    const [form, setForm] = useState({
        title: '',
        principle: '',
        showInDiagram: false,
    })

    const set = (k: string, v: string | boolean) =>
        setForm((f) => ({ ...f, [k]: v }))

    const handleCreate = () => {
        if (!form.title.trim()) return
        onAdd({ ...form })
        onClose()
        setForm({ title: '', principle: '', showInDiagram: false })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Yangi Lavozim{' '}
                        <span className="text-[#64b5f6]">Qo'shish</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Lavozim nomi */}
                    <div>
                        <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">
                            Lavozim Nomi
                        </label>
                        <Input
                            placeholder="Buxgalter..."
                            className="h-11 text-[13px] rounded-xl border-gray-200"
                            value={form.title}
                            onChange={(e) => set('title', e.target.value)}
                        />
                    </div>

                    {/* Lavozim majburiyatlari */}
                    <div>
                        <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">
                            Lavozim Majburiyatlari
                        </label>
                        <Input
                            placeholder="Umumiy Ko'rinish"
                            className="h-11 text-[13px] rounded-xl border-gray-200"
                            value={form.principle}
                            onChange={(e) => set('principle', e.target.value)}
                        />
                    </div>

                    {/* Diagrammada ko'rinishi toggle */}
                    <div className="flex items-center justify-between bg-[#e3f2fd] rounded-xl px-4 py-3.5">
                        <span className="text-[13px] text-gray-700 font-medium">
                            Diagrammada Ko'rinishi
                        </span>
                        <button
                            type="button"
                            onClick={() => set('showInDiagram', !form.showInDiagram)}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.showInDiagram ? 'bg-[#64b5f6]' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${form.showInDiagram ? 'left-5' : 'left-0.5'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex justify-end pt-1">
                        <Button
                            onClick={handleCreate}
                            className="bg-[#64b5f6] hover:bg-[#42a5f5] h-10 px-8 rounded-xl text-[13px] font-semibold"
                        >
                            Yaratish
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
