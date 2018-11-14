export const DAY_MILIS = 24 * 60 * 60 * 1000

export const cloneDate = (date: Date): Date =>
    new Date(date.getTime())

export const formatYYYYMMDD = (date: Date, delimiter: string = '-'): string =>
    date.getFullYear() +
    delimiter +
    formatMM(date) +
    delimiter +
    formatDD(date)

export const formatMM = (date: Date): string =>
    formatTwoSignFromInt(date.getMonth() + 1)

export const formatDD = (date: Date): string =>
    formatTwoSignFromInt(date.getDate())

export const formatTwoSignFromInt = (value: number): string =>
    value >= 10 ? String(value) : '0' + value
