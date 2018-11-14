export type Point2D = {
    x: number
    y: number
}

export const generate = (count: number = 100000,
                         w: number = 100,
                         h: number = 100): Point2D[] => {
    const result = []
    for (let i = 0; i < count; i++)
        result[i] = {x: Math.floor(Math.random() * w), y: i / count * h}

    return result
}