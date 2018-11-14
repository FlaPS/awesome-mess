import * as React from 'react'
import {addDecorator, storiesOf} from '@storybook/react'
import Refs, {RefDescriptor} from './RefsList'
import WellProjectsRef from './well_refs/WellProjects'
import WellStatusesRef from './well_refs/WellStatuses'
import WellPurposesRef from './well_refs/WellPurposes'
import WellFieldsRef from './well_refs/WellFields'
import RigWinchTypeRef from './RigWinchTypes'
import WellPlacesRef from './well_refs/WellPlaces'
import WellLicenseAreasRef from './well_refs/WellLicenseAreas'
import ContractorTypesRef from './ContractorTypes'
import IncidentsRef from './Incidents'
import {Provider} from 'react-redux'
import getStore from '../store/'

const refsData: Array<RefDescriptor> = []

declare const module
storiesOf('Refs', module)
    .add('random 50 refs', () => <Refs data={refsData}/>)
    .add('well_projects ref', () =>
        <Provider store={getStore()}>
            <WellProjectsRef/>
        </Provider>
    )
    .add('well_statuses ref', () =>
        <Provider store={getStore()}>
            <WellStatusesRef/>
        </Provider>
    )
    .add('well_purposes ref', () =>
        <Provider store={getStore()}>
            <WellPurposesRef/>
        </Provider>)
    .add('well_fields ref', () =>
        <Provider store={getStore()}>
            <WellFieldsRef/>
        </Provider>
    )
    .add('well_places ref', () =>
        <Provider store={getStore()}>
            <WellPlacesRef/>
        </Provider>
    )
    .add('well license areas ref', () =>
        <Provider store={getStore()}>
            <WellLicenseAreasRef/>
        </Provider>
    )
    .add('incidents  ref', () =>
        <Provider store={getStore()}>
            <IncidentsRef/>
        </Provider>
    )
    .add('contractor types ref', () =>
        <Provider store={getStore()}>
            <ContractorTypesRef/>
        </Provider>
    )
    .add('rig winch types ref', () =>
        <Provider store={getStore()}>
            <RigWinchTypeRef/>
        </Provider>
    )
