import {ActionCreator, actionCreatorFactory, EmptyActionCreator} from '@local/fsa'
import {Action} from 'redux'

const factory = actionCreatorFactory('Actors')

export default {
    input: factory<Action>('INPUT'),
    output: factory<Action>('OUTPUT'),
    disconnected: factory('DISCONNECTED'),
    initialized: factory('INITIALIZED'),
}

export {
    EmptyActionCreator,
    ActionCreator
}
