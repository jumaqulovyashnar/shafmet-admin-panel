interface DonutChartProps {
    percentage: number
    color: string
    size?: number
    strokeWidth?: number
}

export default function DonutChart({
    percentage,
    color,
    size = 200,
    strokeWidth = 28,
}: DonutChartProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference
    const center = size / 2

    return (
        <div className="relative inline-flex items-center justify-center group" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transition-transform duration-500 group-hover:rotate-180"
                style={{ transform: 'rotate(-90deg)' }}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background track - light purple/gray full circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#e8e7f3"
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc - colored portion */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                <span className="text-5xl font-bold text-gray-900 mb-2">{percentage}%</span>
                <span className="text-xs text-gray-500 text-center leading-tight max-w-[120px]">
                    Vazifa foizda olinganda
                </span>
            </div>
        </div>
    )
}
