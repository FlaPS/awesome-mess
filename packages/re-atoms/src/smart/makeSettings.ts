import {messageFactory, Pure} from './Pure'
import {Scheme} from '@local/biz'
import {getCurrentRoutePattern} from '../app/nav'

const makeSettingsActions = <Settings>(defaultSettings: Settings) => ({
    onSettingsChange: messageFactory<Partial<Settings>>('onSettingsChange'),
})


type PropsWithSettings<Settings> = Partial<Settings> &
    {
        defaultSettings: Partial<Settings>,
        scheme?: Scheme<any>,
        settingsKey?: string
    }


export default <Settings>(defaultSettings: Settings) =>
    Pure<PropsWithSettings<Settings>>()
        .addMsg(makeSettingsActions(defaultSettings))
        .addReducer((state: PropsWithSettings<Settings>, action) => {
                if (action.type === 'onSettingsChange') {
                    localStorage.setItem(getCurrentRoutePattern(), JSON.stringify(action.payload))
                    return {...state, ...action.payload}
                }

                const settings = JSON.parse(localStorage.getItem(getCurrentRoutePattern()))

                return {...state, ...state.defaultSettings, ...settings}

            }
        )

