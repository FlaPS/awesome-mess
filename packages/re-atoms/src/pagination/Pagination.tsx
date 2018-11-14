import * as React from 'react'

import {caption} from '../styles/font'
import {restyle} from '../styles'
import Div, {DivProps} from '../layout/Div'

import MaxRowsMenu from './MaxRowsMenu'

import {Library} from '../styles/SVGLibrary'
import IconButton from '../controls/IconButton'


const Container = caption(restyle`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 56px;
`)(Div)

export type PaginationProps = DivProps & {
    total: number
    offset: number
    maxRows: number
    maxRowsItems?: any
    onOffsetChange: (offset: number) => void
    onMaxRowsChange: (maxRows: number) => void
}

const PaginationInfo = caption(restyle`
    display: inline-block;
    margin: 0 36px 0 0;
`)('span')

export class Pagination extends React.Component<PaginationProps, any> {
    changeOffset = diff => {
        const {total, offset, onOffsetChange} = this.props
        const newOffset = offset + diff

        if (newOffset > total)
            onOffsetChange(offset)
        else if (newOffset < 0)
            onOffsetChange(0)
        else
            onOffsetChange(newOffset)
    }

    getLastRenderingRow = () => {
        const {total, offset, maxRows} = this.props

        return this.isLastPage()
            ? total
            : offset + maxRows
    }

    isLastPage = () => this.props.offset + this.props.maxRows >= this.props.total

    render() {
        const {
            total,
            offset,
            maxRows,
            maxRowsItems = [10, 20, 50, 100],
            onMaxRowsChange,
        } = this.props

        return (
            <Container>
                <MaxRowsMenu
                    onPage={this.getLastRenderingRow() - offset}
                    options={maxRowsItems}
                    onOptionChange={onMaxRowsChange}
                    currentOption={maxRows}
                />

                <PaginationInfo>
                    {offset + 1}-{this.getLastRenderingRow()} из {total}
                </PaginationInfo>

                <IconButton disabled={offset === 0} onClick={() => this.changeOffset(-maxRows)}>
                    <Library.LeftArrow/>
                </IconButton>
                <IconButton disabled={this.isLastPage()} onClick={() => this.changeOffset(maxRows)}>
                    <Library.RightArrow/>
                </IconButton>
            </Container>
        )
    }
}
