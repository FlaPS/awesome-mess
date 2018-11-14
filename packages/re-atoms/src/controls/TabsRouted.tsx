import * as React from 'react'
import MUITabs, {Tab} from 'material-ui/Tabs'
import {connect} from 'react-redux'
import {FrontState} from '../store/index'
import {push} from 'react-router-redux'
import {dispatch} from '../store/'
import MUIAppBar from 'material-ui/AppBar'
import styled from 'styled-components'
import colors from '../styles/colors'

type TabProp = {
    path: string
    label: string
}

type TabsProps = {
    currentPath?: string
    tabs: TabProp[]
}

const StyledBar = styled(MUIAppBar)`
    box-sizing: border-box;
    padding-left: 72px;
    position: fixed !important;
    left: 0 !important;
    top: 54px !important;
`

const BarColorStyle = {
    backgroundColor: colors.GREY_BLUE,
}


export class TabsRouted extends React.Component<TabsProps, any> {

    onChange = (event, value) => {
        const path = this.props.tabs[value].path
        dispatch(push(path))
    }

    render() {
        const {tabs, currentPath} = this.props
        const selectedTab = tabs.find(t => currentPath === t.path)

        return (
            <StyledBar style={BarColorStyle}>
                <MUITabs
                    value={tabs.indexOf(selectedTab)}
                    onChange={this.onChange}
                >
                    {tabs.map((t, index) =>
                        <Tab label={t.label} key={index}/>
                    )}
                </MUITabs>
            </StyledBar>
        )
    }
}

const mapStateToProps = (state: FrontState) =>
    ({currentPath: state.routing.location.pathname})

export default connect(mapStateToProps)(TabsRouted)
