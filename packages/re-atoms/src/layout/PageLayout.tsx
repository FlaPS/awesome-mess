import * as React from 'react'
import {BoxProps, VBox} from './Box'
import {defaultProps} from 'recompose'
import IconButton from '../controls/IconButton'
import {Library} from '../styles/SVGLibrary'
import {Pure} from '../smart/Pure'
import {goBack} from 'react-router-redux'
import PageDiv from './PageDiv'

type PageLayoutProps = BoxProps & {
    topOffset?: number
    gap?: number
}


export default Pure<PageLayoutProps>()
    .addProps({
        hasBackButton: false,
        marginAuto: true,
        topOffset: 13,
        gap: 16,
        style: {
            maxWidth: 1232,
            width: '100%',
        },
    })
    .connect(state => ({
        history: state.history,
        routing: state.routing,
    }))
    .ap(({hasBackButton, history, routing, topOffset, style, ...props}) =>

        <PageDiv>
            {
                hasBackButton || (
                    history &&
                    history.appHistory &&
                    history.appHistory.length > 1 &&
                    routing && routing.location &&
                    routing.location.pathname.match(/\d/)
                )
                && <IconButton
                    style={{position: 'fixed'}}
                    onClick={() => props.dispatch(goBack())}
                >
                    <Library.Back/>
                </IconButton>
            }
            <VBox
                {...props}
                style={{
                    paddingTop: topOffset,
                    paddingBottom: 24,
                    zIndex: 10,
                    ...style,
                }}
            />
        </PageDiv>
    )
