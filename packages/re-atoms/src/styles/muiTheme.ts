import createPalette from 'material-ui/styles/createPalette'

import {createMuiTheme} from 'material-ui/styles'
import red from 'material-ui/colors/red'
import green from 'material-ui/colors/green'
import {forkedBlueTheme} from './colors'

export default createMuiTheme({
    palette: createPalette({
        primary: forkedBlueTheme,
        secondary: green,
        error: red,
    }),
})
