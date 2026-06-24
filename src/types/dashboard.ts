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
}

export type ModalType =
    | 'ichki-dokon'
    | 'kelganlar'
    | 'kechikkanlar'
    | 'kelmaganlar'
    | null
