import * as React from 'react'

import RefsList, {RefDescriptor} from '../../refs/RefsList'
import {
    CONTRACTOR_TYPE,
    INCIDENT_TYPE,
    RIG_WINCH_TYPE,
    schemesList,
    WELL_FIELD,
    WELL_LICENSE_AREA,
    WELL_PLACE,
    WELL_PURPOSE,
    WELL_STATUS
} from '@local/biz'
import {dispatch, getStore} from '../../store/'
import {capitalize} from '@local/utils'
import {RouteConfig, RouteIndex} from '../../app/navHelpers'
import {Library} from '../../styles/SVGLibrary'
import {push} from 'react-router-redux'
import WellPlaces from '../../refs/well_refs/WellPlaces'
import WellFields from '../../refs/well_refs/WellFields'
import WellLicenseAreas from '../../refs/well_refs/WellLicenseAreas'
import WellPurposes from '../../refs/well_refs/WellPurposes'
import WellStatuses from '../../refs/well_refs/WellStatuses'
import RigWinchTypes from '../../refs/RigWinchTypes'
import ContractorTypes from '../../refs/ContractorTypes'
import Incidents from '../../refs/Incidents'
import RoutedPage from '../../smart/RoutedPage'
import {PageDiv} from '../../layout'

const getRefDescriptors = (): RefDescriptor[] => schemesList
    .filter(s => s && s.isReference && !s.isNested).map(
        s =>
            ({
                id: s.name,
                name: capitalize(s.lang.name),
                count: s.asList()().length,
            })
    )


const RefsLinks = () =>
    <RefsList
        data={getRefDescriptors()}
        onSelect={d =>
            dispatch(push(
                (chapterReferences[d.id].index as RouteIndex).path)
            )
        }
    />

class ChapterReferences extends RoutedPage<any, any> {
    render() {

        return <PageDiv>
            {this.renderChildRoutes()}
        </PageDiv>

    }
}


export const chapterReferences: RouteConfig = {
    index: {
        component: ChapterReferences,
        path: '/app/refs',
        innerIndex: '/app/refs/list',
        icon: <Library.Help/>,
        label: 'Справочники',
        title: 'Управление справочниками',
    },

    list: {
        index: {
            title: 'Управление справочниками',
            path: '/app/refs/list',
            component: RefsLinks,
            exact: true,
        },
    },

    [WELL_PLACE.name]: {
        index: {
            component: WellPlaces,
            title: 'Площади',
            path: '/app/refs/wellPlaces',
        },
    },
    [WELL_FIELD.name]: {
        index: {
            component: WellFields,
            title: 'Месторождения',
            path: '/app/refs/wellFields',
        },
    },

    [WELL_LICENSE_AREA.name]: {
        index: {
            component: WellLicenseAreas,
            title: 'Лицензионные участки',
            path: '/app/refs/wellLicenseAreas',
        },
    },
    [WELL_PURPOSE.name]: {
        index: {
            component: WellPurposes,
            title: 'Назначения скважин',
            path: '/app/refs/wellPurposes',
        },
    },

    [WELL_STATUS.name]: {
        index: {
            component: WellStatuses,
            title: 'Статусы скважин',
            path: '/app/refs/wellStatuses',
        },
    },

    [INCIDENT_TYPE.name]: {
        index: {
            component: Incidents,
            title: 'Инциденты (НПВ)',
            path: '/app/refs/incidentTypes',
        },
    },

    [CONTRACTOR_TYPE.name]: {
        index: {
            component: ContractorTypes,
            title: 'Подрядчики',
            path: '/app/refs/contractorTypes',
        },
    },

    [RIG_WINCH_TYPE.name]: {
        index: {
            component: RigWinchTypes,
            title: 'Буровые лебёдки',
            path: '/app/refs/rigWinchTypes',
        },
    },
}


export default ChapterReferences


