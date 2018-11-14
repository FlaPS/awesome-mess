import * as React from 'react'
import Paper from '../../layout/Paper'
import {HBox} from '../../layout/Box'
import Library from '../../styles/SVGLibrary'
import IconButton from 'material-ui/IconButton'
import {Caption, HeadLine} from '../../styles/Typography'
import renderChildren from '../../smart/renderChildren'
import {Search} from '../../controls'

const gridHeaderStyle = {
    height: 64,
    style: {
        paddingLeft: 24,
        paddingRight: 8,
        boxSizing: 'border-box',
        alignItems: 'center',
        display: 'flex',
        minHeight: 64,
        whiteSpace: 'nowrap',
    } as any as React.CSSProperties,
}


export const viewGridHeader =
    ({children, ...props}: any) =>
        <Paper>
            <HBox {...gridHeaderStyle}>
                <HeadLine>{props.title}</HeadLine>
                <HBox stretch/>
                <Search
                    value={props.search || ''}
                    onChange={value => {
                        props.setState && props.setState({search: value !== '' ? value : undefined})
                    }
                    }
                />
                <IconButton>
                    <Library.Sort/>
                </IconButton>
            </HBox>
            {renderChildren(children, props)}
        </Paper>


type WellGridHeaderProps = {
    children?: Function
    headerProps: { title: string, itemsCount: string }
}

export const wellGridHeader =
    () =>
        ({headerProps, ...props}: WellGridHeaderProps) =>
            <Paper>
                <HBox {...gridHeaderStyle}>
                    <HeadLine style={{margin: 0, whiteSpace: 'nowrap'}}>{headerProps.title}</HeadLine>
                    <Caption style={{marginLeft: 30, marginBottom: 0, display: 'inline-block', whiteSpace: 'nowrap'}}>
                        {`${headerProps.itemsCount}`}
                    </Caption>
                    <HBox stretch/>

                    <IconButton>
                        <Library.Dots/>
                    </IconButton>
                </HBox>
                {renderChildren(props.children, props)}
            </Paper>
