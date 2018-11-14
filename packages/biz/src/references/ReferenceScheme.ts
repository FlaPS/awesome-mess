import {createScheme, defaultLang, SchemeLang} from '../core/Scheme'
import {KeyBuilder} from '../core/KeyBuilder'
import * as properties from '../core/properties'

export type ReferenceItemVO = {
    name?: string,
    creationDate?: string,
    creatorUserId?: string,
}
export const createReferenceScheme = <P>(
    name: string,
    lang: SchemeLang = defaultLang,
    additionalProperties?: P,
    isNested: boolean = false
) => {
    const parts = name.split('_').map((s, i) =>
        i === 0
            ? s.toLocaleLowerCase()
            : s.charAt(0) + s.slice(1).toLocaleLowerCase()
    )
    const camelCase = parts.join('')

    return createScheme({
        isReference: true,
        name,
        keyBuilder: new KeyBuilder().increment(camelCase + 'Id'),
        lang,
        properties: Object.assign(
            {
                name: properties.name,
                creationDate: properties.creationDate,
                creatorUserId: properties.creatorUserId,
            },
            additionalProperties
        ),
    })
}

