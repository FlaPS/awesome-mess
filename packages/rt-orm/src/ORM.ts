import {BizAction, BizPayload, BizState, EntityScheme, getSchemeByName, schemes, sel} from '@local/biz'
import {pick} from 'ramda'
import {getKnex} from './knexConnection'
import * as Knex from 'knex'
import {CreateTableBuilder} from 'knex'
import * as fsa from '@local/fsa'
import {toIndexedArray} from '@local/utils'
import {getDBTableName} from './initDb'
import {getLogger} from '@local/logger'
import * as moment from 'moment'

const logger = getLogger('orm')

export const UpdateAction = async (action: BizAction<any>) => {
    const schemeName = action.type.split(fsa.factoryDelimeter)[1]
    const actionType = action.type.split(fsa.factoryDelimeter)[2]

    try {
        const knex = getKnex()
        switch (actionType) {
            case 'ADDED':
                await doCreateAction(schemeName, action.payload, knex)
                break
            case 'UPDATED':
                await doUpdateAction(schemeName, action.payload, knex)
                break
            case 'REMOVED':
                await doRemoveAction(schemeName, action.payload, knex)
                break
            case 'DELETED':
                await doDeleteAction(schemeName, action.payload, knex)
                break
            case 'POPULATED':
                await doPopulateAction(schemeName, action.payload, knex)
                break
            default:
                logger.error(`unknown action type: ${actionType}`)
        }
    } catch (e) {
        console.error(`error in handling ${action.type}: ${e.toString()}`)
    }
}

const doCreateAction = async (schemeName: string, payload: BizPayload<any>, knex?: Knex) => {
    try {
        await knex(getDBTableName(schemeName))
            .insert(transformBizItemForDb(
                {...pickKnownNotArrayProps(schemes[schemeName])(payload.patch), creatorUserId: payload.userId},
                schemeName
            ))

        const manyToManyProps = pickManyToManyProps(schemes[schemeName])
        for (let i = 0; i < manyToManyProps.length; i++) {
            const relatedObjects = []
            const firstTable = schemes[schemeName].name.toLowerCase()
            const relatedScheme = schemes[schemes[schemeName].properties[manyToManyProps[i]].schemeName]
            const secondTable = relatedScheme.name.toLowerCase()
            const relatedTableName = `${firstTable.toLowerCase()}_set_${secondTable.toLowerCase()}`
            if (payload.patch[manyToManyProps[i]]) {
                payload.patch[manyToManyProps[i]].forEach(prop => relatedObjects
                    .push({
                        [schemes[schemeName].uniqueProperty]: payload.patch[schemes[schemeName].uniqueProperty],
                        [relatedScheme.uniqueProperty]: prop,
                    })
                )
                await knex(relatedTableName).insert(relatedObjects)
            }
        }
    } catch (e) {
        logger.error(
            `error in create action for scheme ${schemeName}
             with payload ${JSON.stringify(payload.patch)}: ${e.toString()}`
        )
    }
}

const doDeleteAction = async (schemeName: string, payload: BizPayload<any>, knex?: Knex) => {
    try {
        knex(getDBTableName(schemeName)).delete().where('id', payload.id)
    } catch (e) {
        logger.error(
            `error in delete action for scheme ${schemeName}
             with payload ${JSON.stringify(payload.patch)}: ${e.toString()}`
        )
    }
}

const parseIdToDB = (id: string, scheme: EntityScheme<any>, throughId: boolean = false) => {
    const conds = scheme.keyBuilder.parseSpec(id) || []
    Object.keys(conds)
        .forEach(cond => {
            const thisKey = scheme.keyBuilder.keys.find(key => key.path === cond)
            if (thisKey.isTerminal && !throughId) {
                conds['id'] = conds[cond]
                delete conds[cond]
            }
            if (!thisKey.isTerminal && thisKey.path !== thisKey.columnName) {
                conds[thisKey.columnName] = conds[thisKey.path]
                delete conds[thisKey.path]
            }

            if (thisKey.type === 'guid')
                conds[thisKey.path] = conds[thisKey.path].split('-').join('')

            if (thisKey.type === 'date')
                conds[thisKey.path] = moment(conds[thisKey.path]).format('YYYY-MM-DD HH:mm:ss')

        })
    return conds
}

const doUpdateAction = async (schemeName: string, payload: BizPayload<any>, knex?: Knex) => {
    const scheme = schemes[schemeName]
    try {
        if (toIndexedArray(pickKnownNotArrayProps(scheme)(payload.patch)).length > 0)
            await knex(getDBTableName(scheme.name))
                .update(transformBizItemForDb(
                    {...pickKnownNotArrayProps(scheme)(payload.patch)},
                    schemeName
                ))
                .where(parseIdToDB(payload.id.toString(), scheme))
        await patchManyToManyRelations(schemeName, payload, knex)
    } catch (e) {
        logger.error(
            `error in update action for scheme ${schemeName}
            with payload ${JSON.stringify(payload.patch)}: ${e.toString()}`
        )
    }
}

const doRemoveAction = async (schemeName: string, payload: BizPayload<any>, knex?: Knex) => {
    try {
        await knex(getDBTableName(schemeName))
            .update(transformBizItemForDb({
                    ...pickKnownNotArrayProps(schemes[schemeName])(payload.patch),
                    creatorUserId: payload.userId, removed: true,
                },
                schemeName))
            .where(parseIdToDB(payload.id.toString(), schemes[schemeName]))
    } catch (e) {
        logger.error(`error in remove action with payload ${JSON.stringify(payload.patch)}: ${e.toString()}`)
    }
}

export const ResetAction = async (state: { biz: BizState }) => {
    try {
        await removeForeignKeys()
        await truncateManyToManyTables()
        await truncateAllTables()
        await resetAllData(state)
        await createForeignKeys()
    } catch (e) {
        logger.error(`error during reset action: ${e.toString()}`)
    }
}

const removeForeignKeys = async () => {
    try {
        const manyToManyTables = getManyToManyTablesNames()
        const tablePromises = []
        manyToManyTables.forEach(tableName => tablePromises.push(removeForeignKeysFromTable(tableName)))
        await Promise.all(tablePromises)
    } catch (e) {
        logger.error(`error with removing foreign keys: ${e.toString()}`)
    }
}

const removeForeignKeysFromTable = (tableName: string) => {
    try {
        const knex = getKnex()
        const firstSchemeName = tableName.split('_set_')[0].toUpperCase()
        const secondSchemeName = tableName.split('_set_')[1].toUpperCase()
        const firstForeignKey = buildForeignKeyName(tableName, firstSchemeName)
        const secondForeignKey = buildForeignKeyName(tableName, secondSchemeName)
        return knex.schema.table(tableName, table => {
            table.dropForeign([], firstForeignKey)
            table.dropForeign([], secondForeignKey)
        })

    } catch (e) {
        logger.error(`error with removing foreign keys for table ${tableName}: ${e.toString()}`)
    }
}

const buildForeignKeyName = (tableName: string, schemeName: string): string => {
    const scheme = getSchemeByName(schemeName)
    const isKeyPrimitive = scheme.keyBuilder.keys.length === 1
    let keysName = `${tableName}_`
    scheme.keyBuilder.keys.forEach(key => {
        const keyName = isKeyPrimitive || key.isTerminal ? `${scheme.name.toLowerCase()}id` : key.columnName
        keysName += `${keyName}_`
    })
    return `${keysName}foreign`
}

const createForeignKeys = async () => {
    const manyToManyTables = getManyToManyTablesNames()
    const keyPromises = []
    manyToManyTables.forEach(table => keyPromises.push(createForeignKeysForTable(table)))
    await Promise.all(keyPromises)
}

const createForeignKeysForTable = async (tableName: string) => {
    const knex = await getKnex()
    const firstScheme = getSchemeByName(tableName.split('_set_')[0].toUpperCase())
    const secondScheme = getSchemeByName(tableName.split('_set_')[1].toUpperCase())
    return knex.schema.table(tableName, table => {
        addForeignKeyForScheme(firstScheme, table)
        addForeignKeyForScheme(secondScheme, table)
    })
}

const addForeignKeyForScheme = <T, P>(scheme: EntityScheme<T, P>, table: CreateTableBuilder) => {
    const createdColumns = []
    const isKeyPrimitive = scheme.keyBuilder.keys.length === 1
    scheme.keyBuilder.keys.forEach(key => {
        const columnName = isKeyPrimitive || key.isTerminal ? `${scheme.name.toLowerCase()}id` : key.columnName
        createdColumns.push(columnName)
    })
    table
        .foreign(createdColumns)
        .references(scheme.keyBuilder.keys.map(key => key.columnName))
        .inTable(scheme.name.toLowerCase())
        .onDelete('CASCADE')
    return createdColumns
}

const truncateManyToManyTables = async () => {
    try {
        const knex = getKnex()
        const manyToManyTables = getManyToManyTablesNames()
        const result = []
        for (let i = 0; i < manyToManyTables.length; i++)
            result.push(knex(manyToManyTables[i]).truncate())
        await Promise.all(result)
        logger.log('many to many tables truncated')
    } catch (e) {
        logger.error(`error during truncating many to many tables: ${e.toString()}`)
    }
}

const truncateAllTables = async () => {
    try {
        logger.log('truncating tables')
        const knex = getKnex()
        const truncPromises = []
        for (let i = 0; i < toIndexedArray(schemes).length; i++)
            truncPromises.push(knex(getDBTableName(toIndexedArray(schemes)[i].name)).truncate())
        await Promise.all(truncPromises)
        logger.log(' tables truncated')
    } catch (e) {
        logger.error(`error during truncating tables: ${e.toString()}`)
    }
}

const resetAllData = async (state: { biz: BizState }) => {
    const schemePromises = []
    for (const scheme in schemes) {
        if (schemes.hasOwnProperty(scheme)) {                       // workaround for fixing ts lint error
            const newState = sel(schemes[scheme]).asList()(state)
            schemePromises.push(putArrayInDb(scheme, newState))
        }
    }
    const now = Date.now()
    await Promise.all(schemePromises)
    const manyToManyPromises = []
    for (const scheme in schemes) {
        if (schemes.hasOwnProperty(scheme))
            manyToManyPromises.push(insertAllManyToMany(scheme, sel(schemes[scheme]).asList()(state)))
    }
    await Promise.all(manyToManyPromises)
    logger.log(`time spent on insert all: ${(Date.now() - now) / 1000}`)
}

const pickKnownNotArrayProps = <T>(scheme: EntityScheme<T>) => (item: T): Partial<T> => {

    const schemeKeys = scheme.keyBuilder.keys.map(key => key.path)
    const keys =
        Object
            .keys(scheme.properties)
            .filter(key => scheme.properties[key] && scheme.properties[key].type !== 'arrayOf')
            .concat(schemeKeys)

    return pick(keys)(item)
}


const putArrayInDb = async (scheme: string, newStateArray: Array<any>) => {

    try {
        const knex = getKnex()
        const filteredStateArray =
            newStateArray
                .map(item => pickKnownNotArrayProps(schemes[scheme])(item))
                .map(item => transformBizItemForDb(item, scheme))
        await knex(getDBTableName(schemes[scheme].name)).insert(filteredStateArray)
    } catch (e) {
        logger.error(`Error while inserting item: ${e.toString()}`)
    }
}

const pickManyToManyProps = <T>(scheme: EntityScheme<T>) =>
    Object.keys(scheme.properties).filter(prop => scheme.properties[prop].type === 'arrayOf')

const insertAllManyToMany = async (scheme: string, newStateArray) => {
    const manyToManyRelation = pickManyToManyProps(schemes[scheme])
    for (let i = 0; i < manyToManyRelation.length; i++) {
        const relatedObjects = []
        const firstTable = schemes[scheme].name.toLowerCase()
        const relatedScheme = schemes[schemes[scheme].properties[manyToManyRelation[i]].schemeName]
        const secondTable = relatedScheme.name.toLowerCase()
        const relatedTableName = `${firstTable.toLowerCase()}_set_${secondTable.toLowerCase()}`
        newStateArray
            .forEach(el => {
                if (el[manyToManyRelation[i]])
                    el[manyToManyRelation[i]]
                        .forEach(prop => relatedObjects
                            .push({
                                ...parseIdToDB(el.id, schemes[scheme], true),
                                ...parseIdToDB(prop, relatedScheme, true),
                            })
                        )
            })
        const knex = getKnex()
        await knex(relatedTableName).insert(relatedObjects)
    }
}

const transformBizItemForDb = (item, schemeName) => {
    const newItem = item
    const scheme = schemes[schemeName]
    scheme.keyBuilder.keys
        .forEach(key => {
            if (!key.isTerminal && key.path !== key.columnName) {
                newItem[key.columnName] = newItem[key.path]
                delete newItem[key.path]
            }

            if (key.type === 'guid')
                newItem[key.path] = newItem[key.path].split('-').join('')

            if (key.type === 'date')
                newItem[key.path] = moment(newItem[key.path]).format('YYYY-MM-DD HH:mm:ss')

            if (key.isTerminal) {
                newItem['id'] = newItem[key.path]
                delete newItem[key.path]
            }
        })

    Object
        .keys(scheme.properties)
        .forEach(propName => {
            if (newItem[propName] === 'undefined')
                newItem[propName] = null

            if (scheme.properties[propName].type === 'daterange' && newItem.hasOwnProperty(propName)) {
                const start = newItem[propName] ? moment(newItem[propName].start).format('YYYY-MM-DD HH:mm:ss') : null
                const end = newItem[propName] ? moment(newItem[propName].end).format('YYYY-MM-DD HH:mm:ss') : null
                newItem[`${propName}Start`] = start
                newItem[`${propName}End`] = end
                delete newItem[propName]
            }
            if (
                (
                    scheme.properties[propName].type === 'datetime' ||
                    scheme.properties[propName].type === 'date'
                )
                && newItem[propName]) {
                newItem[propName] = moment(newItem[propName]).format('YYYY-MM-DD HH:mm:ss')
            }
            if (scheme.properties[propName].type === 'item' ||
                scheme.properties[propName].type === 'array') {
                newItem[propName] = JSON.stringify(newItem[propName])
            }
        })
    return newItem
}


const doPopulateAction = async (schemeName: string, payload: BizPayload<any>, knex?: Knex) => {
    if (payload.id instanceof Array)
        if (payload.patch instanceof Array)
            await applyMultiPatchToMultiIds(payload.id, schemeName, payload.patch, knex)
        else await applySinglePatchToManyIds(payload.id, schemeName, payload.patch, knex)
    else await applyMultiPatchToSingleId(payload.id, schemeName, payload.patch, knex, payload.userId)

}

const patchManyToManyRelations =
    async (schemeName: string, payload: BizPayload<any> | any, knex?: Knex, id?: string) => {
        try {
            const manyToManyProps = pickManyToManyProps(schemes[schemeName])
            const objectId = id ? id : payload.id
            for (let i = 0; i < manyToManyProps.length; i++) {
                const relatedObjects = []
                const firstTable = schemes[schemeName].name.toLowerCase()
                const relatedScheme = schemes[schemes[schemeName].properties[manyToManyProps[i]].schemeName]
                const secondTable = relatedScheme.name.toLowerCase()
                const relatedTableName = `${firstTable.toLowerCase()}_set_${secondTable.toLowerCase()}`
                if (payload && payload.patch && payload.patch[manyToManyProps[i]]) {
                    payload.patch[manyToManyProps[i]].forEach(prop => relatedObjects
                        .push({
                            ...parseIdToDB(objectId, schemes[schemeName], true),
                            ...parseIdToDB(prop, relatedScheme, true),
                        })
                    )
                    await knex(relatedTableName)
                        .where(parseIdToDB(objectId, schemes[schemeName], true))
                        .del()
                    await knex(relatedTableName).insert(relatedObjects)
                }
            }
        } catch (e) {
            logger.error(`error in patch many to many relations: ${e.toString()}`)
        }
    }

const applyMultiPatchToSingleId =
    async (id: string, schemeName: string, patch: Array<any>, knex?: Knex, userId: string = null) => {
        try {
            const patchObject = patch.reduce((result, currValue) => {
                for (const key in currValue)
                    if (currValue.hasOwnProperty(key))
                        result[key] = currValue[key]
                return result
            }, {})
            await knex(getDBTableName(schemes[schemeName].name))
                .update(transformBizItemForDb(
                    {...pickKnownNotArrayProps(schemes[schemeName])(patchObject)},
                    schemeName
                ))
                .where(parseIdToDB(id.toString(), schemes[schemeName]))
            await patchManyToManyRelations(schemeName, patch, knex, id)
        } catch (e) {
            console.error(`error in apply multi patch to single id: ${e.toString()}`)
        }
    }

const applySinglePatchToManyIds = async (ids: Array<string>, schemeName: string, patch: any, knex?: Knex) => {
    try {
        const UpdatePromises = []
        for (let i = 0; i < ids.length; i++) {
            const payload = {patch: {...patch}, id: ids[i]}
            UpdatePromises.push(doUpdateAction(schemeName, payload, knex))
        }
        await Promise.all(UpdatePromises)
    } catch (e) {
        logger.error(`error in apply single patch to many ids ${e.toString()}`)
    }
}

const applyMultiPatchToMultiIds = async (ids: Array<string>, schemeName: string, patch: Array<any>, knex?: Knex) => {
    try {
        if (ids.length !== patch.length)
            logger.error('error in apply multi patch to multi ids: different length of ids array and patch array')
        else {
            const patches = []
            for (let i = 0; i < ids.length; i++)
                patches
                    .push({
                        patch: {...patch[i]},
                        id: ids[i],
                    })
            const updatePromises = []
            for (let i = 0; i < patches.length; i++)
                updatePromises.push(doUpdateAction(schemeName, patches[i], knex))
            await Promise.all(updatePromises)
        }
    } catch (e) {
        logger.error(`error in apply multi patch to multi ids: ${e.toString()}`)
    }
}

const getManyToManyTablesNames = (): Array<string> => {
    const names = []
    toIndexedArray(schemes)
        .forEach(scheme =>
            Object.keys(scheme.properties)
                .forEach(propName => {
                    if (scheme.properties[propName].type === 'arrayOf') {
                        const firstSchemeName = scheme.name.toLowerCase()
                        const secondSchemeName = schemes[scheme.properties[propName].schemeName].name.toLowerCase()
                        names.push(`${firstSchemeName}_set_${secondSchemeName}`)
                    }
                })
        )

    return names
}
