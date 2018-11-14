import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {compose, reduce, sort, toPairs} from 'ramda'
import Library from '../styles/SVGLibrary'


declare const module
compose(
    reduce(
        (story, [iconName, icon]) => story.add(iconName, icon),
        storiesOf('styles/SVGLibrary', module)
    ),
    sort(([nameA], [nameB]) => nameA > nameB ? 1 : -1)
)(toPairs(Library))

