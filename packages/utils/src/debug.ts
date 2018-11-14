export default <F extends Function>(f: F, interrup: boolean = true): F => (
    (...args) => {
        if (interrup)

            return f(...args)
    }
) as any as F