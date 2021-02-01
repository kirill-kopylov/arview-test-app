export enum TASK_TYPES {
    holiday,
    event,
    other
}

export interface Task {
    type: TASK_TYPES,
    date: string,
    title: string,
    address?: string,
    time?: string,
    cost?: number,
    other?: string
}