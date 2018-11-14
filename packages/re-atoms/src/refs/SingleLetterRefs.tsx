import * as React from 'react'
import {omit} from 'ramda'
import {RefDescriptor} from './RefsList'
import {Div, DivProps, Paper} from '../layout'
import {colors, restyle} from '../styles'

type SingleLetterRefsProps = DivProps & {
    letter: string;
    refs: Array<RefDescriptor>
    isHovered: boolean
    onSelect: (value: RefDescriptor) => string
}

const omitSingleLetterRefsProps = omit(['letter', 'refs', 'isHovered', 'onRefClick'])

const RefHeader = restyle`
    padding: 12px 24px 12px 24px;
    border-bottom: 1px solid ${colors.BORDER_GRAY};
    color: ${colors.EXTRA_SOFT_BLACK};
    font-family: Roboto;
    font-size: 24px;
    line-height: 28px;
`(Div)

const RefBody = restyle`
    display: flex;
    flex-direction: column;
`(Div)

const RefRow = restyle`
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding: 0 24px;
    align-items: center;
    color: ${colors.DEFAULT_BLACK};
    font-family: Roboto;
    font-size: 13px;

    &:hover {
        cursor: pointer;
        background-color: #F5F5F5;
    }
`(Div)

const RefCount = restyle`
    color: ${colors.EXTRA_SOFT_BLACK};
    font-size: 12px;
`(Div)

const makeRefRow = onSelect => ref =>
    <RefRow
        onClick={() => onSelect(ref)}
        key={ref.id}
        id={ref.id}
    >
        {ref.name}
        <RefCount>{ref.count}</RefCount>
    </RefRow>

const SingleLetterRef =
    (props: SingleLetterRefsProps) =>
        <Paper elevation={props.isHovered ? 12 : 2} {...omitSingleLetterRefsProps(props)}>
            <RefHeader>{props.letter}</RefHeader>
            <RefBody>
                {props.refs.map(makeRefRow(props.onSelect))}
            </RefBody>
        </Paper>

export default restyle`
    margin: 24px 0;
    height: fit-content;
    box-sizing: border-box;
    border-radius: 2px;
    background-color: ${colors.WHITE};

    &:hover{
        box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2),
                    0px 12px 17px 2px rgba(0, 0, 0, 0.14),
                    0px 5px 22px 4px rgba(0, 0, 0, 0.12);
    }
`(SingleLetterRef)
