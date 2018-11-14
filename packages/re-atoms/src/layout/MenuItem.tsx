import * as React from 'react'
import {MenuItem} from 'material-ui/Menu'
import {withStyles} from 'material-ui/styles'

const styles = {
    root: {
        paddingLeft: 24,
        paddingRight: 64,
    },
}

export default withStyles(styles)(MenuItem)