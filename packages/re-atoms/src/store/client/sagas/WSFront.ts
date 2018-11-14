import {Action} from 'redux'
import {actions as conn} from '../parts/connection'


/*if(isBackend)
    WebSocket = require('ws')*/

const logger = console

export class WSFront {


    public connect = (gateway: string) => {

        if (gateway && this.dispatch) {
            if (gateway === this.gateway)
                return
            this.gateway = gateway
        }

        if (!this.gateway)
            return
        this.gateway = this.gateway.replace('http://', 'ws://')

        if (!this.gateway.endsWith('/test'))
            this.gateway += '/test'

        if (!this.gateway.includes('ws://'))
            this.gateway = 'ws://' + this.gateway

        if (this.ws)
            this.freeSocket()
        try {
            this.ws = new WebSocket(this.gateway)
            this.ws.addEventListener('open', this.openListener)
            this.ws.addEventListener('close', this.closeListener)
            this.ws.addEventListener('error', this.closeListener)
            this.ws.addEventListener('message', this.messageListener)
        } catch (e) {
            this.dispatch(conn.error('Не удалось подключиться к серверу'))
        }
    }
    send = <T extends Action>(action: T) =>
        this.ws.send(JSON.stringify(action))
    freeSocket = () => {
        clearTimeout(this.reconnectTimeoutId)
        this._connected = false
        this.ws.removeEventListener('open', this.openListener)
        this.ws.removeEventListener('close', this.closeListener)
        this.ws.removeEventListener('error', this.closeListener)
        this.ws.removeEventListener('message', this.messageListener)
        this.ws.close()
    }
    dispose = () =>
        this.freeSocket()
    protected closeListener = (): any => {
        this.dispatch(conn.failed(this.gateway))
        logger.warn('socket closed')
        this.freeSocket()
        this.reconnectTimeoutId = setTimeout(this.connect, 1000)
    }
    protected openListener = (): any => {
        this._connected = true
        this.dispatch(conn.connected())
    }
    protected messageListener = (ev: MessageEvent): any => {

        const message = JSON.parse(ev.data)
        logger.info('Receive message', message)
        this.dispatch(message)
    }
    private reconnectTimeoutId
    private userId: string
    private ws: WebSocket
    private gateway: string

    constructor(public dispatch?) {

    }

    private _connected: boolean = false

    public get connected(): boolean {
        return this._connected
    }

}
