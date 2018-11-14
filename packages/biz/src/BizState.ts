import {ReportTypeVO} from './general/ReportType'
import {JobTypeVO} from './general/JobTypes'
import {AssociativeArray} from '@local/utils'
import {UserVO} from './general/User'
import {GroupVO} from './general/Group'
import {RoleVO} from './general/Role'
import {WellVO} from './general/Well'
import {ProjectVO} from './general/Project'
import {WellPurposeVO} from './references/WellPurpose'
import {WellStatusVO} from './references/WellStatus'
import {WellFieldVO} from './references/WellField'
import {WellPlaceVO} from './references/WellPlace'
import {WellLicenseAreaVO} from './references/WellLicenseArea'
import {IncidentKindVO} from './references/IncidentKind'
import {IncidentTypeVO} from './references/IncidentType'
import {DrillRigOwnerVO} from './references/DrillRigOwner'
import {DrillRigTypeVO} from './references/DrillRigType'
import {DrillRigVO} from './general/DrillRig'
import {ContractorTypeVO} from './references/ContractorType'
import {RigWinchTypeVO} from './references/RigWinchType'
import {ReportFormVO} from './general/ReportForm'
import {RigVO} from './Rig'

export const defaultReportForms = {
    '0': {
        reportFormId: '0',
        reportTypeId: '0',
        name: 'Полная буровая форма',
    },
    '1': {
        reportFormId: '1',
        reportTypeId: '0',
        name: 'Форма ГГР',
    },
    '2': {
        reportFormId: '2',
        reportTypeId: '1',
        name: 'Только отечественные',
    },
    '3': {
        reportFormId: '3',
        reportTypeId: '1',
        name: 'Только импортные',
    },
    '4': {
        reportFormId: '4',
        reportTypeId: '2',
        name: 'Материалы крепления',
    },
}  as any as AssociativeArray<ReportFormVO>

export const defaultReportTypes = {
    '0': {
        reportTypeId: '0',
        jobTypeId: '0',
        name: 'Буровой рапорт',
    },
    '1': {
        reportTypeId: '1',
        jobTypeId: '0',
        name: 'Рапорт по растворам',
    },
    '2': {
        reportTypeId: '2',
        jobTypeId: '1',
        name: 'Рапорт по расходным материалам',
    },
} as any as AssociativeArray<ReportTypeVO>

export const defaultJobTypes = {
    '0': {
        jobTypeId: '0',
        name: 'Бурение',
    },
    '1': {
        jobTypeId: '1',
        name: 'Крепление',
    },
} as any as AssociativeArray<JobTypeVO>


export const defaultBizState: BizState = {
    meta: {},
    rigId: {} as AssociativeArray<RigVO>,
    userId: {},
    roleId: {},
    groupId: {},
    projectId: {},
    wellId: {},
    contractorTypeId: {},
    incidentKindId: {},
    incidentTypeId: {},
    rigWinchTypeId: {},
    wellFieldId: {},
    wellLicenseAreaId: {},
    wellPurposeId: {},
    wellPlaceId: {},
    wellStatusId: {},
    drillRigOwnerId: {},
    drillRigTypeId: {},
    drillRigId: {},
    jobTypeId: defaultJobTypes,
    reportTypeId: defaultReportTypes,
    reportFormId: defaultReportForms,
}

export type BizMeta = {
    lastMasterEventGuid?: string
    lastMasterEventId?: string
    stateGUID?: string
}

export type BizState = {
    meta: BizMeta
    userId: AssociativeArray<UserVO>
    groupId: AssociativeArray<GroupVO>
    roleId: AssociativeArray<RoleVO>
    wellId: AssociativeArray<WellVO>
    projectId: AssociativeArray<ProjectVO>
    rigWinchTypeId: AssociativeArray<RigWinchTypeVO>
    incidentKindId: AssociativeArray<IncidentKindVO>
    incidentTypeId: AssociativeArray<IncidentTypeVO>
    wellFieldId: AssociativeArray<WellFieldVO>
    wellLicenseAreaId: AssociativeArray<WellLicenseAreaVO>
    wellPlaceId: AssociativeArray<WellPlaceVO>
    wellPurposeId: AssociativeArray<WellPurposeVO>
    wellStatusId: AssociativeArray<WellStatusVO>
    contractorTypeId: AssociativeArray<ContractorTypeVO>
    drillRigOwnerId: AssociativeArray<DrillRigOwnerVO>
    drillRigTypeId: AssociativeArray<DrillRigTypeVO>
    drillRigId: AssociativeArray<DrillRigVO>
    jobTypeId: AssociativeArray<JobTypeVO>
    reportTypeId: AssociativeArray<ReportTypeVO>
    reportFormId: AssociativeArray<ReportFormVO>
    rigId: AssociativeArray<RigVO>
}


export type StateWithBiz = {
    biz: BizState
}
