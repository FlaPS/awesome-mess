import * as React from 'react'
import {CheckboxProps} from 'material-ui/Checkbox'
import {withStateHandlers} from 'recompose'
import styled from 'styled-components'
import {omit} from 'ramda'
import {colors} from '../styles'


type ToggleCheckProps = CheckboxProps & {
    width?: number,
    height?: number,
    iconWidth?: number,
    iconHeight?: number,
    icon?: React.ReactNode,
    checkedIcon?: React.ReactNode
}

type ToggleCheckPropsHoc = ToggleCheckProps & {
    onClick?: () => any,
    props?: any,
}

const omitToggleCheckProps = omit(['width', 'height', 'icon', 'checkedIcon', 'iconWidth', 'iconHeight'])

const ToggleCheck: React.SFC = withStateHandlers((props: ToggleCheckProps) => (
        {checked: false, icon: props.icon, checkedIcon: props.checkedIcon ? props.checkedIcon : props.icon, props}),
    {
        onClick: (state, props) => () => ({...state, checked: !state.checked}),
    })(({props, checked, icon, checkedIcon, onClick}: ToggleCheckPropsHoc) => (
    <div {...omitToggleCheckProps(props)}>
        <div
            className={`toggleCheck ${checked ? 'checkedToggle' : 'uncheckedToggle'}`}
            onClick={onClick}
        >
            <div className={'iconContainer'}>{checked ? checkedIcon : icon}</div>
        </div>
    </div>
)) as any


export default styled(ToggleCheck)`
    .toggleCheck {
        width: ${(props: ToggleCheckProps) => props.width ? props.width : 24 }px;
        height: ${(props: ToggleCheckProps) => props.height ? props.height : 24}px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: ${(props: ToggleCheckProps) => props.height ? props.height : 24}px;
    }

    .iconContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${(props: ToggleCheckProps) => props.iconWidth ? props.iconWidth : 16}px;
        height: ${(props: ToggleCheckProps) => props.iconHeight ? props.iconHeight : 16}px;
    }

    .toggleCheck:hover {
        cursor: pointer;
    }

    .checkedToggle {
        background-color: ${colors.PRIMARY};
        color: ${colors.WHITE};
    }

    .uncheckedToggle {
        color: ${colors.SOFT_BLACK};
        border: 1px solid ${colors.AVATAR_GRAY};
    }
`
