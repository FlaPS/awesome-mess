import * as React from 'react'
import {FormSection, FormSectionProps} from '../layout/FormSection'
import AddContractorButton from './AddContractorButton'
import {Contractor} from './Contractor'
import {union} from 'ramda'


export type ContractorVO = {
    contractorId: number
    contractorTypeId?: number
    contractorKind?: string
    contractorContact?: string
}

export type ContractorsFormSectionProps = FormSectionProps & {
    value?: Array<ContractorVO>
    onChange: (values: Array<ContractorVO>) => void
}

const getNextContractorId = (contractors: Array<ContractorVO>) => contractors.length

export const ContractorsFormSection = (props: ContractorsFormSectionProps) =>
    <FormSection
        label={'Подрядчики'}
        children={<div>
            {props.value && props.value.map((item, number) =>
                <Contractor
                    key={`contractor${number}`}
                    contractorId={item.contractorId}
                    contractorKind={item.contractorKind}
                    contractorTypeId={item.contractorTypeId}
                    contractorContact={item.contractorContact}
                    onChange={item => {
                        const items = props.value
                        props.onChange(
                            items
                                .filter(contractor => contractor.contractorId !== item.contractorId)
                                .concat([item])
                        )
                    }
                    }
                    onDelete={item =>
                        props.onChange(props.value.filter(contractors => contractors.contractorId !== item))}
                />)}
            <AddContractorButton
                onClick={() => props.onChange(union(props.value, [{contractorId: getNextContractorId(props.value)}]))}
            />
        </div>}
    />

export class ExampleSection extends React.Component <any, any> {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
        }
    }

    render() {
        return <ContractorsFormSection
            label={'Подрядчики'}
            value={this.state.items}
            onChange={items => this.setState({items})}
        />
    }
}
