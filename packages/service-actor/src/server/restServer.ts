import * as console from 'console'
import * as Koa from 'koa'
import compress from './koa-compress'
import * as body from 'koa-better-body'
import * as zlib from 'zlib'
import * as cors from 'koa-cors'
import {getAppRouter} from './api/router'
import {Server} from 'http'
import * as serve from 'koa-static'
import * as websockify from 'koa-websocket'
import * as Router from 'koa-router'
import {getLogger} from '@local/logger'
import WSBack from './WSBack'
import * as ip from 'ip'
import * as send from 'koa-send'
import getBackendStore from '../getBackendStore'
import {actions as iso} from '@local/isomorphic'
import * as biz from '@local/biz'

let server: Server
let app

const allSockets: WSBack[] = []

export const defaultServiceConfig = {
    httpPort: 8000,
    httpAddress: ip.address(),
    httpStaticPort: 8000,
    seed: biz.defaultSeedConfig,
    reloadState: false,
    slaveKey: undefined as any as string,
    isMaster: true,
    syncKey: undefined as string,
    runSeed: true,
}

export type ServiceConfig = typeof defaultServiceConfig

export const closeServer = async () => {
    if (server && server.listening)
        await new Promise(resolve => {
                server.close(resolve)
                server = undefined
            }
        )
}
export default async function startHTTPServer(config: ServiceConfig = defaultServiceConfig) {

    console.log('start http server with config', config)
    await closeServer()


    allSockets.forEach(s => s.dispose())
    allSockets.length = 0
    let numOfRequests: number = 0

    const corsConfig = {
        origin: '*',

        methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
        credentials: true,
        headers: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Accept-Encoding',
            'Accept-Language',
            'Access-Control-Request-Headers',
            'Access-Control-Request-Method',
            'Access-Control-Allow-Credentials',
            'Connection',
            'Host',
            'Origin',
            'Referer',
            'User-Agent',
        ],
    }

    const allowCors = cors(corsConfig)

    // console.log('CORS config', corsConfig)

    const compressor: any = compress({
        threshold: 2048,
        flush: zlib.Z_NO_FLUSH,
    })


    const logHandler = async (context: any, next: any) => {
        numOfRequests += 1
        const start = new Date().getTime()
        await next()
        const ms = new Date().getTime() - start
        getLogger('REST').info(`${context.method} ${context.url} - ${ms}ms ${numOfRequests}`)
    }

    const originWhiteList = [
        `http://${config.httpAddress}:${config.httpStaticPort}`,
        `http://${config.httpAddress}:${config.httpPort}`,
        'http://localhost:8000',
        'http://localhost:8001',
    ]

    const allowRequest = async (context: any, next: any) => {
        /* if (originWhiteList.indexOf(context['request']['header']['origin']) != -1)
         {*/
        await next()
        /* }
         else {
             console.log('badrequest')
             context['response']['message'] = 'Your origin adress is not allowed for CORS'
         }*/
    }

    app = websockify(new Koa())

    const router = getAppRouter(config)

    // Using routes
    const api = new Router()


    api.get('/*', async (ctx: any, next) => {
        allSockets.push(new WSBack(ctx.websocket))
    })

    app
        .use(logHandler)
        .use(allowCors)
        .use(allowRequest)
        .use(body())
        .use(compressor)
        .use(serve(__dirname + '/../../../re-atoms/public/'))
        .use(router.routes())

        .use(router.allowedMethods())
        .use(async function (ctx, next) {
            if (!ctx.originalUrl.includes('api'))
                await send(ctx, '/index.html', {root: __dirname + '/../../../re-atoms/public/'})
        })

    app.ws.use(api.routes())
        .use(api.allowedMethods())

    /*server = require('http')
                       .createServer(app.callback())*/

    const createServer = async () =>
        new Promise(resolve => {
                const server = (app as Koa).listen(config.httpPort, config.httpAddress, () => resolve(server))
            }
        )
    server = (await createServer()) as Server

    if (!config.reloadState) {
        getBackendStore().dispatch(iso.backend.seed(config.seed))
    } else {
        getBackendStore().dispatch(iso.backend.reloadState())
    }


    console.log('rest server started', config.httpAddress, config.httpPort)


    // room = new SocketRoom(server)
    /*  server.listen(
          config.HTTP_PORT,
          () =>
              getLogger('REST').info(`Modern app Listening on port ${config.HTTP_PORT }`)
      )*/

}



