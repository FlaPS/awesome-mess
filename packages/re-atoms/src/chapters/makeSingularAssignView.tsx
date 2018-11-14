import * as React from 'react'

import {Title} from '../styles/Typography'
import {Spans} from '../layout/Span'
import {Scheme} from '@local/biz'
import Paper from '../layout/Paper'
import {makeSelectionToolbar} from '../grids/SmartToolbar'

import {ExpandableProps, TreeMode} from '../grids/Expandable'
import pureTree from '../grids/pureTree'
import {capitalize} from '../refs/RefTemplate/RefGridTemplate'

export default function <T, P extends ExpandableProps<T>>(Tree: React.ComponentType<P>, scheme: Scheme<T>) {

    const Toolbar = makeSelectionToolbar<T>()

    const Comp = pureTree(scheme)
        .addProps({
            title: 'Название',
            caption: 'подпись', onOk: console.log,
            onCancel: console.log,
            okText: 'Назначить',
            cancelText: 'Отмена',

        })
        .ap(props =>
            <div>
                <Title>
                    {props.title}
                </Title>
                <Spans.Caption2>
                    {props.caption}
                </Spans.Caption2>
                <Paper>
                    <Toolbar {...props}>
                        {capitalize(scheme.lang.plural)}
                    </Toolbar>
                    <Tree {...props}
                          mode={TreeMode.SELECT}
                          idKey={scheme.uniqueProperty}
                    />
                </Paper>
            </div>
        )

    return Comp
}
