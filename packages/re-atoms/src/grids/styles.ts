import {TableRow} from 'material-ui/Table'
import {withStyles} from 'material-ui/styles'
import {restyle} from '../styles/restyle'
import {compose} from 'ramda'
import {Th} from '../layout/Table'
import styled from 'styled-components'

export enum GridCellClassName {
    leftAlign = 'grid-cell-left-align',
    rightAlign = 'grid-cell-right-align',
    centerAlign = 'grid-cell-center-align',
    short = 'grid-cell-short',
    icon = 'grid-cell-short-extra',
    noCellPadding = 'grid-no-cell-padding',
    sortableCell = 'grid-cell-with-sort-icon',
    minWidth = 'grid-cell-min-width',
}

export enum GridRowClassName {
    grayBgColor = 'grid-row-gray-background',
    readonly = 'grid-row-readonly',
    refRawHeader = 'grid-header-ref-row',
    refRaw = 'grid-ref-row',
    expandedRaw = 'grid-ref-expanded-row',
    paperHeaderRaw = 'grid-paper-like-header',
}

export const makeStyledRow = compose(
    restyle`
        &:hover {
            ${({hover}) => hover
        ? 'box-shadow: 0 -1px rgba(0, 0, 0, 0.075);' +
        'background: #eeeeee;'
        : ''
        }
        }

        ${
        ({pointer}) => pointer
            ? 'cursor: pointer;'
            : ''
        }

        &.${GridRowClassName.grayBgColor} {
            background-color: #ECECEC!important;
            color: rgba(0,0,0,0.54)!important;
        }

        &.${GridRowClassName.readonly} {
            cursor: default;
        }

         &.${GridRowClassName.refRawHeader} {
            height: 40px;
        }

        &.${GridRowClassName.refRaw} {
            height: 48px;

            &:hover{
                background-color: #F5F5F5;
            }
        }

        &.${GridRowClassName.expandedRaw} {
            background-color: rgba(245,245,246,0.56);
        }

        &.${GridRowClassName.paperHeaderRaw} {
            border-radius: 2px;
            background-color: #ffffff;
        }
    `,
    withStyles({root: {height: 40}})
)


export const makeIsomorphic = comp => styled(comp)`
    box-sizing: border-box;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid rgba(0, 0, 0, 0.075);
    text-overflow: ellipsis;

    text-align: left;
    padding: 0 24px 0 0;

    &:first-child {
        padding: 0 24px;
    }

    & ~ & {
        padding: 0 24px;
        text-align: right;
    }

    ${
    comp === Th ? `
            position: relative;
            white-space: pre;
            font-weight: 500;
        ` : ''
    }

    &.${GridCellClassName.short} {
        width: 70px;
        padding: 0;
    }

    &.${GridCellClassName.leftAlign} {
        text-align: left;
    }

    &.${GridCellClassName.rightAlign} {
        text-align: right;
    }

    &.${GridCellClassName.centerAlign} {
        text-align: center;
    }

    &.${GridCellClassName.noCellPadding} {
        padding: 0 0 0 21px !important;

        &:last-child {
            padding-right: 24px !important;
        }
    }

    &.${GridCellClassName.sortableCell} {
        margin: 0;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
    }

    &.${GridCellClassName.minWidth} {
        width: 1%;
    }

    &.${GridCellClassName.icon} {
        width: 1px;
        &:first-child {
            padding: 0 0 0 20px;
        }
        &:last-child {
            padding: 0;
        }
    }
`
export const makeSelectionCell = component => styled(component)`
    box-sizing: border-box;
    padding: 0 0 0 9px;
    width: 57px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.075);
`
export const StyledRow = makeStyledRow(TableRow)
