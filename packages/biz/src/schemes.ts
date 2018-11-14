import {USER} from './general/User'
import {REPORT_TYPE} from './general/ReportType'
import {REPORT_FORM} from './general/ReportForm'
import {JOB_TYPE} from './general/JobTypes'
import {JOB} from './rig/Job'
import {GROUP} from './general/Group'
import {ROLE} from './general/Role'
import {WELL} from './general/Well'
import {PROJECT} from './general/Project'
import {DRILL_RIG} from './general/DrillRig'
import {WELL_STATUS} from './references/WellStatus'
import {WELL_PURPOSE} from './references/WellPurpose'
import {WELL_LICENSE_AREA} from './references/WellLicenseArea'
import {WELL_FIELD} from './references/WellField'
import {WELL_PLACE} from './references/WellPlace'
import {INCIDENT_KIND} from './references/IncidentKind'
import {INCIDENT_TYPE} from './references/IncidentType'
import {DRILL_RIG_OWNER} from './references/DrillRigOwner'
import {DRILL_RIG_TYPE} from './references/DrillRigType'
import {CONTRACTOR_TYPE} from './references/ContractorType'
import {RIG_WINCH_TYPE} from './references/RigWinchType'
import {APPLICATION} from './data/Application'
import {SIGNATORIES} from './data/Signatories'
import {REPORT} from './rig/Report'
import {values} from 'ramda'

export const schemes = {
    GROUP,
    USER,
    ROLE,
    RIG_WINCH_TYPE,
    INCIDENT_KIND,
    INCIDENT_TYPE,
    PROJECT,
    WELL_PLACE,
    WELL_FIELD,
    WELL,
    WELL_STATUS,
    WELL_PURPOSE,
    WELL_LICENSE_AREA,
    CONTRACTOR_TYPE,
    DRILL_RIG,
    DRILL_RIG_OWNER,
    DRILL_RIG_TYPE,
    JOB,
    JOB_TYPE,
    REPORT_FORM,
    REPORT_TYPE,
    APPLICATION,
    SIGNATORIES,
    REPORT,
}


export * from './general/User'
export * from './general/ReportType'
export * from './general/ReportForm'
export * from './general/JobTypes'
export * from './data/Signatories'
export * from './data/Application'
export * from './rig/Job'
export * from './rig/Report'
export * from './general/Group'
export * from './general/Role'
export * from './general/Well'
export * from './general/Project'
export * from './general/DrillRig'
export * from './references/WellStatus'
export * from './references/WellPurpose'
export * from './references/WellLicenseArea'
export * from './references/WellField'
export * from './references/WellPlace'
export * from './references/IncidentKind'
export * from './references/IncidentType'
export * from './references/DrillRigOwner'
export * from './references/DrillRigType'
export * from './references/ContractorType'
export * from './references/RigWinchType'


export const schemesList = values(schemes)
