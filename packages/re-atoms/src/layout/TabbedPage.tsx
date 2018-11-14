import * as React from 'react'
import Tabs from '../controls/TabsRouted'
import RoutedPage from '../smart/RoutedPage'
import {PageDiv} from '../layout'
import styled from 'styled-components'
import {RouteIndex} from '../app/navHelpers'

const TabContent = styled.div`
    padding-top: 72px;
    padding-left: 16px;
    padding-right: 16px;
`

export type TabsDescriptor = () => RouteIndex[]

export default (tabs: TabsDescriptor) =>
    class TabbedPage extends RoutedPage<any, any> {
        render() {
            const items = tabs()
            const isTabsVisible = items.find(t => t.path === this.props.location.pathname)

            const children = this.renderChildRoutes()

            return isTabsVisible
                ? <PageDiv>
                    <Tabs tabs={items}/>
                    <TabContent>
                        {children}
                    </TabContent>
                </PageDiv>
                : children

        }
    }

