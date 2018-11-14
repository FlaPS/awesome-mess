import * as React from 'react'
import PageLayout from '../layout/PageLayout'

import {Title} from '../styles/Typography'

import {HBox} from '../layout'
import {Spans} from '../layout/Span'

import Button from 'material-ui/Button'
import {pluralize, Scheme} from '@local/biz'
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
            <PageLayout>
                <Title>
                    {props.title}
                </Title>
                <Spans.Caption2>
                    {props.caption}
                </Spans.Caption2>
                <Paper>
                    <Toolbar {...props}>
                        {({value}) =>
                            value && value.length
                                ? `Выбрано ${pluralize(scheme)(value.length)}`
                                : capitalize(scheme.lang.plural)
                        }
                    </Toolbar>
                    <Tree {...props}
                          mode={TreeMode.MULTI_SELECT}
                          idKey={scheme.uniqueProperty}
                    />
                </Paper>
                <HBox reversed>
                    <Button
                        disabled={!props.value || !props.value.length}
                        onClick={() => props.onOk(props.value)}
                    >
                        {props.okText}
                    </Button>

                    <Button onClick={props.onCancel}>
                        {props.cancelText}
                    </Button>
                </HBox>
            </PageLayout>
        )

    return Comp
}
