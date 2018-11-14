import {AdminItemVO, defaultLang, getScheme, Property, Scheme, schemes, sel, USER} from '@local/biz'
import {Column} from './Grid'
import {capitalize} from '../../refs/RefTemplate/RefGridTemplate'
import renderers from './renderers'

export default <T, Spec>(scheme: Scheme<T, Spec>) => {

    const renderName = sel(scheme).getShortName
    const renderString = _ => _

    const simple = (dataIndex: keyof T, render = renderString, sorter?): Column<T & Spec, any> => ({
        // @ts-ignore
        title: scheme.properties[dataIndex].langRU,
        dataIndex,
        render,
    })

    const reference = (dataIndex: keyof T): Column<T & Spec, any> => {
        const ownTitle = (schemes as any)[scheme.properties[dataIndex].langRU]
        // @ts-ignore
        const refScheme = getScheme((schemes as any)[scheme.properties[dataIndex].schemeName])
        const title = capitalize(ownTitle || (refScheme.lang || defaultLang).singular)
        return ({
            dataIndex,
            title,
            render: (value, item) => {

                const fullName = getScheme(refScheme).getFullName

                return value
                    ? fullName(value)()
                    : 'REF IS EMPTY'
            }
        })
    }

    const date = (dataIndex: keyof T): Column<T & Spec, any> =>
        ({
            ...simple(dataIndex),
            render: renderers.date,
            sorter: () => (a, b) => a < b ? -1 : 1,
        })

    const nameColumn = (render = renderName): Column<T & Spec, any> =>
        ({
            title: 'Название',
            dataIndex: scheme.uniqueProperty,
            render: item => sel(scheme).getFullName(item)(),
        })

    const creator = (): Column<AdminItemVO, any> =>
        ({
            title: 'Создал',
            dataIndex: 'creatorUserId',
            render: item => sel(USER).getShortName(item)(),
        })

    const creationDate = (): Column<AdminItemVO, any> =>
        ({
            // @ts-ignore
            ...date('creationDate'),
            title: 'Дата создания',

        })

    const inferr = (dataIndex: keyof T, render = undefined): Column<T & Spec, any> => {
        const prop: Property = scheme.properties[dataIndex]
        if (dataIndex === 'name')
            return nameColumn()
        if (dataIndex === 'creationDate')
        // @ts-ignore
            return creationDate()
        if (dataIndex === 'creatorUserId')
        // @ts-ignore
            return creator()
        if (prop.type === 'itemOf')
            return reference(dataIndex)
        if (prop.type === 'datetime')
            return date(dataIndex)
        if (prop.type === 'date')
            return date(dataIndex)
        return simple(dataIndex, render)

    }

    const create = (descriptors: Array<keyof T | Column<T, any>>): Column<T, any>[] =>
        descriptors.map(d => typeof d === 'string' ? inferr(d) : d) as any as Column<T, any>[]

    return {
        inferr,
        create,
        reference,
        simple,
        nameColumn,
        date,
        creator,
        creationDate,
    }

}

