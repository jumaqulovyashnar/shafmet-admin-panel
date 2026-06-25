import type { Employee } from '@/types/dashboard'

const firstNames = [
    'Jane', 'Floyd', 'Ronald', 'Marvin', 'Jerome', 'Kathryn', 'Jacob', 'Kristin',
    'Albert', 'Leslie', 'Devon', 'Esther', 'Robert', 'Maria', 'James', 'Patricia',
    'John', 'Linda', 'Michael', 'Barbara', 'William', 'Elizabeth', 'David', 'Susan',
    'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen', 'Charles', 'Lisa',
    'Christopher', 'Nancy', 'Daniel', 'Betty', 'Matthew', 'Margaret', 'Anthony', 'Sandra',
    'Donald', 'Ashley', 'Mark', 'Emily', 'Paul', 'Dorothy', 'Steven', 'Kimberly',
    'Andrew', 'Carol', 'Kenneth', 'Michelle', 'Kevin', 'Amanda', 'Brian', 'Melissa',
    'George', 'Deborah', 'Timothy', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
    'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Gary', 'Kathleen', 'Nicholas', 'Amy',
    'Eric', 'Angela', 'Jonathan', 'Shirley', 'Stephen', 'Anna', 'Larry', 'Brenda',
    'Justin', 'Emma', 'Scott', 'Virginia', 'Brandon', 'Catherine', 'Frank', 'Samantha',
    'Benjamin', 'Debra', 'Gregory', 'Rachel', 'Raymond', 'Carolyn', 'Samuel', 'Janet',
    'Patrick', 'Christine', 'Alexander', 'Diana', 'Nathan', 'Helen',
]

const lastNames = [
    'Cooper', 'Miles', 'Richards', 'McKinney', 'Bell', 'Murphy', 'Jones', 'Watson',
    'Flores', 'Alexander', 'Lane', 'Howard', 'Smith', 'Johnson', 'Williams', 'Brown',
    'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson',
    'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark',
    'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez',
    'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez',
    'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell',
    'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers',
    'Reed', 'Cook', 'Morgan', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins',
    'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler',
    'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz',
    'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods',
    'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison',
]

function genPhone(i: number) {
    const area = 201 + (i % 799)
    const mid = String(100 + (i * 7) % 900).padStart(3, '0')
    const end = String((i * 13) % 10000).padStart(4, '0')
    return `(${area}) 555-${end}`
}

function genIp(i: number) {
    return `${100 + (i % 200)}.${(i * 3) % 256}.${(i * 7) % 256}`
}

const locations: ('Ichki dokon' | 'Tashqi dokon')[] = ['Ichki dokon', 'Tashqi dokon']

export const allEmployees: Employee[] = Array.from({ length: 500 }, (_, i) => {
    const h = i < 350 ? 7 : i < 440 ? 8 : 9
    const m = (i * 7) % 60
    return {
        id: i + 1,
        name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        location: locations[i % 2],
        phone: genPhone(i),
        ip: genIp(i),
        arrivalTime: `${h}:${String(m).padStart(2, '0')}`,
        balance: Math.round((5000 + (i * 1234) % 55000) / 1000) * 1000,
        efficiency: 10 + (i * 17) % 91,
        attempts: 1 + (i % 10),
        tasks: (i * 3) % 9,
    }
})

export const onTimeEmployees: Employee[] = Array.from({ length: 500 }, (_, i) => ({
    id: 20000 + i,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    location: locations[i % 2],
    phone: genPhone(i),
    ip: genIp(i),
    arrivalTime: `7:${String((i * 7) % 60).padStart(2, '0')}`,
    balance: Math.round((5000 + (i * 1234) % 55000) / 1000) * 1000,
    efficiency: 10 + (i * 17) % 91,
    attempts: 1 + (i % 10),
    tasks: (i * 3) % 9,
}))

export const lateEmployees: Employee[] = Array.from({ length: 500 }, (_, i) => ({
    id: 5000 + i,
    name: `${firstNames[(i + 25) % firstNames.length]} ${lastNames[(i + 30) % lastNames.length]}`,
    location: locations[i % 2],
    phone: genPhone(1000 + i),
    ip: genIp(1000 + i),
    arrivalTime: `8:${String((i * 7) % 60).padStart(2, '0')}`,
    balance: Math.round((5000 + (i * 1234) % 55000) / 1000) * 1000,
    efficiency: 10 + (i * 17) % 91,
    attempts: 1 + (i % 10),
    tasks: (i * 3) % 9,
}))

export const absentEmployees: Employee[] = Array.from({ length: 500 }, (_, i) => ({
    id: 10000 + i,
    name: `${firstNames[(i + 50) % firstNames.length]} ${lastNames[(i + 40) % lastNames.length]}`,
    location: locations[i % 2],
    phone: genPhone(2000 + i),
    ip: genIp(2000 + i),
    arrivalTime: `${10 + (i % 3)}:${String((i * 11) % 60).padStart(2, '0')}`,
    balance: 0,
    efficiency: 0,
    attempts: 1 + (i % 5),
    tasks: 0,
}))

export const ichkiDokonEmployees = allEmployees.filter((e) => e.location === 'Ichki dokon').slice(0, 500)
export const tashqiDokonEmployees = allEmployees.filter((e) => e.location === 'Tashqi dokon').slice(0, 500)
