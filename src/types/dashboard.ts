export interface Employee {
    id: number
    name: string
    location: 'Ichki dokon' | 'Tashqi dokon'
    phone: string
    ip?: string
    arrivalTime: string
    balance: number
    efficiency: number
    attempts?: number
    tasks?: number
}

export interface Task {
    id: number
    title: string
    description: string
    category: string
    time: string
    bonus: string
    generalDesc: string
    isPermanent: boolean
}

export type ModalType =
    | 'ichki-dokon'
    | 'kelganlar'
    | 'kechikkanlar'
    | 'kelmaganlar'
    | null
