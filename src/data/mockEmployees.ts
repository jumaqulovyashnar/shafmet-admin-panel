import type { Employee } from '@/types/dashboard'

export const allEmployees: Employee[] = [
    { id: 1, name: 'Jane Cooper', location: 'Ichki dokon', phone: '(225) 555-0118', ip: '544.232.021', arrivalTime: '7:30', balance: 32000, efficiency: 80, attempts: 2 },
    { id: 2, name: 'Floyd Miles', location: 'Ichki dokon', phone: '(205) 555-0100', ip: '256.323.325', arrivalTime: '7:32', balance: 52350, efficiency: 10, attempts: 1 },
    { id: 3, name: 'Ronald Richards', location: 'Ichki dokon', phone: '(302) 555-0107', ip: '256.326.356', arrivalTime: '7:35', balance: 52145, efficiency: 10, attempts: 1 },
    { id: 4, name: 'Marvin McKinney', location: 'Ichki dokon', phone: '(252) 555-0126', ip: '235.635.385', arrivalTime: '7:45', balance: 41254, efficiency: 75, attempts: 3 },
    { id: 5, name: 'Jerome Bell', location: 'Ichki dokon', phone: '(629) 555-0129', ip: '326.365.235', arrivalTime: '7:50', balance: 25320, efficiency: 65, attempts: 10 },
    { id: 6, name: 'Kathryn Murphy', location: 'Ichki dokon', phone: '(406) 555-0120', ip: '256.365.235', arrivalTime: '7:51', balance: 0, efficiency: 45, attempts: 1 },
    { id: 7, name: 'Jacob Jones', location: 'Ichki dokon', phone: '(208) 555-0112', ip: '235.236.562', arrivalTime: '7:52', balance: 3000, efficiency: 60, attempts: 2 },
    { id: 8, name: 'Kristin Watson', location: 'Ichki dokon', phone: '(704) 555-0127', ip: '235.323.325', arrivalTime: '7:53', balance: 21000, efficiency: 25, attempts: 4 },
    { id: 9, name: 'Albert Flores', location: 'Tashqi dokon', phone: '(316) 555-0116', ip: '112.432.543', arrivalTime: '8:01', balance: 44000, efficiency: 70, attempts: 1 },
    { id: 10, name: 'Leslie Alexander', location: 'Tashqi dokon', phone: '(907) 555-0101', ip: '198.231.452', arrivalTime: '8:10', balance: 28000, efficiency: 55, attempts: 2 },
]

// Vaqtida kelganlar (7:00 - 8:00 orasida)
export const onTimeEmployees = allEmployees.filter((e) => {
    const [h, m] = e.arrivalTime.split(':').map(Number)
    return h < 8 || (h === 8 && m === 0)
})

// Kechikib kelganlar (8:00 dan keyin)
export const lateEmployees = allEmployees.filter((e) => {
    const [h, m] = e.arrivalTime.split(':').map(Number)
    return h > 8 || (h === 8 && m > 0)
})

// Kelmaganlar (mock — ID 11-12)
export const absentEmployees: Employee[] = [
    { id: 11, name: 'Devon Lane', location: 'Ichki dokon', phone: '(505) 555-0125', ip: '544.232.021', arrivalTime: '10:05', balance: 0, efficiency: 0, attempts: 2 },
    { id: 12, name: 'Esther Howard', location: 'Ichki dokon', phone: '(603) 555-0123', ip: '256.365.235', arrivalTime: '9:45', balance: 0, efficiency: 0, attempts: 1 },
]

export const ichkiDokonEmployees = allEmployees.filter((e) => e.location === 'Ichki dokon')
export const tashqiDokonEmployees = allEmployees.filter((e) => e.location === 'Tashqi dokon')
