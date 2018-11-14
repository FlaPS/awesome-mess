import * as React from 'react'
import {restyle} from '../../styles/restyle'
import Paper from '../../layout/Paper'
import {PaperProps} from 'material-ui/Paper'
import {omit} from 'ramda'
import RefTopBar from './RefTopBar'
import RefSubBar from './RefSubBar'
import {Scheme} from '@local/biz'

export type RefHeaderTemplateProps = PaperProps & {
    edit: boolean
    actual: boolean
    scrolled: boolean
    label: string
    onShowActive: () => any
    onShowAll: () => any
    onSearch: (value: string) => any
    onShowLogClick: () => any
    onExportClick: () => any
    onAddClick: () => any
    onEditClick: () => any
    onSaveClick: () => any
    onCancelClick: () => any
    width?: number
    scheme: Scheme<any, any>
    saveAvailable?: boolean
    activeAvailable: boolean,
    allAvailable: boolean,
}

const omitRefHeaderTemplateProps = omit(
    ['edit',
        'actual',
        'scrolled',
        'label',
        'saveAvailable',
        'onShowActive',
        'onShowAll',
        'activeAvailable',
        'onSearchClick',
        'onShowLogClick',
        'onExportClick',
        'onAddClick',
        'onEditClick',
        'onSaveClick',
        'onCancelClick',
        'scheme',
        'allAvailable',
    ])

const PageHeader = restyle`
    width: 100%;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 26px;
    position: fixed;
    z-index: 10;
`(Paper)

const RefHeaderTemplate = (props: RefHeaderTemplateProps) => (
    <PageHeader {...omitRefHeaderTemplateProps(props)} elevation={props.scrolled ? 4 : 2}>
        <RefTopBar
            onDownloadClick={props.onExportClick}
            onShowLogClick={props.onShowLogClick}
            actual={props.actual}
            edit={props.edit}
            label={props.label}
            width={props.width}
            onSearch={props.onSearch}
        />
        <RefSubBar
            active={props.actual}
            edit={props.edit}
            onShowActive={props.onShowActive}
            onShowAll={props.onShowAll}
            onSave={props.onSaveClick}
            onEditClick={props.onEditClick}
            width={props.width}
            onCancel={props.onCancelClick}
            onAddClick={props.onAddClick}
            saveAvailable={props.saveAvailable}
            activeAvailable={props.activeAvailable}
            allAvailable={props.allAvailable}
            scheme={props.scheme}
        />
    </PageHeader>
)

export default RefHeaderTemplate
