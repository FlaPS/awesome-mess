import * as React from 'react'
import {addDecorator, storiesOf} from '@storybook/react'
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles'
import createPalette from 'material-ui/styles/createPalette'
import green from 'material-ui/colors/green'
import red from 'material-ui/colors/red'
import blue from 'material-ui/colors/blue'
import {Provider} from 'react-redux'
import getStore from './store/'
import {seedBiz} from '@local/biz'

const theme = createMuiTheme({
    palette: createPalette({
        primary: blue,
        secondary: green,
        error: red,
    }),
})

const MUIThemeDecorator = storyFn => (
    <MuiThemeProvider theme={theme}>
        {storyFn()}
    </MuiThemeProvider>
)

seedBiz(getStore())

const ReduxProviderdecorator = storyFn => (
    <Provider store={getStore()}>
        {storyFn()}
    </Provider>
)


addDecorator(MUIThemeDecorator)
addDecorator(ReduxProviderdecorator)

declare const module
storiesOf('AAAAписание', module)
    .add('Inputs', () =>
        <div>
            Input is a component with intent to change the Business domain state.
            <p>
                Button is not input ! Buttons (Fabs, Toggles ...) are to wide class of visual elements,
                so let's move them into separate directory.
                <br/>
                Particular cases - text input, check box, date picker etc
            </p>
            <br/>
            The basic <b>props</b> of intput are:
            <li>
                <b>value: any</b> - current value to parse and display.
            </li>
            <li>
                <b>onChange: any -> void?</b> - onChange - a callback when user inputs other value.
            </li>
            <br/>
            The optional props , could be inferred via context
            <li>
                <b>readonly: boolean</b> - input should display data, with out ony helpers to modify one.
            </li>
            <li>
                <b>disabled: boolean</b> - input is not readonly but disabled for interaction,
                with visual hint kind of grey background
            </li>
            <br/>
            The metrics of regular/readonly/disabled input showld be equals,
            in other cases there is a reason for separate components.
        </div>
    )
