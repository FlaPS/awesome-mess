import {defaultProps} from 'recompose'
import PopUpInput from './PopupInput'


const Comp = defaultProps<{ type?: 'name' | 'description' }>({type: 'description'})(PopUpInput)


export default Comp
