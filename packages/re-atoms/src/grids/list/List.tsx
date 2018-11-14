import * as React from 'react'
import {Scheme} from '@local/biz'
import styled from 'styled-components'
import SelectionCell from '../SelectionCell'
import CustomScrollbar from '../../controls/CustomScrollbar'
import ExpansionButton from '../../controls/ExpansionButton'
import {Expandable, ExpandableProps, ExpandableState} from '../Expandable'
import {Empty} from '../../smart/Pure'
import {Pagination} from '../../pagination/Pagination'
import caseRender from '../../smart/caseRender'
import renderChildren from '../../smart/renderChildren'
import {makeStyledRow} from '../styles'
import colors from '../../styles/colors'


const ListDivDividers = styled.table`
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    border-spacing: 0;
    border-collapse: collapse;
    color: rgba(0, 0, 0, 0.87);
    border-top: 1px solid ${colors.LIGHT_BORDER_GRAY};
    width: 100%;
    font-size: 13px;
`
const ListDivNoDividers = styled(ListDivDividers)`
    border-top: none;
`

const ListDiv = caseRender<{ noDividers: boolean }>(ListDivDividers)
    .match(props => Boolean(props.noDividers) === true, ListDivNoDividers)

const ListRowDividers = styled.tr`
	height: 40px;
	text-align: left;
    border-bottom: 1px solid ${colors.LIGHT_BORDER_GRAY};
	background-color: #FFFFFF;
    padding-top: 0px;
    padding-bottom: 0px;
	width: 100%;
`

const ListRowNoDividers = styled(ListRowDividers)`
    border-top: none;
`
const RawRow = caseRender<{ noDividers: boolean }>(ListRowDividers)
    .match(props => Boolean(props.noDividers) === true, ListRowNoDividers)

const ListRow = makeStyledRow(RawRow)


const ListCell = styled.td`
    vertical-align: middle;
    padding-left: 24px;
    padding-top: 0px;
    padding-bottom: 0px;
`

const ExpansionListcell = styled.td`
    vertical-align: middle;
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 0px;
    padding-bottom: 0px;
    width: 24px;
`


export function makeList<T, P = Empty>(
    scheme?: Scheme<T>
): React.ComponentType<ExpandableProps<T, P>> {
    return class List<T, P> extends Expandable<T, P, ExpandableState> {

        public static defaultProps = {
            maxRowsItems: [5, 10, 50, 100],
            maxRows: 5,
            offset: 0,
            data: [],
            value: [],
            hover: true,
            mode: '',
            onChange: console.log,
            expansionPadding: '64px',
            expandedKeys: [],
            scheme,
            idKey: scheme ? scheme.uniqueProperty : null,
            render: value => scheme
                ? scheme.getFullName(value)()
                : (value['name'] ? value.name : JSON.stringify(value)),
        }
        onRowClick = (vo: T) => () => {

            if (this.props.onRowClick)
                this.props.onRowClick(vo, this)
        }
        renderRow = (vo: T, index: number, owner: this) => {

            return (
                <ListRow
                    pointer={!this.isSelectionDisabled(vo)}
                    hover={this.props.hover}

                    key={this.getId(vo)}
                    noDividers={this.props.noDividers}
                >
                    {this.renderSelectionCell(vo)}

                    <ListCell
                        onClick={this.onRowClick(vo)}
                    >
                        {renderChildren(this.props.render(vo, this), this.props)}
                    </ListCell>

                    {
                        this.props.expandedRowRender &&
                        <ExpansionListcell>
                            <ExpansionButton
                                value={this.state.expandedKeys.includes(this.getId(vo))}
                                onChange={value => this.toggleRowExpand(vo)}
                            />
                        </ExpansionListcell>
                    }
                </ListRow>
            )
        }
        renderExpandRow = (vo: T, index, owner: List<T, P>) =>
            this.state.expandedKeys.includes(this.getId(vo))
                ? <ListRow noDividers={this.props.noDividers}>
                    <td
                        colSpan={99}
                        style={{
                            paddingLeft: this.props.expansionPadding,
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingRight: 0,
                        }}
                    >
                        {renderChildren(this.props.expandedRowRender(vo, this.getId(vo), this), this.props)}
                    </td>
                </ListRow>
                : null
        changeHandler =
            (vo: T) =>
                (checked: boolean) => {
                    const {onChange, mode, idKey, data, value} = this.props
                    const id = this.getId(vo)
                    mode === 'select'
                        ? onChange([id])
                        : value.includes(id)
                        ? onChange(value.filter(selectedId => selectedId !== id))
                        : onChange([...value, id])
                }
        renderSelectionCell =
            (vo: T) => {
                const {mode, idKey, data, value} = this.props
                const id = vo[idKey] as any as string
                return mode !== ''
                    ? (
                        <SelectionCell
                            inversed={this.props.inversedSelection}
                            selected={value.includes(id)}
                            radio={mode === 'select'}
                            onChange={this.changeHandler(vo)}
                        />
                    ) : null
            }
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
                offset: props.offset || 0,
                maxRows: props.maxRows || 10,
                expandedKeys: props.expandedKeys || [],
            }
        }

        render() {
            const {
                data,
                idKey,
                value,
                mode,
                onChange,
                onRowClick,
                emptyText,
                height,
                width,
                expansionPadding,
                render,
                expandedRowRender,
                ...props,
            } = this.props

            const array = this.getVisibleRows().map(this.renderItem)

            return (!this.props.withPagination)
                ? <CustomScrollbar {...props} height={height} style={{width, maxWidth: width}}>
                    <ListDiv noDividers={this.props.noDividers}>
                        <tbody>
                        {array}
                        </tbody>
                    </ListDiv>
                </CustomScrollbar>
                : <div>
                    <ListDiv {...props}>
                        <tbody>
                        {array}
                        </tbody>
                    </ListDiv>
                    {this.renderPagination()}
                </div>

        }
    } as any as React.ComponentType<ExpandableProps<T, P>>
}
