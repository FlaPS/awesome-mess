import getFrontendStore, {FrontState} from '../../store/'
import {Column} from './Grid'
import {defaultLang, Scheme, schemeLens, schemes} from '@local/biz'
import {AssociativeArray, capitalize} from '@local/utils'


export const gridData = <T>(scheme: Scheme<T>) =>
    (state: FrontState | any) =>
        ({
            data: scheme.asMap()(state) as AssociativeArray<T>,
            scheme,
        })


export const getReferenceColumn = <T>(scheme: Scheme<T> | string) => (prop: keyof T): Column<T, any> => {
    const refScheme = typeof scheme === 'string'
        ? schemes[scheme].properties[prop].schemeName
        : scheme.properties[prop].schemeName

    const title = capitalize((refScheme.lang || defaultLang).singular)

    return ({
        dataIndex: prop,
        title,
        render: value =>
            value
                ? schemeLens(refScheme).get(getFrontendStore().getState())[value].name
                : 'REF IS EMPTY',
    })
}
