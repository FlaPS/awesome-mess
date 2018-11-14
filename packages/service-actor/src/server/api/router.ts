import * as Router from 'koa-router'
import {IKoaContextWithBody, wrapResponse} from '../helpers'

import getBackendStore from '../../getBackendStore'
import * as iso from '@local/isomorphic'
import {equals, filter, where} from 'ramda'
import {ServiceConfig} from '../restServer'
import activation from './activation'

type AuthRequestFields = {
    login: string
    password: string
}

type AuthResponseFields = {
    token: string
}

export const getAppRouter = (config: ServiceConfig) => {
    const router = new Router()
    router
        .get('/api/json',
            wrapResponse(() =>
                getBackendStore().getState()
            )
        )
        .post('/api/clientState/',
            wrapResponse((ctx: IKoaContextWithBody<AuthRequestFields>) => {
                const state = getBackendStore().getState()
                const req = ctx.request.fields

                /** state was not initialized */
                /*    if (!state.sync.isMaster && state.sync.lastSlaveSyncMilis === undefined)
                        return state

                    let identifier = getUserByLogin(req.login)(state).id*/
                /*  let result: any

                  const {userId} =  filter(where(
                      {
                          login: equals(req.login)
                      }
                  ))(sel(biz.USER).asList(state))[0]

                  if(userId === undefined)
                      result = new ServiceError('Unknown slave key', '401')
                  else    */
                const result = state


                return result
            }))
        .get('/api/clientState/',
            wrapResponse((ctx: IKoaContextWithBody<AuthRequestFields>) => {
                const state = getBackendStore().getState()

                const result = state


                return result
            }))

    if (config.isMaster)
        router.post('/api/activation/',
            wrapResponse(async (ctx: IKoaContextWithBody<iso.activation.ActivationRequest>)
                : Promise<iso.activation.ActivationResponse> =>
                await activation(ctx.request.fields)
            ))


    return router
}
