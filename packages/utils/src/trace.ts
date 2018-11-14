/**
 * Tap function to test incoming arguments and the result of a function call
 *
 * <example>
 *     const fnc = (a, b) => a + b
 *     const tracedSum = trace('sum call', 'log')
 *     tracedSum(fnc)(2, 3)
 *     // console outputs :  sum call, fnc,
 *     // ARGS: 2, 3
 *     // RESULT: 5
 *
 * </example>
 */

export type TraceLevel =
    | 'log'
    | 'debug'
    | 'warn'
    | 'error'
    | 'info'

export const trace = (message: string = 'trace call', traceLevel: TraceLevel = 'log') =>
    <T>(f: (...params: any[]) => T) =>
        (...args): T => {
            const time = new Date().valueOf()
            const result = f(...args)
            const elapsedTime = new Date().valueOf() - time
            console[traceLevel](
                message,
                'function ' + f.name,
                'elapsedTime ' + elapsedTime,
                '\nARGS:', ...args,
                '\nRESULT:', result
            )
            return result
        }
