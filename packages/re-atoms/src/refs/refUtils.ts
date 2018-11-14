import getStore from '../store/'
import {getByKey, schemes} from '@local/biz'

export const getUserName = (userId: string) => {

    const currUser = getByKey(schemes.USER)(userId)(getStore().getState())
    return currUser ? currUser.lastName + ' ' + currUser.firstName.slice(0, 1).toUpperCase() + '.'
        + currUser.patrName.slice(0, 1).toUpperCase() + '.' : 'Неизвестно'
}
