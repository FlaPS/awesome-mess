import contexted from '../smart/contexted'
import * as ReactPropTypes from 'prop-types'

export type InputCtx = {
    disabled?: boolean
    readonly?: boolean
}

export default contexted(
    {
        disabled: ReactPropTypes.bool,
        readonly: ReactPropTypes.bool,
    }
)
