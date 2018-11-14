import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import ModalListDialog from './ModalListDialog'

const data = []

declare const module
storiesOf('Controls/modalListDialog', module)
    .add('simple modal list dialog', () =>
        <ModalListDialog
            label={'Добавление прав доступа'}
            subLabel={'Группа скважин Абаканская будет доступна для следующих пользователей:'}
            list={data.sort()}
            onCancel={action('cancel clicked')}
            onConfirm={action('confirm clicked')}
        />
    )
