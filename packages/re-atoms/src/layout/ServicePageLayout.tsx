import * as React from 'react'
import Div from './Div'
import {restyle} from '../styles'
import Library from '../styles/SVGLibrary'
import {FrontState} from '../store/index'
import {connect} from 'react-redux'
import colors from '../styles/colors'


type ServicePageLayoutProps = {
    title?: string
    label?: string
    children?: React.ReactNode
    connected?: boolean
}

const NameDiv = restyle`
    max-width: 480px;
`(Div)


const StatusBar = restyle`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    flex: 0 0 24px;
    background-color: ${colors.GREY_BLUE};
    padding-right: 68px;
    font-family: Roboto;
    font-size: 12px;
    color: ${colors.WHITE};
    &:after {
        position: absolute;
        top: 10px;
        right: 56px;
        height: 4px;
        width: 4px;
        border-radius: 50%;
        background-color: ${ (props: { connected: boolean }) => props.connected ? colors.BRIGHT_GREEN : colors.DARK_RED};
        content:'';
    }
`(Div)

const InfoBar = restyle`
    display: flex;
    align-items: center;
    padding: 0 56px 0 56px;
    justify-content: space-between;
    flex: 0 0 82px;
    background-color: ${colors.WHITE};
    font-family: Roboto;
    font-size: 13px;
    line-height: 1.46;
    color: ${colors.SOFT_BLACK};
`(Div)

const FlexContainer = restyle`
    display: flex;
    flex-direction: row;
    align-items: center;
`(Div)

const Body = restyle`
    display: inline-flex;
    flex-direction: column;
    padding-top: 32px;
    padding-bottom: 32px;
    flex: 1 1 auto;
    align-items: flex-start;
`(Div)

const Title = restyle`
    font-family: Roboto;
    font-size: 24px;
    text-align: left;
    color: ${colors.DEFAULT_BLACK};
`(Div)

const Label = restyle`
    margin-top: 8px;
    font-family: Roboto;
    font-size: 18px;
    color: ${colors.SOFT_BLACK};
`(Div)

const CredentialsBar = restyle`
    display: flex;
    flex: 0 0 32px;
    background-color: ${colors.HEAVY_LIGHT_GRAY};
    align-items: center;
    justify-content: center;
    font-family: Roboto;
    font-size: 13px;
    color: ${colors.EXTRA_SOFT_BLACK};
`(Div)

const ChildrenDiv = restyle`
    margin-top: 24px;
`(Div)

const Layout = restyle`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`(Div)

const BlueLogo = restyle`
    color: ${colors.LOGO_BLUE};
    height: 35px;
    width: auto;
    marginRight: 30px;
`(Library.Logo)

const BodyDiv = restyle`
    display: inline-block;
    margin: 0 auto auto auto;
    max-width: min-content;
`(Div)

const ServicePageLayout = (props: ServicePageLayoutProps) =>
    <Layout>
        <StatusBar connected={props.connected}>{`Соединение ${props.connected ? '' : 'прервано'}`}</StatusBar>
        <InfoBar>
            <FlexContainer>
                <BlueLogo/>
                <NameDiv>
                    Информационная система по формированию производственной отчётности при строительстве скважин
                </NameDiv>
            </FlexContainer>
            <div>
                <img style={{width: '107px', height: '55px'}} src={'/logo-gazprom-neft.png'}/>
            </div>
        </InfoBar>
        <BodyDiv>
            <Body>
            <Title>{props.title}</Title>
            <Label>{props.label}</Label>
            <ChildrenDiv>{props.children}</ChildrenDiv>
            </Body>
        </BodyDiv>
        <CredentialsBar>ООО «Тетрасофт» © 2017</CredentialsBar>
    </Layout>

const mapStateToProps = (state: FrontState) => ({
    connected: state.connection.isConnected,
})

export default connect(mapStateToProps)(ServicePageLayout)
