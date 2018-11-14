import {Request} from 'koa'
import * as Router from 'koa-router'
import * as fs from 'fs'
import {getLogger} from '@local/logger'
import axios from 'axios'

const logger = getLogger('httpHelpers')

interface IKoaContextWithBody<T> extends Router.IRouterContext {
    request: IKoaBodyParserRequest<T>
}

interface IKoaBodyParserRequest<T> extends Request {
    fields: T
    files: any
    json: any
    multipart: any
    body: any
}

/**
 * read file promise, src is full patch. Put src with __dirmame concacentated
 * @param src
 */
const readFileThunk = src =>
    new Promise(
        (resolve, reject) =>
            fs.readFile(
                src,
                {'encoding': 'utf8'},
                (err, data) =>
                    err ?
                        reject(err)
                        :
                        resolve(data)
            )
    )

const wrapResponse = <T>(executor: { (ctx?: IKoaContextWithBody<T>, next?: Function): any }): Router.IMiddleware =>
    async (ctx: IKoaContextWithBody<T>, next?: () => any): Promise<any> => {
        if (next)
            await next()

        if (ctx.status !== 200) {
            try {
                const result = await executor(ctx)
                if (result) {
                    ctx.body = result
                    ctx.status = 200
                }
            } catch (e) {
                logger.error(
                    ` error while wrapping response ${JSON.stringify(e.toString())}
                      path:  ${JSON.stringify(ctx.request.originalUrl)}
                      request fields: ${JSON.stringify(ctx.request.fields)}`)

            }
        }
    }


let baseURL: string = 'http://report.office.tetra-soft.ru/'// 'https://ggr.gtionline.ru/report/'

export class ServiceError extends Error {

    static UNAUTHORIZED_USER = ''

    public name = 'ServiceError'
    public isService = true

    constructor(public message: string, public code: string) {
        super(message)
    }
}

export const isServiceError = (obj): obj is ServiceError => obj.isService

export const defaultHeaders: any = {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/json;charset=UTF-8',
}


export const post = async (controller: string,
                           controllerMethod: string,
                           payload: any = undefined,
                           query: any = undefined,
                           headers: any = {}): Promise<any> => {
    const data = getData(payload)
    const url = getURL(controller, controllerMethod, query)

    const response = await axios({
        url,
        method: 'post',
        baseURL,
        headers: Object.assign({}, defaultHeaders, headers),
        data,
        withCredentials: true,
    })

    return response.data
}

function getData(payload: any): any {
    let data = ''

    if (typeof payload === 'string')
        data = payload

    else if (payload !== undefined) {
        for (const key in payload)
            data += key + '=' + encodeURIComponent(payload[key]) + '&'

        data = data.slice(0, -1)
    }

    return data
}


export function getURL(controller: string, method: string, query: any): string {
    let url = `api?controller=${controller}&method=${method}&`

    if (typeof query === 'string')
        url += query + '&'

    else if (query !== undefined)
        for (const key in query)
            url += key + '=' + encodeURIComponent(query[key]) + '&'

    url = url.slice(0, -1)

    return url
}

export const setUpGateway = (url: string) =>
    baseURL = url

export const getGateway = () =>
    baseURL

export const invokeController = async (
    name: string,
    method: string,
    payload: any = undefined,
    query: any = undefined): Promise<any> => {

    getLogger('httpHelpers').info('Request legacy controller', name, method, query)
    const result = await post(name, method, JSON.stringify(payload), query)

    if (result.isError)
        throw new ServiceError(result.message, result.code)

    return result;
}
export {
    IKoaBodyParserRequest,
    IKoaContextWithBody,
    readFileThunk,
    wrapResponse
}
