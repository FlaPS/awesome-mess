import * as React from 'react'
import defaultProps from '../smart/defaultProps'
import PopUpInput from './PopupInput'

const Test = (p: { a: number, type: string }) => <div>{p.a}</div>

const Comp = defaultProps<{ type?: 'name' | 'description' }>({type: 'name'})(PopUpInput)

const a = <Comp/>

export default Comp

