import {createServer} from 'net'

export class FreePortNotFoundError extends Error {
    constructor(port) {
        super(`No any free port greater than ${port}`)
    }
}

const isPortInUse = async (port: number, address: string = '127.0.0.1') =>
    new Promise(resolve => {
        const server = createServer()
            .listen(port, address)
            .once('error', () => {
                server.removeAllListeners()
                resolve(true)
            })
            .once('listening', () =>
                server
                    .removeAllListeners()
                    .close(() => resolve(false))
            )
    })

export default async (start: number) => {
    let port = start

    while ((await isPortInUse(port++)))
        if (port > 65535)
            throw new FreePortNotFoundError(start)

    return port
}
