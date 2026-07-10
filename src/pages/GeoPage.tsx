import { useState, useEffect } from 'react'
import {
    MapPin,
    Plus,
    Trash2,
    Edit2,
    Compass,
    Loader2,
    Map
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { inspectionService } from '@/services/inspectionService'

interface Zone {
    id: number
    name: string
    lat?: number
    lng?: number
    latitude?: number
    longitude?: number
    radius: number
    is_active?: boolean
}

export default function GeoPage() {
    const [zones, setZones] = useState<Zone[]>([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingZone, setEditingZone] = useState<Zone | null>(null)
    const [submitMethod, setSubmitMethod] = useState<'PUT' | 'PATCH'>('PATCH')

    // Form inputs
    const [form, setForm] = useState({
        name: '',
        lat: '',
        lng: '',
        radius: '100',
        is_active: true
    })

    const fetchZones = async () => {
        setLoading(true)
        try {
            const list: any = await inspectionService.getZones()
            const zonesData = Array.isArray(list) ? list : (list?.results && Array.isArray(list.results) ? list.results : null)
            
            if (zonesData) {
                setZones(zonesData)
            } else {
                // Fallback mockup
                setZones([
                    { id: 1, name: "Asosiy Hudud", lat: 39.01175042924258, lng: 65.56598827564635, radius: 150, is_active: true },
                    { id: 2, name: "Ichki Do'kon Hududi", lat: 41.3110, lng: 69.2797, radius: 200, is_active: true },
                ])
            }
        } catch (e) {
            console.error(e)
            // Fallback mockup
            setZones([
                { id: 1, name: "Asosiy Hudud", lat: 39.01175042924258, lng: 65.56598827564635, radius: 150, is_active: true },
                { id: 2, name: "Ichki Do'kon Hududi", lat: 41.3110, lng: 69.2797, radius: 200, is_active: true },
            ])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchZones()
    }, [])

    const handleOpenCreate = () => {
        setEditingZone(null)
        setForm({
            name: '',
            lat: '39.01175042924258',
            lng: '65.56598827564635',
            radius: '100',
            is_active: true
        })
        setModalOpen(true)
    }

    const handleOpenEdit = (zone: Zone) => {
        setEditingZone(zone)
        setForm({
            name: zone.name,
            lat: String(zone.lat || zone.latitude || ''),
            lng: String(zone.lng || zone.longitude || ''),
            radius: String(zone.radius || (zone as any).allowed_radius || (zone as any).distance || 100),
            is_active: zone.is_active !== undefined ? zone.is_active : true
        })
        setModalOpen(true)
    }

    const handleSaveZone = async () => {
        if (!form.name || !form.lat || !form.lng || !form.radius) {
            toast.error("Barcha maydonlarni to'ldiring!")
            return
        }

        const payload = {
            name: form.name,
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng),
            latitude: parseFloat(form.lat), // Send both just in case backend expects full words
            longitude: parseFloat(form.lng),
            radius: parseInt(form.radius),
            is_active: form.is_active
        }

        const loadId = toast.loading("Hudud saqlanmoqda...")
        try {
            if (editingZone) {
                // Update
                if (submitMethod === 'PUT') {
                    await inspectionService.updateZonePut(editingZone.id, payload)
                } else {
                    await inspectionService.updateZonePatch(editingZone.id, payload)
                }
                toast.success("Hudud muvaffaqiyatli yangilandi!")
            } else {
                // Create
                await inspectionService.createZone(payload)
                toast.success("Yangi hudud muvaffaqiyatli qo'shildi!")
            }
            toast.dismiss(loadId)
            setModalOpen(false)
            fetchZones()
        } catch (err) {
            toast.dismiss(loadId)
            toast.error("Xatolik yuz berdi")
            console.error(err)
        }
    }

    const handleDeleteZone = async (id: number) => {
        if (!confirm("Ushbu geolokatsiya hududini o'chirmoqchimisiz?")) return
        const loadId = toast.loading("Hudud o'chirilmoqda...")
        try {
            await inspectionService.deleteZone(id)
            toast.dismiss(loadId)
            toast.success("Hudud o'chirildi")
            fetchZones()
        } catch (err) {
            toast.dismiss(loadId)
            toast.error("O'chirishda xatolik")
            console.error(err)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPin className="text-blue-500 w-5 h-5" />
                        Geolokatsiya Hududlari (Zones)
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Xodimlarning kelib-ketishini tasdiqlash uchun ruxsat berilgan hududlar ro'yxati</p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 transition-all hover:scale-[1.02]">
                    <Plus size={16} />
                    Yangi hudud qo'shish
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Loader2 className="animate-spin text-blue-500 mr-2" />
                    <span className="text-gray-500 text-xs font-semibold">Yuklanmoqda...</span>
                </div>
            ) : zones.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700">Hech qanday hudud topilmadi</p>
                    <p className="text-xs text-gray-400 mt-1 mb-4">Ishga kelish hududlarini belgilash uchun boshlang</p>
                    <Button onClick={handleOpenCreate} variant="outline" size="sm" className="rounded-xl">
                        Birinchi hududni qo'shish
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {zones.map((zone) => (
                        <div key={zone.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Compass size={18} className="animate-pulse" />
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{zone.name}</h3>
                                    </div>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${zone.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {zone.is_active !== false ? 'Faol' : 'Nofaol'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-xs border-b border-gray-50 pb-1.5">
                                        <span className="text-gray-400 font-medium">Kenglik (Latitude)</span>
                                        <span className="text-gray-800 font-semibold">{zone.lat || (zone as any).latitude || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs border-b border-gray-50 pb-1.5">
                                        <span className="text-gray-400 font-medium">Uzunlik (Longitude)</span>
                                        <span className="text-gray-800 font-semibold">{zone.lng || (zone as any).longitude || '-'}</span>
                                    </div>
                                    { (zone.radius ?? (zone as any).allowed_radius ?? (zone as any).distance) != null && (
                                        <div className="flex justify-between text-xs pb-1.5">
                                            <span className="text-gray-400 font-medium">Ruxsat radiusi</span>
                                            <span className="text-blue-600 font-bold">{zone.radius ?? (zone as any).allowed_radius ?? (zone as any).distance} metr</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Canvas Visual Circle Map Widget */}
                            <a 
                                href={`https://www.google.com/maps?q=${zone.lat || (zone as any).latitude},${zone.lng || (zone as any).longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-24 bg-slate-50 rounded-xl mb-4 relative flex items-center justify-center border border-slate-100 overflow-hidden group cursor-pointer hover:border-blue-300 transition-colors block"
                                title="Google Xaritada Ko'rish"
                            >
                                <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                                <div className="absolute w-12 h-12 rounded-full bg-blue-400/20 border border-blue-500/50 flex items-center justify-center animate-ping z-10" style={{ animationDuration: '3s' }}></div>
                                <div className="absolute w-8 h-8 rounded-full bg-blue-500/30 border-2 border-blue-500 flex items-center justify-center z-10">
                                    <MapPin className="text-blue-600 w-4 h-4" />
                                </div>
                                { (zone.radius ?? (zone as any).allowed_radius ?? (zone as any).distance) != null && (
                                    <span className="absolute bottom-2 right-2.5 bg-black/60 text-[9px] text-white px-1.5 py-0.5 rounded font-mono font-medium z-10">
                                        Radius: {zone.radius ?? (zone as any).allowed_radius ?? (zone as any).distance}m
                                    </span>
                                )}
                                <span className="absolute top-2 left-2.5 bg-white/80 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                    Xaritada ochish ↗
                                </span>
                            </a>

                            <div className="flex gap-2">
                                <Button onClick={() => handleOpenEdit(zone)} variant="outline" size="sm" className="flex-1 gap-1.5">
                                    <Edit2 size={12} />
                                    Tahrirlash
                                </Button>
                                <Button onClick={() => handleDeleteZone(zone.id)} variant="outline" size="sm" className="flex-1 text-red-600 border-red-100 hover:bg-red-50 gap-1.5">
                                    <Trash2 size={12} />
                                    O'chirish
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md bg-white rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle>
                            {editingZone ? "Hududni Tahrirlash" : "Yangi Hudud Qo'shish"}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-400">
                            Geolokatsiya hududining koordinatalari va faollik holatini kiriting
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-3">
                        {/* Name */}
                        <div>
                            <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Hudud Nomi</label>
                            <Input
                                placeholder="Masalan: Shafmet Bosh Ofisi"
                                className="h-10 text-xs rounded-xl"
                                value={form.name}
                                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            />
                        </div>

                        {/* Coordinates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Latitude (Kenglik)</label>
                                <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="39.011750"
                                    className="h-10 text-xs rounded-xl font-mono"
                                    value={form.lat}
                                    onChange={(e) => setForm(f => ({ ...f, lat: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Longitude (Uzunlik)</label>
                                <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="65.565988"
                                    className="h-10 text-xs rounded-xl font-mono"
                                    value={form.lng}
                                    onChange={(e) => setForm(f => ({ ...f, lng: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Radius */}
                        <div>
                            <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Radius (metrda)</label>
                            <Input
                                type="number"
                                placeholder="100"
                                className="h-10 text-xs rounded-xl"
                                value={form.radius}
                                onChange={(e) => setForm(f => ({ ...f, radius: e.target.value }))}
                            />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-2">
                            <span className="text-xs text-gray-500 font-semibold">Ushbu hudud faolligi</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                                    className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${form.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.is_active ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>

                        {/* Edit specifics: PUT or PATCH */}
                        {editingZone && (
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500 font-semibold">Tahrirlash metodi (API)</span>
                                <select
                                    className="text-xs border border-gray-200 rounded-md p-1 h-7 text-gray-600 bg-white"
                                    value={submitMethod}
                                    onChange={(e) => setSubmitMethod(e.target.value as any)}
                                >
                                    <option value="PATCH">PATCH (Update)</option>
                                    <option value="PUT">PUT (Replace)</option>
                                </select>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <Button onClick={() => setModalOpen(false)} variant="outline" className="h-9 text-xs rounded-xl cursor-pointer">
                                Bekor qilish
                            </Button>
                            <Button onClick={handleSaveZone} className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs rounded-xl cursor-pointer">
                                Saqlash
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
