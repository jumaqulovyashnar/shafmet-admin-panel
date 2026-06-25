import DonutChart from './DonutChart'

interface StoreCardProps {
    title: string
    subtitle: string
    percentage: number
    color: string
    onClick?: () => void
}

export default function StoreCard({ title, subtitle, percentage, color, onClick }: StoreCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-[32px] p-6 transition-all duration-500 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${onClick ? 'cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:scale-[1.02]' : ''
                }`}
        >
            <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
            <div className="flex justify-center">
                <DonutChart percentage={percentage} color={color} />
            </div>
        </div>
    )
}
