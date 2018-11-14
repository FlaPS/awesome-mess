import * as React from 'react'
import {AssociativeArray, toIndexedArray} from '@local/utils'
import {Dictionary, F as alwaysFalse, filter} from 'ramda'
import {Empty} from '../smart/Pure'
import {Scheme} from '@local/biz'
import * as ReactPropTypes from 'prop-types'
import {Renderable} from '../smart/renderChildren'

type QueryListener<Q> = (query: Partial<Q>) => any

export type ExpandableProps<T extends { [key: string]: any }, P = Empty, S = Empty, This = Empty> = Readonly<{
        isSelectionDisabled?: (vo: T) => boolean
        selectionDisableReason?: string
        hover?: boolean
        /**
         * The data to render
         */
        data: AssociativeArray<T> | Array<T>

        /**
         * Unique identifier of data items
         */
        idKey?: keyof T

        emptyText?: string

        /**
         * Expand all by default
         */
        expandAll?: boolean

        /**
         * Keep only 1 or 0 rows expanded
         */
        expandOnlySingItem?: boolean

        /**
         * Pre filter, before display data in list
         * @param {T} x
         * @returns {boolean}
         */
        filter?: (x: T) => boolean

        search?: string

        /**
         * Hide row dividers
         */
        noDividers?: boolean

        /**
         * Current selected ids
         */
        value?: string[]

        /**
         * selection mode, '' - none, select - only one, multiselect - allow select multiple items
         */
        mode?: '' | 'select' | 'multiSelect'

        /**
         * On selection change
         * @param {string[]} value
         */
        onChange?: (value: string[]) => void

        /**
         * When row is clicked, encluding selectable area in case of one appear
         * @param {T} vo
         * @param {ExpandableProps<T extends {[p: string]: any}, P>} props
         */
        onRowClick?: (vo: T, owner?: This) => void

        /**
         *
         * @param {T} vo
         * @param {This} owner
         * @returns {React.ReactNode}
         */
        render?: (vo: T, owner?: This) => React.ReactNode

        expandedRowRender?: ExpandedRowRenderer<T, P>

        inversedSelection?: boolean

        expansionPadding?: string | number

        expandedValues?: string[]

        onExpandChange?: (keys: string[]) => any

        scrollable?: boolean
        /**
         * Scheme associated with selected data into tree
         */
        scheme?: Scheme<T>

        withPagination?: boolean
        maxRowsItems?: number[],
        maxRows?: number
        offset?: number

        onSettingsChange?: { (value: { maxRows: number }): any },
        onQueryChange?: QueryListener<{ search: string, offset?: number }>
    }

    & P>


/**
 * State part with array of expanded keys
 */
export type ExpandableState = {
    expandedKeys?: string[]
    offset?: number
    maxRows?: number
}


export type ExpandedRowRenderer<T, P = {}, S = {}> =
    (value: T, key: string, owner?: Expandable<T, P, S>) => Renderable<Expandable<T, P, S>>

export enum TreeMode {
    VIEW = '',
    SELECT = 'select',
    MULTI_SELECT = 'multiSelect',
}


const prepareProps = <T, P, S>(props: ExpandableProps<T, P, S, Expandable<T, P, S>>)
    : ExpandableProps<T, P, S, Expandable<T, P, S>> => {
    if (!props.scheme)
        return props

    if (!props.idKey)
        props = Object.assign({}, props, {idKey: props.scheme.uniqueProperty})

}

export abstract class Expandable<T, P = {}, S = {}>
    extends React.Component<ExpandableProps<T, P, S, Expandable<T, P, S>>, ExpandableState & Partial<S>> {


    static childContextTypes = {
        searchRegExp: ReactPropTypes.instanceOf(RegExp),
    }

    getChildContext = () => {
        if (this.props.search && this.props.search !== '') {
            const searchRegExp = new RegExp(this.props.search, 'gi')
            return {searchRegExp}
        }
        return {}
    }
    expandAll = (props: ExpandableProps<T, P, S, Expandable<T, P, S>>) =>
        this.setState({
            expandedKeys: this.getDataAsArray(props).map(this.getId),
        })
    collapseAll = (props: ExpandableProps<T, P>) =>
        this.setState({expandedKeys: [] as string[]})
    getId = (vo: T): string =>
        vo[this.props.idKey] as any as string
    getFiltered = (props?: ExpandableProps<T, P>): AssociativeArray<T> => {
        props = props || this.props
        if (props.filter)
            return filter(props.filter)(props.data as any as Dictionary<T>) as AssociativeArray<T>

        return props.data as AssociativeArray<T>
    }
    memoRenderItem = /*moize(*/(value: T, index: number, expanded: boolean): Array<Renderable> =>
        expanded
            ? [this.renderRow(value, index, this), this.renderExpandRow(value, index, this)]
            : [this.renderRow(value, index, this)]
    /*  ,
      { maxSize: 1000, maxArgs: 3}
)
*/
    renderItem = (value: T, index: number): Array<Renderable> =>
        this.memoRenderItem(value, index, this.state.expandedKeys.includes(this.getId(value)))
    toggleRowExpand = (vo: T) => {
        const id: string = this.getId(vo)

        let {expandedKeys} = this.state
        expandedKeys = expandedKeys.includes(id)
            ? expandedKeys.filter(k => id !== k)
            : (
                this.props.expandOnlySingItem
                    ? expandedKeys = [id]
                    : expandedKeys.concat([id])
            )

        if (this.props.onExpandChange)
            this.props.onExpandChange(expandedKeys)
        else
            this.setState({expandedKeys})
    }
    abstract renderExpandRow = (vo: T, index: number, owner: this): Renderable<this> => null
    abstract renderRow = (vo: T, index: number, owner: this): Renderable<this> => null
    handleChangePage =
        offset => {
            if (this.props.onQueryChange)
                this.props.onQueryChange({offset})
            this.setState({offset})
        }
    isSelectionDisabled =
        (vo: T) =>
            (this.props.isSelectionDisabled || alwaysFalse)(vo)
    handleChangeRowsPerPage =
        maxRows => {
            if (this.props.onSettingsChange)
                this.props.onSettingsChange({maxRows})
            this.setState({maxRows})
        }
    getVisibleRows =
        () =>
            this.props.withPagination
                ? this.getDataAsArray()
                    .slice(this.state.offset, this.state.offset + this.state.maxRows)
                : this.getDataAsArray()
    getTotalRowsAmount = () => this.getDataAsArray().length
    protected getDataAsArray = (props?: ExpandableProps<T, P>): T[] =>
        toIndexedArray(this.getFiltered())

    constructor(props: ExpandableProps<T, P, S, Expandable<T, P, S>>) {


        super(prepareProps(props))
        this.state = {expandedKeys: [] as string[]}

        if (props.expandAll)
            this.expandAll(props)
    }

    componentWillReceiveProps(nextProps: ExpandableProps<T, P, S, Expandable<T, P, S>>, nextContext: any) {
        if (nextProps.expandAll !== this.props.expandAll)
            nextProps.expandAll
                ? this.expandAll(nextProps)
                : this.collapseAll(nextProps)

        if (nextProps.expandedValues)
            this.setState({expandedKeys: nextProps.expandedValues})
        //  @ts-ignore
        //
        //this.memoRenderItem.clear()
    }

}
