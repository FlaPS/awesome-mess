import * as React from 'react'
import {Tab, Tabs} from 'material-ui'
import {isNil, path} from 'ramda'
import renderChildren, {Renderable} from '../smart/renderChildren'
import {restyle} from '../styles'
import Div from './Div'

const Fragment = (React as any).Fragment

type PaneProps<OwnProps = {}, RenderableProps = {}> = {
    title: string
    children: Renderable<OwnProps>
    active?: boolean
    extra?: Renderable<RenderableProps>
}

const PaneContainer = restyle`
    ${({active}) => active
    ? ''
    : 'display: none;'
    }
`(Div) as any as React.StatelessComponent<{ active?: boolean }>

type TabNavigatorState = {
    activeKey: number
}

type TabNavigatorProps<RenderableProps = {}> = {
    children: Renderable
    value?: number
    onChange?: (value: number) => void
    extra?: Renderable<RenderableProps>
}

const TabsContainer = restyle`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
`(Div)

const getChildrenExtra = path(['props', 'extra'])

export default class TabNavigator extends React.Component<TabNavigatorProps, TabNavigatorState> {
    static defaultProps = {
        onChange: () => {
            return
        },
    }

    static Pane = ({children, active}: PaneProps) => (
        <PaneContainer active={active}>
            {renderChildren(children)}
        </PaneContainer>
    )
    onTitleClick = (evt, activeKey) => {
        this.props.onChange(activeKey)
        this.setState({activeKey})
    }
    getPanes = () => {
        const {children} = this.props
        const {activeKey} = this.state

        return React.Children.map(
            children as React.ReactNode,
            (child: React.ReactElement<PaneProps>, index) => {
                // @ts-ignore
                return React.cloneElement(child, {active: index === activeKey})
            }
        )
    }
    getTitles = () =>
        React.Children.map(
            this.props.children as React.ReactNode,
            (child: React.ReactElement<PaneProps>) =>
                <Tab label={child.props.title}/>
        )
    getExtra = () => {
        const {children, extra: ownExtra} = this.props
        const {activeKey} = this.state

        const currentChildren = React.Children
            .toArray(children)
            .find((_, i) => i === activeKey)

        const childExtra = getChildrenExtra(currentChildren)

        const extra = isNil(childExtra)
            ? ownExtra
            : childExtra

        return renderChildren(extra)
    }
    getTabs = () => {
        const {activeKey} = this.state
        return (
            <Tabs value={activeKey} onChange={this.onTitleClick}>
                {this.getTitles()}
            </Tabs>
        )
    }

    constructor(props: TabNavigatorProps) {
        super(props)

        const {value} = this.props
        const activeKey = isNil(value)
            ? 0
            : value

        this.state = {activeKey}
    }

    componentWillReceiveProps({value}: TabNavigatorProps) {
        if (this.state.activeKey !== value && !isNil(value))
            this.setState(() => ({
                activeKey: value,
            }))
    }

    render() {
        return (
            <Fragment>
                <TabsContainer>
                    {this.getTabs()}
                    {this.getExtra()}
                </TabsContainer>
                {this.getPanes()}
            </Fragment>
        )
    }
}
