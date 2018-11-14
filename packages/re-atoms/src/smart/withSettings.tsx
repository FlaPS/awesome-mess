import * as React from 'react'

const getSettings = key => JSON.parse(localStorage.getItem(key))
const setSettings = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value))

type SettingsKeyGetter<Props> = string | ((props: Props) => string)

type PropsWithSettings<Props, Settings> = Props & Partial<Settings> &
    {
        defaultSettings?: Partial<Settings>
        settingsKey?: string | SettingsKeyGetter<Props>
        onSettingsChange?: (settings: Partial<Settings>) => any
    }

export default function <S>(defaultSettings: S) {
    return function <P>(
        Comp: React.ComponentType<P>,
        settignsKey: SettingsKeyGetter<any> | string
    ): React.ComponentType<PropsWithSettings<P, S>> {


        return function (props: PropsWithSettings<P, S>) {
            const key = typeof settignsKey === 'function' ? settignsKey(props) : settignsKey
            const savedSettings = getSettings(key)

            function onSettingsChange(settings: Partial<S>) {
                const key = typeof settignsKey === 'function' ? settignsKey(props) : settignsKey
                setSettings(key, settings)
            }

            return <Comp {...props} {...savedSettings} onSettingsChange={onSettingsChange}/>
        } as any as React.ComponentType<PropsWithSettings<P, S>>
    }
}