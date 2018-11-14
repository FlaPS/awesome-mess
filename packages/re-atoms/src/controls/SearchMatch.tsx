import * as React from 'react'
import * as ReactPropTypes from 'prop-types'
import contexted from '../smart/contexted'

const makeHTML = (str: string, reg: RegExp) =>
    str.replace(reg, v => '<mark>' + v + '</mark>')

const SearchMatch = contexted({
    searchRegExp: ReactPropTypes.instanceOf(RegExp),
})<{ children: string }>(
    ({children, searchRegExp}) =>
        children && searchRegExp
            ? <span
                dangerouslySetInnerHTML={{
                    __html: makeHTML(children, searchRegExp as any as RegExp),
                }}
            />
            : children as any
)

export default SearchMatch

