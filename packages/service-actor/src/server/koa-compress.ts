/**
 * Module dependencies.
 */
let compressible = require('compressible')
let isJSON = require('koa-is-json')
let status = require('statuses')
let Stream = require('stream')
let bytes = require('bytes')
let zlib = require('zlib')
/**
 * Encoding methods supported.
 */
let encodingMethods = {
    gzip: zlib.createGzip,
    deflate: zlib.createDeflate
};
/**
 * Compress middleware.
 *
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */
export default function (options) {
    options = options || {};
    let filter = options.filter || compressible;
    let threshold = !options.threshold ? 1024
        : typeof options.threshold === 'number' ? options.threshold
            : typeof options.threshold === 'string' ? bytes(options.threshold)
                : 1024;
    return function compress(ctx, next) {
        ctx.vary('Accept-Encoding');
        return next().then(function () {
            let body = ctx.body;
            if (!body)
                return;
            if (ctx.compress === false)
                return;
            if (ctx.request.method === 'HEAD')
                return;
            if (status.empty[ctx.response.status])
                return;
            if (ctx.response.get('Content-Encoding'))
                return;
            // forced compression or implied
            if (!(ctx.compress === true || filter(ctx.response.type)))
                return;
            // identity
            let encoding = ctx.acceptsEncodings('gzip', 'deflate', 'identity');
            if (!encoding)
                ctx.throw(406, 'supported encodings: gzip, deflate, identity');
            if (encoding === 'identity')
                return;
            // json
            if (isJSON(body))
                body = ctx.body = JSON.stringify(body);
            // threshold
            if (threshold && ctx.response.length < threshold)
                return;
            ctx.set('Content-Encoding', encoding);
            ctx.res.removeHeader('Content-Length');
            let stream = ctx.body = encodingMethods[encoding](options);
            if (body instanceof Stream) {
                body.pipe(stream);
            }
            else {
                stream.end(body);
            }
        });
    };
};
