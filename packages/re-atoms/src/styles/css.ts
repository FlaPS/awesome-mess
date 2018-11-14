export const defaultTransition = (...properties: string[]) =>
    properties
        .map(prop => `${prop} .25s ease-in-out`)
        .join(', ')

export default {
    defaultTransition,
}
