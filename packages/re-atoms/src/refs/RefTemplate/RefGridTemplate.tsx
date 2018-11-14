import * as React from 'react'
import Grid, {Column} from '../../grids/grid/Grid'
import {actions, Scheme, UserVO} from '@local/biz'
import {Library} from '../../styles/SVGLibrary'
import Paper from '../../layout/Paper'
import {concat, omit, T} from 'ramda'
import {restyle} from '../../styles'
import Div from '../../layout/Div'
import {toIndexedArray} from '@local/utils'
import {ExpandedRowRenderer} from '../../grids/Expandable'
import {InputProvider} from '../../InputProvider'


const omitRefsProps = omit([
    'data',
    'users',
    'refScheme',
    'columns',
    'dispatch',
    'headerExtraText',
    'tableBar',
    'topBar',
    'isSelectionDisabled',
    'selectionDisableReason',
    'withoutHeader',
    'emptyLabel',
])

export type RefGridProps<T = any> = {
    data: Array<Scheme<T, any>>
    users: Array<UserVO>
    refScheme: Scheme<T, any>
    columns: Array<Column<T, any>>
    tableBar?: React.ReactNode,
    actual?: boolean
    values?: Array<string>
    nested?: boolean
    dispatch: (action: any) => any
    width?: number
    edit: boolean
    withoutHeader?: boolean
    onToggleVisible?: (id: string) => any
    gridRowsClassname?: any
    headRowsClassname?: any
    emptyLabel?: string,
    expandedRowRender?: ExpandedRowRenderer<T>
    expandedValues?: string[]
    onExpandChange?: (keys: string[]) => any
    expandAll?: boolean
}


const makeGrayIcon = Icon => restyle
    `
    color: rgba(0,0,0,0.54);
    cursor: pointer;
`(Icon)

const makeReadOnlyIcon = Icon => restyle
    `
    color: #BDBDBD;
`(Icon)

const Empty = restyle`
    display: flex;
    ${props => props.nested ? 'background-color:  rgba(245,245,246,0.56)' : ''};
    flex-direction: column;
    color: rgba(0,0,0,0.54);
    font-family: Roboto;
    font-size: 16px;
    padding: 90px 0 82px;
    line-height: 24px;
    align-items: center;
    justify-content: center;
`(Div)

export const capitalize = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)


type RefTemplateState = {
    selected: string[]
}

const EmptyLabel = restyle`
    color: rgba(0,0,0,0.21);
    font-family: Roboto;
    font-size: 24px;
`(Div)

const TableContainer = restyle`
    width: ${props => !props.nested && props.width ? props.width + 'px' : 'auto' };
`(Div)

export default class RefGridTemplate extends React.Component<RefGridProps, RefTemplateState> {
    private getVisibleIcon =
        Icon => this.props.edit ? makeGrayIcon(Icon) : makeReadOnlyIcon(Icon)
    private renderToggleVisibleColumn =
        () => [
            {
                title: '',
                classNames: [Grid.cellClasses.minWidth, Grid.cellClasses.noCellPadding],
                dataIndex: this.props.refScheme.uniqueProperty,
                render: (value, item) => {
                    const Icon = this.getVisibleIcon(item.removed ? Library.Invisible : Library.Visible)
                    return (
                        <DeletedCell
                            title={!this.props.edit ? 'Изменить в режим редактирования' : ''}
                            onClick={this.onToggleVisibleClick}
                            id={item[this.props.refScheme.uniqueProperty]}
                            removed={item.removed}
                            style={{width: '24px'}}
                        >
                            <Icon/>
                        </DeletedCell>
                    )
                },
            },
        ]
    private renderEmpty =
        () => (
            <Paper>
                <Empty nested={this.props.nested}>
                    <EmptyLabel>
                        {this.props.emptyLabel ?
                            this.props.emptyLabel : `Нет созданных ${this.props.refScheme.lang.plural}`}
                    </EmptyLabel>
                </Empty>
                {this.props.tableBar}
            </Paper>
        )
    private renderData =
        // TODO: получать грид на основе типизированных пропсов
        () => {
            const {columns, values, refScheme} = this.props

            return (
                <div>
                    <InputProvider readonly={!this.props.edit} disabled={!this.props.edit}>
                        <Grid
                            data={this.getGridData()}
                            dispatch={this.props.dispatch}
                            columns={concat(this.renderToggleVisibleColumn(), columns)}
                            idKey={refScheme.uniqueProperty}
                            mode={''}
                            withPagination={false}
                            value={values}
                            rowClassName={this.getRowClassName}
                            headRowClassName={this.getHeadRowClassName}
                            withoutHeader={this.props.withoutHeader}
                            expandedRowRender={this.props.expandedRowRender}
                            expandable
                            onExpandChange={this.props.onExpandChange}
                            expandedValues={this.props.expandedValues}
                            expandAll={this.props.expandAll}
                        />
                    </InputProvider>
                    {this.props.tableBar}
                </div>
            )
        }
    private getGridData =
        () => {
            const comparator = this.props.actual && !this.props.edit
                ? ref => !ref.removed
                : T
            return this.getDataAsIndexedArray().filter(comparator)
        }
    private isRenderable =
        () => (
            this.props.edit ||
            !this.props.actual ||
            this.getDataAsIndexedArray().filter(ref => !ref.removed).length > 0
        ) && this.getDataAsIndexedArray().length > 0
    private getDataAsIndexedArray =
        () =>
            Object
                .keys(this.props.data)
                .map(key => this.props.data[key])
    private onAddClick = () => console.log('add clicked')
    private onToggleVisibleClick = e => {
        if (this.props.edit) {
            const {refScheme, onToggleVisible} = this.props
            const refElementId = e.currentTarget.id
            const refElement = this.findRefElementById(refElementId)
            if (onToggleVisible)
                onToggleVisible(refElementId)
            const newState = !refElement['removed']
            this.props.dispatch(actions.update(refScheme, refElementId, {removed: newState}))
        }

    }
    private findRefElementById = (id: number): Scheme<any, any> =>
        toIndexedArray(this.props.data)
            .filter(ref => ref[this.props.refScheme.uniqueProperty] === id)[0]
    private getRowClassName = (record, index) => {
        const extraClassnames = this.props.gridRowsClassname ? this.props.gridRowsClassname(record, index) : []
        return [
            record.removed ? Grid.rowClasses.grayBgColor : '',
            this.props.edit ? '' : Grid.rowClasses.readonly,
            Grid.rowClasses.refRaw,
        ].concat(extraClassnames)
    }
    private getHeadRowClassName = () => {
        const extraClassnames = this.props.headRowsClassname ? this.props.headRowsClassname() : []
        return [Grid.rowClasses.refRawHeader].concat(extraClassnames)
    }

    constructor(props) {
        super(props)
        this.state = {
            selected: [],
        }
    }

    render() {
        return (
            <TableContainer {...omitRefsProps(this.props)}>
                {this.isRenderable() ? this.renderData() : this.renderEmpty()}
            </TableContainer>
        )
    }
}

export const DeletedCell = restyle`
    background-color: ${props => props.removed ? '#ECECEC' : '#FFFFFF'}

    &[title]:hover:after {
        content: attr(title);
        background-color: rgba(97,97,97,0.9);
        color: #FFFFFF;
        font-family: Roboto;
        font-size: 10px;
        font-weight: 500;
    }
`(Div)

// TODO: resolve problem with mui styles overlaps createUser styles
