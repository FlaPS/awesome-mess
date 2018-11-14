import * as React from 'react'
import IconButton from 'material-ui/IconButton'
import styled from 'styled-components'
import {BoxProps, HBox} from '../layout'
import {HeadLine} from '../styles/Typography'
import {colors, Font, Library} from '../styles'
import renderChildren, {Renderable} from '../smart/renderChildren'
import {ExpandableProps, TreeMode} from './Expandable'
import DropDownMenu from '../controls/DropdownMenu'
import {GridProps, GridState} from './grid/Grid'
import {Search} from '../controls'

export type OwnProps = {
    active?: boolean
    value?: string[]
}


export type SmartToolbarProps = {
    children?: Renderable<OwnProps>
    extra?: Renderable<OwnProps>

} & BoxProps & OwnProps

const Box = styled(HBox)`
    padding-left: 24px;
    min-height: 64px;
    align-items: center;
    display: flex;
    background-color: ${ ({active}) => active ? 'rgba(0, 148, 204, .12)' : colors.WHITE };
    white-space: nowrap;
    box-sizing: content-box;
`

const ActiveSpan = Font.FontFamily(styled.span`
    color: ${colors.DEEP_BLUE};
    font-size: 14px;
    line-height: 20px;
`)

const FlexDiv = styled.div`
    display: fles;
    align-items: center;
`

const SmartToolbar: React.SFC<SmartToolbarProps> = ({extra, active, ...props}: SmartToolbarProps) =>
    <Box height={64} active={active} {...props}>
        {active
            ? <ActiveSpan>{renderChildren(props.children, props)}</ActiveSpan>
            : <HeadLine>{renderChildren(props.children, props)}</HeadLine>
        }
        <HBox stretch/>
        {renderChildren(extra, props)}
    </Box>

SmartToolbar.defaultProps = {
    active: false,
    extra: (props: any) =>
        <FlexDiv>
            <Search
                value={props.search || ''}
                onChange={value => {
                    if (props.setState) props.setState({search: value !== '' ? value : undefined})
                }}
            />
            <IconButton>
                <Library.Sort/>
            </IconButton>
        </FlexDiv>
    ,
}


export function makeSelectionToolbar<T = {}, P = {}>() {
    return (props: SmartToolbarProps & ExpandableProps<T, GridProps<T, P>, GridState<T>>) =>
        <SmartToolbar
            active={props.mode !== TreeMode.VIEW && props.value && props.value.length > 0}
            {...props}
        />
}

type makeCrudToolbarProps<T, P> = {
        onModeChange?: (mode: TreeMode) => any
        onSelectionSubmit?: (value: string[]) => any
        onSelectionCancel?: () => any
        onRequestAdd?: () => any
        noun?: string
    }
    & SmartToolbarProps
    & ExpandableProps<T, GridProps<T, P>, GridState<T>>

const renderExtra = props => extraProps => {
    if (props.mode === TreeMode.VIEW)
        return (
            <DropDownMenu
                data={[{
                    renderIcon: () => <Library.Add/>,
                    renderLabel: () => 'Добавить ' + (props.noun || ''),
                    onChange: props.onRequestAdd,
                }, {
                    renderIcon: () => <Library.Delete/>,
                    renderLabel: () => 'Удалить ' + (props.noun || ''),
                    onChange: () => props.onModeChange && props.onModeChange(TreeMode.MULTI_SELECT),
                }]}
            >
                <IconButton>
                    <Library.Dots/>
                </IconButton>
            </DropDownMenu>
        )
    else {
        if (props.value && props.value.length > 0)
            return (
                <IconButton
                    onClick={() => {
                        if (props.onSelectionSubmit) props.onSelectionSubmit(props.value)
                    }}
                >
                    <Library.Delete/>
                </IconButton>
            )
        else
            return (
                <IconButton onClick={props.onSelectionCancel}>
                    <Library.CloseCross/>
                </IconButton>
            )
    }
}

export function makeCrudToolbar<T = {}, P = {}>() {
    return (props: makeCrudToolbarProps<T, P>) =>
        <SmartToolbar
            active={props.mode !== TreeMode.VIEW}
            extra={renderExtra(props)}
            {...props}
        />
}


export default SmartToolbar

