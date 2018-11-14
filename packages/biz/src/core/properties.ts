import {valueTypes} from './valueTypes'


export const creationDate = valueTypes.date({
    langRU: 'дата создания',
})

export const creatorUserId = valueTypes.itemOf({
    schemeName: 'USER',
    langRU: 'создал',
})

export const name = valueTypes.string({
    required: true,
    unique: true,
    saveModificationDate: true,
    langRU: 'название',
})

export const comment = valueTypes.string({
    langRU: 'комментарий',
})

export const color = valueTypes.string({
    langRU: 'цвет',
})

