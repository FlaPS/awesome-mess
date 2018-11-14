export const ACLRestricted = 0
export const ACLRead = 1
export const ACLUpdate = 2
export const ACLCreate = 3
export type ACLAny = typeof ACLRestricted | typeof ACLRead | typeof ACLUpdate | typeof ACLCreate
export type ACLKeys = {
    superAdmin: boolean
    job: ACLAny
    user: ACLAny
    well: ACLAny
    group: ACLAny
    project: ACLAny
    report: ACLAny
}
