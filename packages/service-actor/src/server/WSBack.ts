import getBackendStore from '../getBackendStore'
import * as WebSocket from 'ws'
import {actions as iso} from '@local/isomorphic'
import * as fsa from '@local/fsa'
import {isType} from '@local/fsa'
import * as biz from '@local/biz'
import {getLogger} from '@local/logger'
import {generateGuid} from '@local/random'


const {log, error, debug} = getLogger('WSBack')

export default class WSBack {

    public static broadcastAction = (action: fsa.FactoryAnyAction) => {
        for (let i = 0; i < WSBack.sockets.length; i++)

            if ((
                    fsa.isType(iso.master.push)(action) ||
                    fsa.isType(iso.slave.push)(action) ||
                    fsa.isNamespace(iso.client.factory)
                )
                && WSBack.sockets[i].userId
                && WSBack.sockets[i].subscribed
            )
                WSBack.sockets[i].send(action)

            else
                WSBack.sockets[i].send(action)

    }
    public static clearSockets = () => {
        while (WSBack.sockets.length)
            WSBack.sockets[0].dispose()
    }
    private static sockets: WSBack[] = []
    public readonly guid: string = generateGuid()
    public subscribed = false
    send = <T extends fsa.FactoryAnyAction>(action: T) => {
        if (!this.isOpened)
            return

        try {
            this.ws.send(JSON.stringify(action))
        } catch (e) {
            error('Could not send action to socket. Socket closed', JSON.stringify(e))
            this.dispose()
        }
    }
    dispose = () => {
        this.isOpened = false
        const index = WSBack.sockets.indexOf(this)

        if (index !== -1)
            WSBack.sockets.splice(index, 1)
        this.ws.removeAllListeners()
        this.ws.close()
    }
    private userId: string
    private masterEventId
    private slaveEventId
    private isOpened: boolean
    private openListener = () => {
        this.isOpened = true
        this.send(iso.backend.publicMeta(getBackendStore().getState().publicMeta))
    }
    private messageListener = (data: any, flags: { binary: boolean }) => {
        debug('new socket message', this.userId, data)
        const message = this.parseAction(data)
        message.meta = {...message.meta, socketGuid: this.guid}
        if (isType(iso.client.authRequest)(message)) {
            const {login, password} = message.payload as any
            const state = getBackendStore().getState()
            const users = biz.sel(biz.USER).asList()(state).filter(u =>
                u.login === login && u.password === password
            )

            const user = users.length && users[0]

            const action = user
                ? iso.backend.authSuccess({snapshotId: '', userId: user.userId})
                : iso.backend.authFailed({error: 'Wrong user or password'})


            this.send(action)
        }

        if (isType(iso.client.requestActivation)(message))
            getBackendStore().dispatch(message)

        if (isType(iso.client.subscribe)(message))
            if (this.userId)
                this.subscribed = true

        if (isType(iso.client.push)(message))
            getBackendStore().dispatch(message)
        /* if (isType(iso.client.push)(message))
             message.payload.forEach( getBackendStore().dispatch)

         if (message.type.startsWith('biz'))
             getBackendStore().dispatch(message)
 */
    }
    private parseAction = (data: string): fsa.FactoryAnyAction => {
        let message: fsa.FactoryAnyAction
        try {
            message = JSON.parse(data)
        } catch (e) {
            error('Could not parse socket message ', e, this)
            message = {type: 'error', payload: 'errorPayload'}
        }

        return message
    }

    /**
     * Socket already connected
     * @param ws
     */
    constructor(protected ws: WebSocket) {
        WSBack.sockets.push(this)
        log('socket connected')
        this.isOpened = true
        this.send(iso.backend.publicMeta(getBackendStore().getState().publicMeta))
        this.ws.addListener('message', this.messageListener)
        this.ws.addListener('open', this.openListener)
        this.ws.addListener('close', this.dispose)

    }
}
