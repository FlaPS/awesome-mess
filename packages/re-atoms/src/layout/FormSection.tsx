import * as React from 'react'
import styled from 'styled-components'
import {BoxProps, VBox} from './Box'
import Div from './Div'
import {omit} from 'ramda'
import {colors, Font, restyle} from '../styles'

export type FormSectionProps = {
    done?: boolean
    label: string
    children?: React.ReactNode
    stretch?: boolean
    icon?: any
    fill?: boolean
} & BoxProps

const FormSectionHeader = restyle`
    background-color: ${colors.EXTRA_SOFT_BLUE};
    display: flex;
    height: 32px;
    color: ${colors.SOFT_BLACK};
    font-size: 13px;
    font-weight: 500;
    line-height: 1.15;
    padding-left: 24px;
    align-items: center;

    .headerIcon,
    .headerIcon_done {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        opacity: 0.45;
    }

    .headerIcon_done {
        color: ${colors.DEEP_BLUE};
    }
`(Font.FontFamily(Div))

const FormSectionContent = styled(VBox)`
    padding: 24px;
`

export const FormSection = (props: FormSectionProps) => (
    <VBox {...omit(['done', 'label', 'content', 'icon', 'gap'])(props)}>
        <FormSectionHeader>
            {props.icon &&
            <props.icon
                className={props.done ? 'headerIcon_done' : 'headerIcon'}
            />
            }
            {props.label}
        </FormSectionHeader>
        {props.fill
            ? props.children
            : <FormSectionContent gap={props.gap}>
                {props.children}
            </FormSectionContent>
        }
    </VBox>
)

export default FormSection

