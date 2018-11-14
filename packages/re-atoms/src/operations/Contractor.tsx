import * as React from 'react'
import {ContractorVO} from './ContractorsFormSection'
import {restyle} from '../styles/restyle'
import Div from '../layout/Div'
import {CONTRACTOR_TYPE, schemeLens} from '@local/biz'
import TextInput from '../inputs/TextInput'
import getStore from '../store/'
import Select from '../inputs/Select'
import Library from '../styles/SVGLibrary'
import colors from '../styles/colors'


type ContractorProps = ContractorVO & {
    onDelete: (id: string | number) => void
    onChange: (item: ContractorVO) => void
}

type ContractorState = Partial<ContractorVO>

const ContractorInputDiv = restyle`
  width: 296px!important;
  height: 72px!important;
`(Div)

const ContractorDiv = restyle`
    max-width: 664px;
    padding: 16px 16px 32px 24px;
    position: relative;
    margin-bottom: 24px;
    background-color: ${colors.MEDIUM_GRAY};
    &:nth-of-type(2n) {
         background-color: ${colors.LIGHT_GRAY};
    }
`(Div)

const DeleteContractor = restyle`
    position: absolute;
    top: 24px;
    right: 24px;

    &:hover {
        cursor: pointer;
    }
`(Library.CloseCross)

const ContractorTextInput = restyle`
  width: 296px!important;
  height: 72px!important;
`(TextInput) as any

export class Contractor extends React.PureComponent <ContractorProps, ContractorState> {
    handleContractorTypeChange = value =>
        this.setState({contractorTypeId: value},
            () => this.props.onChange({...this.state, contractorId: this.props.contractorId}))
    handleContractorKindChange = e =>
        this.setState({contractorKind: e.target.value},
            () => this.props.onChange({...this.state, contractorId: this.props.contractorId}))
    handleContractorContact = e =>
        this.setState({contractorContact: e.target.value},
            () => this.props.onChange({...this.state, contractorId: this.props.contractorId}))

    constructor(props) {
        super(props)
        this.state = {
            contractorTypeId: this.props.contractorTypeId,
            contractorKind: this.props.contractorKind,
            contractorContact: this.props.contractorContact,
        }
    }

    render() {
        return <ContractorDiv>
            <ContractorInputDiv>
                <Select
                    label={'Наименование сервиса'}
                    onChange={this.handleContractorTypeChange}
                    scheme={CONTRACTOR_TYPE}
                    uniqueProperty={CONTRACTOR_TYPE.uniqueProperty}
                    data={schemeLens(CONTRACTOR_TYPE).get(getStore().getState())}
                    required
                />
            </ContractorInputDiv>
            <DeleteContractor onClick={() => this.props.onDelete(this.props.contractorId)}/>
            <ContractorTextInput
                label={'Наименование организации'}
                onChange={this.handleContractorKindChange}
                value={this.state.contractorKind}
                style={{marginRight: '24px'}}
                required
            />
            <ContractorTextInput
                label={'Контактное лицо'}
                value={this.state.contractorContact}
                onChange={this.handleContractorContact}
            />
        </ContractorDiv>
    }

}
