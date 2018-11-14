import * as React from 'react'
import {compose, filter, head, identity, path, sort} from 'ramda'
import {toIndexedArray} from '@local/utils'
import styled from 'styled-components'
import {restyle} from '../../styles/restyle'
import Table, {TableBody, TableHead} from 'material-ui/Table'
import Checkbox from 'material-ui/Checkbox'
import Radio from 'material-ui/Radio'
import {Pagination} from '../../pagination/Pagination'
import {Library} from '../../styles/SVGLibrary'
import {Tooltip} from 'material-ui'
import {Td, Th} from '../../layout/Table'
import {Expandable, TreeMode} from '../Expandable'
import * as biz from '@local/biz'
import {getSearchableProps} from '@local/biz'
import SearchMatch from '../../controls/SearchMatch'
import renderChildren from '../../smart/renderChildren'
import {GridCellClassName, GridRowClassName, makeIsomorphic, makeSelectionCell, StyledRow} from '../styles'
import moize from 'moize'

type Sorter<T, P> = (props: GridProps<T, P>) => (a: T, b: T) => number

type ArrayOrPrimitive<T> = T | T[]

export type Column<T, P = {}> = {
    title: React.ReactNode
    dataIndex: keyof T
    classNames?: ArrayOrPrimitive<GridCellClassName> | ArrayOrPrimitive<string>
    headClassNames?: ArrayOrPrimitive<GridCellClassName> | ArrayOrPrimitive<string>
    cellClassNames?: ArrayOrPrimitive<GridCellClassName> | ArrayOrPrimitive<string>
    renderHeader?: (title: any) => React.ReactNode
    render?: (value: any, record?: T, owner?: Expandable<T, GridProps<T, P>, GridState<T>>) => React.ReactNode
    sorter?: Sorter<T, P>
}

export type GridState<T> = {
    sortOrder: 'desc' | 'asc'
    sortDataIndex: keyof T
    sorter: (a: any, b: any) => number
    expandedKeys?: string[]
}


export type GridProps<T extends { [key: string]: any }, P = {}> = Readonly<{
    columns?: Column<T, P>[]

    onSelectAllCb?: () => any
    withoutHeader?: boolean

    isSortable?: boolean
    rowClassName?: (record: T, index: number) => ArrayOrPrimitive<GridRowClassName> | ArrayOrPrimitive<string>
    headRowClassName?: () => ArrayOrPrimitive<GridRowClassName> | ArrayOrPrimitive<string>
}>

const SortableCellInner = styled.div`
    margin: 0;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
`

const UnsortedIcon = restyle`
    opacity: .2;
`(Library.ArrowUp)


const IsomorphicCell = makeIsomorphic(Td)
const IsomorphicHeadCell = makeIsomorphic(Th)
const SelectionCell = makeSelectionCell(Td)


/**
 * Helps to create new class for better type support
 * Other wise you can pass columns to infer the component's props in JSX
 * You can change the columns after making a class
 * @param {Column<T, P>[]} columns
 */
export const makeGrid = <T, P>(columns: Column<T, P>[] = []) => {
    const memo = moize({maxSize: 1000, maxArgs: 2})

    class Grid extends Expandable<T, GridProps<T, P>, GridState<T>> {

        static cellClasses = GridCellClassName
        static rowClasses = GridRowClassName

        static defaultProps: Partial<GridProps<T, P>> = {
            withPagination: true,
            maxRowsItems: [5, 10, 50, 100],
            hover: true,
            value: [],
            isSelectionDisabled: _ => false,
            selectionDisableReason: '',
            mode: TreeMode.VIEW,
            columns,
            isSortable: true,
        } as any as Partial<GridProps<T, P>>
        getDataAsArray = (props?): T[] => {
            props = props || this.props
            // @ts-ignore
            const filtered = toIndexedArray(this.getFiltered(props))
            if (props.search) {
                let targets = this.props.columns.map(c => c.dataIndex)

                if (props.scheme) {
                    const searchable = getSearchableProps(props.scheme)
                    targets = targets.filter(t => searchable.includes(t))
                }
                const result = []
                const pattern = props.search.toLowerCase()

                for (let i = 0; i < filtered.length; i++) {
                    const item = filtered[i]

                    if (props.scheme && biz.sel(props.scheme).getFullName(item as any as T).toLowerCase().includes(pattern))
                        result.push(item)
                    else
                        for (let p = 0; p < targets.length; p++)
                            if (String(item[targets[p]]).toLowerCase().includes(pattern)) {
                                result.push(item)
                                break
                            }

                }

                return result
            }

            return filtered
        }
        arrayAsString = (strings: string | string[]) =>
            Array.isArray(strings)
                ? strings.join(' ')
                : strings
        getClassNames = ({classNames}: Column<T>) =>
            classNames
                ? this.arrayAsString(classNames)
                : ''
        getCellClassName = (column: Column<T>) =>
            column.cellClassNames
                ? this.arrayAsString(column.cellClassNames)
                : this.getClassNames(column)
        getHeadClassName = (column: Column<T>) =>
            column.headClassNames
                ? this.arrayAsString(column.headClassNames)
                : this.getClassNames(column)
        getDefaultSortedData = () => {
            const {columns, isSortable} = this.props
            const data = this.getDataAsArray()

            if (!isSortable) return data

            const sorter = this.findFirstSorter(columns)
            const dataKey = path(['0', 'dataIndex'])(columns) as keyof T

            return sorter
                ? sort(sorter(this.props))(data)
                : sort(this.defaultSorter(dataKey))(data)
        }
        defaultSorter =
            (dataIndex: keyof T) =>
                (vo1: T, vo2: T) => {
                    let a: any = vo1[dataIndex]
                    let b: any = vo2[dataIndex]

                    if (typeof vo1[dataIndex] === 'string' && typeof vo2[dataIndex] === 'string') {
                        a = (vo1[dataIndex] as any as string).toLowerCase()
                        b = (vo2[dataIndex] as any as string).toLowerCase()
                    } else {
                        a = vo1[dataIndex]
                        b = vo2[dataIndex]
                    }

                    return a > b
                        ? 1
                        : a < b
                            ? -1 : 0
                }
        findFirstSorter =
            cols =>
                compose(
                    path(['0', 'sorter']),
                    filter((col: Column<T>) => !!col.sorter)
                )(cols) as Sorter<T, P>
        getSortedRows =
            () =>
                this.state.sortDataIndex === null
                    ? this.getDefaultSortedData()
                    : this.sortData(this.state.sortOrder)(this.getDataAsArray())
        sortData =
            (order: 'asc' | 'desc') =>
                sort(
                    (vo1: T, vo2: T) => order === 'asc'
                        ? this.state.sorter(vo1, vo2)
                        : this.state.sorter(vo2, vo1)
                )
        getVisibleRows =
            () =>
                this.props.withPagination
                    ? this.getSortedRows()
                        .slice(this.state.offset, this.state.offset + this.state.maxRows)
                    : this.getSortedRows()
        onSortClick =
            ({dataIndex, sorter}: Column<T, P>) =>
                () => {
                    const {sortOrder, sortDataIndex} = this.state
                    let newSortOrder: 'asc' | 'desc'

                    if (dataIndex !== sortDataIndex)
                        newSortOrder = 'asc'

                    else
                        switch (sortOrder) {
                            case null:
                                newSortOrder = 'asc'
                                break
                            case 'asc':
                                newSortOrder = 'desc'
                                break
                            case 'desc':
                                newSortOrder = null
                                break
                            default:
                                throw new Error(`unknown sorting order: ${sortOrder}`)
                        }

                    const newSortDataIndex = newSortOrder == null
                        ? null
                        : dataIndex

                    this.setState({
                        sorter: sorter(this.props),
                        sortDataIndex: newSortDataIndex,
                        sortOrder: newSortOrder,
                    })
                }
        onSelectionCellClick =
            (vo: T) =>
                (e: React.MouseEvent<HTMLTableHeaderCellElement>) => {
                    e.preventDefault()
                    e.nativeEvent.stopImmediatePropagation()
                    e.stopPropagation()
                    if (this.isSelectionDisabled(vo)) return

                    this.onSelectRow(vo)

                }
        onSelectRow = (vo: T) => {
            const {idKey, onChange, mode, value} = this.props
            const id = vo[idKey] as any as string
            switch (mode) {
                case 'select':
                    onChange([id])
                    break
                case 'multiSelect':
                    value.includes(id)
                        ? onChange(value.filter(selectedId => selectedId !== id))
                        : onChange([...value, id])
                    break
                default:
                    return null
            }
        }
        onSelectAll =
            () => {
                const {onChange, idKey, value, onSelectAllCb} = this.props
                const selected = value.length > 0
                    ? []
                    : this.getDataAsArray()
                        .filter(vo => !this.isSelectionDisabled(vo))
                        .map(vo => vo[idKey])

                onSelectAllCb
                    ? onSelectAllCb()
                    : onChange(selected as any as string[])
            }
        renderSelectAllCheckbox =
            () => {
                const selectedAmount = this.props.value.length
                const rowsAmount = this.getTotalRowsAmount()

                const isIndeterminate = selectedAmount > 0 && selectedAmount < rowsAmount

                return (
                    <SelectionCell>
                        <Checkbox
                            checked={rowsAmount === this.props.value.length}
                            onChange={this.onSelectAll}
                            indeterminate={isIndeterminate}
                        />
                    </SelectionCell>
                )
            }
        renderSelectAllCell =
            () => {
                switch (this.props.mode) {
                    case 'select':
                        return <SelectionCell/>
                    case 'multiSelect':
                        return this.renderSelectAllCheckbox()
                    default:
                        return null
                }
            }
        sortIcon =
            dataIndex => {
                if (dataIndex !== this.state.sortDataIndex)
                    return <UnsortedIcon/>

                switch (this.state.sortOrder) {
                    case 'asc':
                        return <Library.ArrowUp/>
                    case 'desc':
                        return <Library.ArrowDown/>
                    default:
                        return <UnsortedIcon/>
                }
            }
        renderSorterCell =
            (column: Column<T, P>) =>
                <SortableCellInner onClick={this.onSortClick(column)}>
                    {this.sortIcon(column.dataIndex)}
                    {column.title}
                </SortableCellInner>
        renderHeadCell =
            (column: Column<T, P>, i: number) => {
                const render = column.renderHeader || identity

                const cellContent = column.sorter
                    ? this.renderSorterCell(column)
                    : column.title

                return (
                    <IsomorphicHeadCell className={this.getHeadClassName(column)} key={i}>
                        {render(cellContent)}
                    </IsomorphicHeadCell>
                )
            }
        renderHead =
            () =>
                <TableHead>
                    <StyledRow className={this.getHeadRowClassName()}>
                        {this.renderSelectAllCell()}
                        {this.props.columns.map(this.renderHeadCell)}
                    </StyledRow>
                </TableHead>
        inputWithTooltip =
            (vo: T) =>
                input => this.isSelectionDisabled(vo)
                    ? (
                        <SelectionCell>
                            <Tooltip placement='bottom' title={this.props.selectionDisableReason}>
                                {input}
                            </Tooltip>
                        </SelectionCell>
                    ) : (
                        <SelectionCell>
                            {input}
                        </SelectionCell>
                    )
        renderSelectColumn =
            (vo: T) => {
                if (this.props.mode === '') return null

                const {idKey, mode, value} = this.props
                const isChecked = value.includes && value.includes(vo[idKey] as any as string)
                const withTooltip = this.inputWithTooltip(vo)

                switch (mode) {
                    case 'select':
                        return withTooltip(
                            <Radio
                                disabled={this.isSelectionDisabled(vo)}
                                checked={isChecked}
                                onChange={this.onSelectionCellClick(vo)}
                            />
                        )
                    case 'multiSelect':
                        return withTooltip(
                            <Checkbox
                                disabled={this.isSelectionDisabled(vo)}
                                checked={isChecked}
                                onChange={this.onSelectionCellClick(vo)}
                            />
                        )
                }
            }
        cellComponents: React.ComponentType<{ value: any, model: T, owner: this }>[] = []
        registerCellComponents = (props: { columns: Column<T, P>[] }) =>
            this.cellComponents = columns.map(
                col =>
                    col
            )
        defaultCellRender = (text: string, vo: T) =>
            <SearchMatch>{text}</SearchMatch>
        renderCell =
            (vo: T) =>
                (column: Column<T, P>, i: number) => {
                    const render = column.render || this.defaultCellRender
                    let content = render(vo[column.dataIndex], vo, this)

                    if (typeof content === 'string')
                        content = this.defaultCellRender(content, vo)
                    return (
                        <IsomorphicCell key={i} className={this.getCellClassName(column)}>
                            {content}
                        </IsomorphicCell>
                    )
                }
        getHeadRowClassName =
            () => {
                const {headRowClassName} = this.props
                if (!headRowClassName) return ''

                return this.arrayAsString(headRowClassName())
            }
        getRowClassName =
            (record: T, index: number) => {
                const {rowClassName} = this.props
                if (!rowClassName) return ''

                return this.arrayAsString(rowClassName(record, index))
            }
        renderExpandRow = (vo: T, index, owner: Grid) =>
            this.state.expandedKeys.includes(this.getId(vo)) &&
            renderChildren(this.props.expandedRowRender(vo, this.getId(vo), this), this.props)
        renderRow =
            (vo: T, index: number, owner: this) => {
                const {idKey, onRowClick, mode} = this.props

                const onClick = onRowClick
                    ? (
                        mode === TreeMode.VIEW
                            ? onRowClick
                            : this.isSelectionDisabled(vo)
                            ? identity
                            : this.onSelectRow
                    )
                    : this.isSelectionDisabled(vo)
                        ? identity
                        : this.onSelectRow

                return (
                    <StyledRow
                        pointer={!this.isSelectionDisabled(vo)}
                        className={this.getRowClassName(vo, index)}
                        key={vo[idKey] as any as string}
                        hover={this.props.hover}
                        onClick={e => onClick(vo)}
                    >
                        {this.renderSelectColumn(vo)}
                        {this.props.columns.map(this.renderCell(vo))}
                    </StyledRow>
                )
            }
        renderBody =
            () =>
                <TableBody>
                    {this.getVisibleRows().map(this.renderItem)}
                </TableBody>
        getMaxRows = () => this.props.maxRows || this.state.maxRows


        // memoRenderRow = memo(())
        renderPagination =
            () => {
                const {offset, maxRows} = this.state
                return (
                    <Pagination
                        offset={offset}
                        total={this.getTotalRowsAmount()}
                        maxRows={maxRows}
                        maxRowsItems={this.props.maxRowsItems}
                        onOffsetChange={this.handleChangePage}
                        onMaxRowsChange={this.handleChangeRowsPerPage}
                    />
                )
            }

        constructor(props) {
            super(props)

            this.state = {
                ...this.state,
                offset: props.offset || 0,
                maxRows: props.maxRows || 10,
                expandedKeys: props.expandedKeys || [],
                sortOrder: null,
                sortDataIndex: null,
                sorter: () => null,
            }
            this.registerCellComponents(props)
        }

        componentWillReceiveProps(nextProps, nextContext: any) {
            if (nextProps.maxRowsItems)
            // @ts-ignore
                this.setState({maxRows: head(nextProps.maxRowsItems)})

            super.componentWillReceiveProps(nextProps, nextContext)
        }

        render() {
            return (
                <div>
                    <Table style={{borderCollapse: 'separate'}}>
                        {this.props.withoutHeader || this.renderHead()}
                        {this.renderBody()}
                    </Table>
                    {this.props.withPagination && this.renderPagination()}
                </div>
            )
        }
    }

    return Grid//return withQuery({search: '', offset: 0})(Grid, 'grid')  as any as typeof Grid
}

export default Object.assign(makeGrid<{}, {}>(), {cellClasses: GridCellClassName, rowClasses: GridRowClassName})
