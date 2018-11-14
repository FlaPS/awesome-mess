import {KeyedMap} from './fp/baseTypes'
import {messageFactory, Pure} from './Pure'
import {assocPath, isEmpty, keys} from 'ramda'
import {createSpec, Scheme} from '@local/biz'
import {getStore} from '@local/root'

type ErrorMap<D> = Partial<KeyedMap<string[], D>>

type TouchMap<D> = Partial<KeyedMap<boolean, D>>

type RequiredMap<D> = Partial<KeyedMap<boolean, D>>

type Validator<D> = (value: D) => ErrorMap<D>

type FormState<D> = {
    model?: Partial<D>
    errors?: Partial<ErrorMap<D>>
    touch?: Partial<TouchMap<D>>
}

type ChangePayload<D, T = any> = {
    property: keyof D;
    value: T
}

const makeFormActions = <D>() => ({
    onChange: messageFactory<ChangePayload<D>>('onChange'),
    onSubmit: messageFactory<Partial<D>>('onSubmit'),
    onCancel: messageFactory<Partial<D>>('onCancel'),
})

const makeValidationEffect = <D>() => ({
    onValid: messageFactory<Partial<D>>('onValid'),
    onInvalid: messageFactory<Partial<D>>('onInvalid'),
})

const makeChangeReducer = <D>() =>
    (state: { model: D, initial: D } = {model: {} as D, initial: undefined}, action) => {
        if (action.type === 'onChange')
            return assocPath(['model', action.payload.property], action.payload.value, state)

        return state
    }

const defaultValidationReducerParams = <D>() => ({
    errors: {} as ErrorMap<D>,
    model: {} as D,
    isValid: true,
})

const makeValidationReducer = <D>(validator) =>
    (state: { errors: ErrorMap<D>, model: D, isValid: boolean } = defaultValidationReducerParams<D>(), action) => {
        if (action.type === 'onChange' || action.type === 'init') {
            const globalState = getStore().getState()
            let newState = assocPath(['errors'], validator(state.model, globalState), state)
            // console.log('invoke validator', state.model, newState.errors)
            newState = assocPath(['isValid'], isEmpty(newState.errors), newState)
            // console.log('state after change', newState)
            return newState
        }
        return state

    }

const defaultTouchReducerParams = <D>() => ({
    touched: {} as TouchMap<D>,
    onlyTouchedErrors: false,
})

const makeTouchReducer = <D>() =>

    (state: { touched: TouchMap<D>, onlyTouchedErrors: boolean } = defaultTouchReducerParams<D>(), action) => {
        if (action.type === 'onChange') {
            const newState = assocPath(['touched', action.payload.property], true, state)
            return newState
        }

        return state
    }


const makeSchemeReducer = <D>(scheme: Scheme<D>) =>
    (state: { scheme: Scheme<D> }, action) =>
        state.scheme
            ? state
            : {...state, scheme}


const makeEditableModel = <D>() =>
    Pure<{ model: D }>()
        .addMsg(makeFormActions<D>())
        .addReducer(makeChangeReducer<D>())
        .addReducer(makeTouchReducer<D>())

export const formPure = <T, D = Partial<T>>(scheme: Scheme<T>, fields?: Array<keyof T>) =>
    makeEditableModel<D>()
        .addProps({scheme, forked: true})
        .recieveProps<{ forked: boolean }>((state, props, next) => {
                let merge = {}
                if (props.forked !== next.forked) {
                    merge = Object.assign({}, {touched: {}})
                }
                if ((!next.forked || isEmpty(state.touched))) {
                    merge = Object.assign({}, {model: next.model})
                }
                if (state.model !== next.model && !next.forked) {
                    merge = Object.assign(state, {model: next.model, touched: {}})
                    merge = makeValidationReducer<D>(
                        createSpec(scheme, fields || keys(scheme.properties))
                    )(merge, {type: 'init'})

                }
                return Object.assign({}, state, merge)
            }
        )
        .addReducer(makeSchemeReducer(scheme))
        .addReducer(makeValidationReducer<D>(
            createSpec(scheme, fields || keys(scheme.properties))
        ))
        .addEff(makeValidationEffect<D>())
        .addResolver((effects, prev: any, next: any) =>
            //  JSON.stringify(prev.model) !== JSON.stringify(next.model) &&
            (isEmpty(next.errors)
                ? effects.onValid(next.model)
                : effects.onInvalid(next.model))
        )
/*
export const formPure = <T, D = Partial<T>> (scheme: Scheme<T>, fields?: Array<keyof T>) =>
        caseRender(formPureRaw(scheme, fields))
            .isNilOrEmpty('model', CenteredCaption('Объект не существует или у вас нет прав доступа'))*/