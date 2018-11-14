import * as React from 'react'
import {restyle} from '../styles/restyle'
import Div from '../layout/Div'
import {ButtonsRow, DialogBox, Empty, Label} from '../layout/ModalListDialog'
import TextInput from '../inputs/TextInput'
import Button from '../controls/Button'
import {actions, EntityScheme} from '@local/biz'
import {toIndexedArray} from '@local/utils'

type AddRefItemModalProps = {
    onAdd: () => any,
    onCancel: () => any,
    label: string,
    scheme: EntityScheme<any, any>,
    dispatch: any,
    frontState: any
    itemParentKey?: string
    itemParentId?: any
}

type AddRefItemModalState = {
    itemName: string,
    error: boolean
}

const ModalBox = restyle`
position: absolute;
left: 0;
top: 0;
z-index: 10000;
display: flex;
align-items: center;
justify-content: center;
box-sizing: border-box;
width: 100vw;
height: 100vh;
background-color: rgba(0,0,0,0.54);
`(Div)

class AddRefItemModal extends React.PureComponent<AddRefItemModalProps, AddRefItemModalState> {
    onAdd = () => {
        const id = (toIndexedArray(this.props.frontState.biz[this.props.scheme.ownerKey]).length + 1).toString()
        const payload = this.props.itemParentKey ?
            {
                name: this.state.itemName,
                [this.props.itemParentKey]: this.props.itemParentId,
                creatorUserId: this.props.frontState.credentials.userId,
            } :
            {name: this.state.itemName, creatorUserId: this.props.frontState.credentials.userId}
        this.props.dispatch(
            actions.create(
                this.props.scheme,
                payload,
                id
            )
        )
        this.props.onAdd()
    }
    onChange = value => this.setState({itemName: value, error: this.validateUnique(value)})
    validateUnique = (name: string) =>
        toIndexedArray(this.props.frontState.biz[this.props.scheme.ownerKey])
            .some(el => el.name.toLowerCase() === name.toLowerCase())

    constructor(props) {
        super()
        this.state = {
            itemName: '',
            error: false,
        }
    }

    render() {
        return <ModalBox>
            <DialogBox>
                <Label>
                    {this.props.label}
                </Label>
                <TextInput
                    onChange={this.onChange}
                    error={this.state.error}
                    label={this.state.error && 'Введенное значение должно быть уникальным'}
                    style={{height: '70px'}}
                />
                <ButtonsRow>
                    <Button color='inherit' disabled={this.state.error} onClick={this.onAdd}>Добавить</Button>
                    <Empty/>
                    <Button color='inherit' onClick={this.props.onCancel}>Отмена</Button>
                </ButtonsRow>
            </DialogBox>
        </ModalBox>
    }
}

export default AddRefItemModal
