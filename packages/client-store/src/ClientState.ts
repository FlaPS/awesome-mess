import {BizState} from '@local/biz'
import {CredentialsState} from './parts/credentials'
import {ConnectionState} from './parts/connection'
import {UIState} from './parts/ui'

export type ClientState = {
    biz: BizState
    credentials?: CredentialsState
    connection?: ConnectionState
    frontConfig: {
        env?: 'dev' | 'production' | 'storybook' | 'node'
        gateway?: string
    }
    ui: UIState
}
