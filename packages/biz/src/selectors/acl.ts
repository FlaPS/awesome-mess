import {StateWithBiz} from '../BizState'


export const getAvailableWells = userId => (state: StateWithBiz) => {

}
/*
export default (userId: string) => (state: StateWithBiz) => {
    const user = USER.bySpec(userId)(state)
    const ownWells = WELL.bySpec(user.wellIds)(state)
    const ownProjects = PROJECT.bySpec(user.projectIds)(state)
  
    const group = GROUP.bySpec(user.groupId)(state)
    const groupWells = group
        ?
        : []
    const availableWells =
}*/