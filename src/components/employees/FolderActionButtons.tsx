import { Pencil, Trash2, UserRoundPlus } from 'lucide-react'

interface FolderActionButtonsProps {
    departmentKey: string;
    isDefault?: boolean;
    onAddEmployee?: (key: string) => void;
    onEdit?: (key: string) => void;
    onDelete?: (key: string) => void;
}

export default function FolderActionButtons({
    departmentKey,
    isDefault = false,
    onAddEmployee,
    onEdit,
    onDelete
}: FolderActionButtonsProps) {
    const isProtected = departmentKey === 'all' || isDefault;

    return (
        <div className="flex flex-wrap gap-2.5 mt-4 pt-4 border-t border-gray-100">
            {departmentKey !== 'all' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddEmployee?.(departmentKey);
                    }}
                    className="flex-1 whitespace-nowrap flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                >
                    <UserRoundPlus size={14} />
                    Xodim qo'shish
                </button>
            )}
            {!isProtected && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(departmentKey);
                        }}
                        className="flex-1 whitespace-nowrap flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                    >
                        <Pencil size={14} />
                        Tahrirlash
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(departmentKey);
                        }}
                        className="flex-1 whitespace-nowrap flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                    >
                        <Trash2 size={14} />
                        O'chirish
                    </button>
                </>
            )}
        </div>
    )
}

