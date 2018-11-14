import {createScheme, KeyBuilder, valueTypes} from '../core'
import {comment, creationDate, creatorUserId} from '../core/properties'
import {PROJECT} from './Project'
import {WELL_FIELD} from '../references/WellField'
import {WELL_PLACE} from '../references/WellPlace'

type Coordinates = {
    latitude: string
    longitude: string
}

/*
const allWells = () => sel<WellVO>('WELL').asMap()

const inProjectAndGroup = (projectId, groupId) => state => {
    const userGroup = sel(GROUP).byKey(groupId)(state)
    const excludedInProject = userGroup.excludedWellsInProjects[projectId] || []
    return compose(
        filterObj<WellVO>(well =>
            well.projectId === projectId &&
            !excludedInProject.includes(well.wellId)

        ),
        allWells()
    )(state)
}*/

const properties = {
    wellFieldId: valueTypes.itemOf({
        required: true,
        schemeName: 'WELL_FIELD',
    }),
    projectId: valueTypes.itemOf({
        type: 'string',
        schemeName: 'PROJECT',

    }),
    wellPurposeId: valueTypes.itemOf({
        required: true,
        schemeName: 'WELL_PURPOSE',
    }),
    wellStatusId: valueTypes.itemOf({
        required: true,
        schemeName: 'WELL_STATUS',
    }),
    wellLicenseAreaId: valueTypes.itemOf({
        required: true,
        schemeName: 'WELL_LICENSE_AREA',
    }),
    wellPlaceId: valueTypes.itemOf({
        required: true,
        schemeName: 'WELL_PLACE',
    }),
    startDate: valueTypes.datetime(),
    clusterNumber: valueTypes.string(),
    basing: valueTypes.number({
        required: true,
    }),
    number: valueTypes.string({
        required: true,
    }),
    altitude: valueTypes.number(),
    creationDate,
    creatorUserId,
    comment,
    wellId: valueTypes.string(),
    coordinates: valueTypes.item<Coordinates>(),
}

export const WELL = createScheme({
    name: 'WELL',
    keyBuilder: new KeyBuilder().increment('wellId'),
    lang: {
        singular: 'скважина',
        plural: 'скважин',
        some: 'скважины',
        name: 'скважины',
    },
    getFullName: ({wellPlaceId, wellFieldId, clusterNumber, number}) => (state?) => {
        const wellField = WELL_FIELD.getFullName(wellFieldId)(state)
        const wellPlace = WELL_PLACE.getFullName(wellPlaceId)(state)

        return `${wellField || 'NN'} м-е, ${wellPlace || 'NN'} пл., к.${clusterNumber || 'NN'}, ${number || 'NN'}`
    },
    getShortName: ({wellPlaceId, wellFieldId, clusterNumber, number}) => (state?) => {
        const wellField = WELL_FIELD.getFullName(wellFieldId)(state)
        const wellPlace = WELL_PLACE.getFullName(wellPlaceId)(state)

        return `${wellField || 'NN'} м-е, ${wellPlace || 'NN'} пл., к.${clusterNumber || 'NN'}, ${number || 'NN'}`
    },
    properties,
    /* selectors: {
         inGroup: groupId => (state => {
             const wells = allWells()(state)
             const ids = sel(GROUP).byKey(groupId)(state).wellIds
             return pick(ids, wells) as AssociativeArray<WellVO>
         }),

         inProject: projectId => state => {
             const wells = allWells()(state)
             const filtered = filterObj(whereEq({projectId}))(wells)
             return filtered
         },

         availableForUser: userId => state => {
             const user = sel(USER).byKey(userId)(state)
             const group = sel(GROUP).byKey(user.groupId)(state)
             if (!group)
                 return []

             const projects = PROJECT.selectors.byGroup(user.groupId)(state)
             return flatten(projects.map( p =>
                 inProjectAndGroup(p.projectId, user.groupId)(state)
             ))
         },

         inProjectAndGroup,
     },*/
})

export type WellVO = typeof WELL.item

export type WellSpec = typeof WELL.spec
