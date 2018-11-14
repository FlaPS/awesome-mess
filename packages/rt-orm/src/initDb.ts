import {getKnex} from './knexConnection'
import * as Biz from '@local/biz'
import {EntityScheme, ValueMeta} from '@local/biz'
import * as Knex from 'knex'
import {CreateTableBuilder, SchemaBuilder} from 'knex'
import {AssociativeArray, toIndexedArray} from '@local/utils'
import {difference, last} from 'ramda'
import * as toSnakeCase from 'to-snake-case'
import {getLogger} from '@local/logger'

type manyToManyTable = {
    firstSchemeName: string,
    secondSchemeName: string,
}

const logger = getLogger('orm')

export const initDb = async () => {
    try {
        const knex = getKnex()
        const manyToManyTables = findManyToManyRelations()

        const now = Date.now()
        await createTablesForSchemes(toIndexedArray(Biz.schemes), knex)
        logger.log(`time elapsed: ${(Date.now() - now) / 1000}s`)
        const now2 = Date.now()
        await createAllManyToManyTables(manyToManyTables, knex)
        //     await createForeignKeysForAllSchemes(knex)
        logger.log(`time elapsed: ${(Date.now() - now2) / 1000}s`)
        logger.log('tables created')

    } catch (e) {
        logger.error(`error during initialising db: ${e.toString()}`)
    }
}

const getIdColumnName = <T, P>(scheme: EntityScheme<T, P>) =>
    last(scheme.keyBuilder.keys).columnName

const mapPropTypeToKnexType = (propType: string) => {
    switch (propType) {
        case 'text':
            return 'text'
        case 'string' :
        case 'item' :
        case 'array' :
        case 'daterange':
            return 'string'
        case 'int' :
        case 'inc' :
        case 'externalKey':
        case 'number':
        case 'itemOf':
            return 'integer'
        case 'datetime':
        case 'date':
            return 'dateTime'
        case 'timestamp':
            return 'timestamp'
        case 'guid':
            return 'binary'
        default:
            return ''
    }
}

const createTableForScheme = <T, P>(scheme: EntityScheme<T, P>, knex: Knex): SchemaBuilder =>
    knex.schema.createTable(getDBTableName(scheme.table || scheme.name),
        (table: CreateTableBuilder) => createTableOptions(scheme.properties, table, scheme))


const pickNonKeyProps = <T, P>(scheme: EntityScheme<T, P>) => {
    const keyProps = scheme.keyBuilder.keys.map(key => key.path)
    const schemeProps = Object.keys(scheme.properties)
    return difference(schemeProps, keyProps)
}

const createTableOptions =
    (
        properties: AssociativeArray<ValueMeta>,
        table: CreateTableBuilder,
        scheme: EntityScheme<any>
    ) => {
        buildPrimaryColumnsForSchemeKey(table, scheme)
        pickNonKeyProps(scheme)
            .forEach(property =>
                createColumn(properties[property], property, table)
            )
        table.boolean('removed').defaultTo(false)
    }

const buildPrimaryColumnsForSchemeKey = (table: CreateTableBuilder, scheme: EntityScheme<any>, columnName?: string) => {
    const primaryColumnNames = scheme.keyBuilder.keys.map(key => key.columnName)
    scheme.keyBuilder.keys
        .forEach(key => {
            const name = key.columnName
            switch (key.type) {
                case 'guid':
                    table[mapPropTypeToKnexType(key.type)](name, 32)
                    break
                case 'inc':
                case 'externalKey':
                    table[mapPropTypeToKnexType(key.type)](name).unsigned()
                    break
                default:
                    table[mapPropTypeToKnexType(key.type)](name)
            }
        })
    table.primary(primaryColumnNames)
}

const createColumn = (property: ValueMeta, columnName: string, table: CreateTableBuilder) => {
    /*if (property.unique && property.required) {
        table.text(columnName).unique().notNullable()
        return
    }

    if (property.required) {
        table.text(columnName).notNullable()
        return
    }

    if (property.unique) {
        table.text(columnName).unique()
        return
    }*/
    if (property.type === 'daterange') {
        table.string(`${columnName}Start`)
        table.string(`${columnName}End`)
    } else {
        const columnType = mapPropTypeToKnexType(property.type)
        if (columnType)
            property.type === 'itemOf' ?
                table.integer(columnName).unsigned() :
                table[columnType](columnName)
    }

}

const buildForeignKeyColumn = <T, P>(scheme: EntityScheme<T, P>, table: CreateTableBuilder): string[] => {
    const createdColumns = []
    const isKeyPrimitive = scheme.keyBuilder.keys.length === 1
    scheme.keyBuilder.keys.forEach(key => {
        const columnName = isKeyPrimitive || key.isTerminal ? `${scheme.name.toLowerCase()}id` : key.columnName
        createdColumns.push(columnName)
        const mappedType = mapPropTypeToKnexType(key.type)

        switch (mappedType) {
            case 'binary':
                // @ts-ignore
                table[mappedType](columnName, 32)
                break
            case 'integer':
                table[mappedType](columnName).unsigned()
                break
            default:
                table[mappedType](columnName)
        }
    })
    table
        .foreign(createdColumns)
        .references(scheme.keyBuilder.keys.map(key => key.columnName))
        .inTable(scheme.name.toLowerCase())
        .onDelete('CASCADE')
    return createdColumns
}


const createManyToManyTable = (tablesObject: manyToManyTable, knex: Knex) => {
    try {
        const firstScheme = Biz.schemes[tablesObject.firstSchemeName]
        const firstTableName = firstScheme.name.toLowerCase()
        const secondScheme = Biz.schemes[tablesObject.secondSchemeName]
        const secondTableName = secondScheme.name.toLowerCase()

        const tableName = `${firstTableName}_set_${secondTableName}`
        return knex.schema.createTable(tableName, table => {
                const createdColumns = []
                table.primary([...buildForeignKeyColumn(firstScheme, table), ...buildForeignKeyColumn(secondScheme, table)])
            }
        )
    } catch (e) {
        logger.error(`error in creating many to many table: ${e.toString()}`)
    }
}

const findManyToManyRelations = () =>
    toIndexedArray(Biz.schemes)
        .filter(({properties}) => toIndexedArray(properties).some(property => property['type'] === 'arrayOf'))
        .map(({name, properties}) =>
            ({name, properties: toIndexedArray(properties).filter(property => property['type'] === 'arrayOf')}))
        .map(({name, properties}) =>
            properties.map(({schemeName}) =>
                ({
                    firstSchemeName: toSnakeCase(name).toUpperCase(),
                    secondSchemeName: toSnakeCase(schemeName).toString().toUpperCase(),
                })))
        .reduce((flat, current) => flat.concat(current))

/*const createForeignKeysForAllSchemes = async (knex: Knex) => {
    const allSchemesKeyPromises = []
    const schemesWithForeignKeys =
        toIndexedArray(Biz.schemes)
            .filter(({properties}) => toIndexedArray(properties).some(property => property['type'] === 'itemOf'))
    for (let i = 0; i < schemesWithForeignKeys.length; i++)
        allSchemesKeyPromises.push(createForeignKeysForScheme(schemesWithForeignKeys[i] as any, knex))
    await Promise.all(allSchemesKeyPromises)
}

const createForeignKeysForScheme = async (scheme: EntityScheme<any, any>, knex: Knex) => {
    const foreignKeysProps =
        Object
            .keys(scheme.properties)
            .filter(prop => scheme.properties[prop].type === 'itemOf')

    const keyPromises = []
    for (let i = 0; i < foreignKeysProps.length; i++)

            keyPromises.push(knex.schema.table(getDBTableName(scheme.name), table =>
                createManyToOneRelation(scheme.properties[foreignKeysProps[i]], foreignKeysProps[i], table))
            )
    await Promise.all(keyPromises)
}

const createManyToOneRelation =
    (property: ValueMeta, columnName: string, table: CreateTableBuilder) =>
        table
            .foreign(columnName)
            .references('id')
            .inTable(getDBTableName(Biz.schemes[property.schemeName.toString()].name))
*/

const createTablesForSchemes = async (schemes: Array<EntityScheme<any, any>>, knex: Knex) => {
    const tableCreatedPromises = []

    for (let i = 0; i < schemes.length; i++)
        tableCreatedPromises.push(createTableForScheme(schemes[i], knex))
    await Promise.all(tableCreatedPromises)
}

const createAllManyToManyTables = async (tables: Array<manyToManyTable>, knex: Knex) => {
    const tableCreatedPromises = []
    for (let i = 0; i < tables.length; i++)
        tableCreatedPromises.push(createManyToManyTable(tables[i], knex))

    return await Promise.all(tableCreatedPromises)
}

export const getDBTableName = (schemeName: string) => toSnakeCase(schemeName)
