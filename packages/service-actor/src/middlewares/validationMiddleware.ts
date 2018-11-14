import {BizAction, EntityScheme, schemes, sel} from '@local/biz'
import * as Ajv from 'ajv'
import {MiddlewareAPI} from 'redux'
import {BackendState} from '../getBackendStore'

const validationMiddleware = (store: MiddlewareAPI<BackendState>) => next => action => {
    let error = ''
    if (isBizAction(action)) {
        const schemeName = action.type.split('/')[1]
        const actionType = action.type.split('/')[2]
        switch (actionType) {
            case 'ADDED':
                error = validateCreateAction(schemeName, action, store)
                break
            case 'UPDATED':
                error = validateUpdateAction(schemeName, action, store)
                break
            case 'DELETED':
            case 'REMOVED':
                error = validateDeleteAction(schemeName, action, store)
                break
        }
    }

    if (error) {
        console.log(`validation error in action ${action.type}
         with payload ${JSON.stringify(action.payload)}: ${error}`)
    }

    return next(action)
}

const validateCreateAction = <T>(schemeName: string, action: BizAction<T>, store): string => {
    if (!action.payload)
        return 'no payload in action'
    if (!action.payload.id)
        return 'missing id in payload'
    if (!action.payload.patch)
        return 'missing patch in payload'
    if (sel(schemes[schemeName]).asList()(store.getState())
        .map(item => item[schemes[schemeName].uniqueProperty])
        .indexOf(action.payload.id) === -1
    )
        return `item with id ${action.payload.id} already exists`

    const result = validators[schemeName](action.payload.patch)
    if (!result)
        return 'missing required property'
    else return ''
}

const validateUpdateAction = <T>(schemeName: string, action: BizAction<T>, store): string => {
    if (!action.payload)
        return 'no payload in action'
    if (!action.payload.id)
        return 'missing id in payload'
    if (!action.payload.patch)
        return 'missing patch in payload'

    const requiredFields = getRequiredFields(schemes[schemeName])
    const storeHasItem =
        sel(schemes[schemeName]).asList()(store.getState())
            .map(item => item[schemes[schemeName].uniqueProperty])
            .indexOf(action.payload.id) !== -1

    if (!storeHasItem)
        return `no item with id ${action.payload.id} exists`
    if (requiredFields.some(field => action.payload.patch.hasOwnProperty(field) && !action.payload.patch[field]))
        return 'cannot patch with empty required field'
    return ''
}

const validateDeleteAction = <T>(schemeName: string, action: BizAction<T>, store): string => {
    if (!action.payload)
        return 'no payload in action'
    if (!action.payload.id)
        return 'missing id in payload'

    if (sel(schemes[schemeName]).asList()(store.getState())
        .map(item => item[schemes[schemeName].uniqueProperty])
        .indexOf(action.payload.id) === -1
    )
        return `item with id ${action.payload.id} doesnt exists`
    return ''
}

const getJsonSchema = (schemeName: string) => ({
    type: 'object',
    required: getRequiredFields(schemes[schemeName]),
})

const getRequiredFields = <T, P>(scheme: EntityScheme<T, P>): string[] => {
    let reqFields
    reqFields =
        Object
            .keys(scheme.properties)
            .filter(property => scheme.properties[property].required)
    return reqFields
}

const compileAjvValidators = () => {
    const ajv = new Ajv()
    const initValidators = Object.create(null)
    const JSONschemes = buildAllSchemes()
    for (const scheme in JSONschemes)
        initValidators[scheme] = ajv.compile(JSONschemes[scheme])
    return initValidators
}

const buildAllSchemes = () => {
    const JSONschemes = Object.create(null)
    for (const scheme in schemes)
        JSONschemes[scheme] = getJsonSchema(scheme)
    return JSONschemes
}
const validators = compileAjvValidators()

const isBizAction = action => action.type.split('/')[0] === 'biz'


export default validationMiddleware
