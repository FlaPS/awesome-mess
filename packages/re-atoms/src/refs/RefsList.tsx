import * as React from 'react'
import Columns from 'react-columns'
import {Div, DivProps} from '../layout'
import RefsNavigation from './RefsNavigation'
import SingleLetterRefs from './SingleLetterRefs'
import {restyle} from '../styles'

export type RefDescriptor = {
    id: string,
    name: string,
    count: number
}

type ChapterRefsProps = DivProps & {
    data: Array<RefDescriptor>
    onSelect: (value?: RefDescriptor) => any
}

const queries = [{
    columns: 2,
    query: 'min-width: 664px',
}, {
    columns: 3,
    query: 'min-width: 1008px',
}, {
    columns: 4,
    query: 'min-width: 1332px',
}, {
    columns: 5,
    query: 'min-width: 1700px',
}]

declare const require: any

class Refs extends React.Component<ChapterRefsProps, any> {
    scrollToComponent: any
    private setNavHoverLetter =
        event =>
            this.setState({hoveredLetter: event.target.innerHTML})
    private resetNavHoveredLetter =
        () =>
            this.setState({hoveredLetter: null})
    private scrollToRef =
        event =>
            this.scrollToComponent(this.refs['s' + event.currentTarget.id.slice(1)], {align: 'top', offset: -58})

    constructor(props) {
        super(props)
        this.state = {letter: null, hoveredLetter: null}
    }

    componentDidMount() {
        /*
        * TODO: hack!
        * https://github.com/component/scroll-to/issues/9#issuecomment-311362354
        * */
        this.scrollToComponent = require('react-scroll-to-component')
    }

    render() {
        const refNames = this.props.data.map(ref => ref.name)
        const refLetters = [... new Set(refNames.map(name => name.slice(0, 1).toUpperCase()))].sort()
        return <div {...this.props}>
            <RefsNavigation
                refNames={refLetters}
                onNavigationClick={this.scrollToRef}
                onMouseLeave={this.resetNavHoveredLetter}
                onHoverChange={this.setNavHoverLetter}
            />
            <MainContent>
                <Columns queries={queries} gap={12} rootStyles={{marginLeft: '12px', marginRight: '12px'}}>
                    {refLetters.map((letter, number) =>
                        <SingleLetterRefs
                            id={'s' + number}
                            key={'s' + number}
                            ref={'s' + number}
                            letter={letter}
                            onSelect={this.props.onSelect}
                            refs={this.props.data.filter(ref => ref.name.slice(0, 1).toUpperCase() === letter)}
                            isHovered={letter === this.state.hoveredLetter}
                        />)}
                </Columns>
            </MainContent>
        </div>
    }
}

const MainContent = restyle`
    padding: 58px 0px 0px 0px;
    box-sizing: border-box;
`(Div)

export default restyle`
    background-color: #f3f3f3;
`(Refs)
