import {BizState} from '@local/biz'
import {CredentialsState} from './parts/credentials'
import {ConnectionState} from './parts/connection'
import {UIState} from './parts/ui'
import * as iso from '@local/isomorphic/'

export type ClientState = {
    biz: BizState
    credentials?: CredentialsState
    connection?: ConnectionState
    publicMeta?: iso.PublicMeta
    frontConfig: {
        env?: 'dev' | 'production' | 'storybook' | 'node'
        gateway?: string
    }
    ui: UIState
}
