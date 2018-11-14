import * as React from 'react'
import MUIButton from 'material-ui/Button'
import {withStyles} from 'material-ui/styles'
import {defaultProps} from 'recompose'
import {colors} from '../styles'
import {PropTypes, StyledComponentProps} from 'material-ui'
import * as ReactPropTypes from 'prop-types'
import {dispatch} from '../store/'
import {push} from 'react-router-redux'

export type ButtonProps = {
    primary?: boolean
    color?: PropTypes.Color | 'contrast'
    component?: React.ReactNode
    dense?: boolean
    disabled?: boolean
    disableFocusRipple?: boolean
    disableRipple?: boolean
    fab?: boolean
    href?: string
    raised?: boolean

    centerRipple?: boolean
    link?: string
    focusRipple?: boolean
    keyboardFocusedClassName?: string
    onBlur?: React.FocusEventHandler<any>
    onClick?: React.MouseEventHandler<any>
    onFocus?: React.FocusEventHandler<any>
    onKeyboardFocus?: React.FocusEventHandler<any>
    onKeyDown?: React.KeyboardEventHandler<any>
    onKeyUp?: React.KeyboardEventHandler<any>
    onMouseDown?: React.MouseEventHandler<any>
    onMouseLeave?: React.MouseEventHandler<any>
    onMouseUp?: React.MouseEventHandler<any>
    onTouchEnd?: React.TouchEventHandler<any>
    onTouchStart?: React.TouchEventHandler<any>
    role?: string;
    tabIndex?: number | string;
    type?: string;
} & StyledComponentProps<''>


const Button: React.SFC<ButtonProps> = (props: ButtonProps) =>
    props.link
        ? <MUIButton onClick={() => dispatch(push(props.link))} {...props}/>
        : <MUIButton {...props}/>

const styles = {
    root: {color: colors.PRIMARY},
}

const CompButton: React.SFC<ButtonProps> = (props: ButtonProps, context) =>
    context.disabled
        ? props.primary
        ? <Button raised disabled color='accent' style={{color: colors.WHITE}} {...props} />
        : <Button {...props} disabled/>
        : props.primary
        ? props.disabled
            ? <Button raised color='accent' style={{color: colors.WHITE}} {...props} />
            : (
                <Button
                    raised
                    color='primary'
                    style={{color: colors.WHITE, backgroundColor: colors.PRIMARY}}
                    {...props}
                />
            )
        : <Button {...props}  />


CompButton.contextTypes = {
    disabled: ReactPropTypes.bool,
}

export default withStyles(styles)(CompButton) as any as React.SFC<ButtonProps>
