import getBizTestStore from './getBizTestStore'
import {seedBiz} from '../Seed'
import {GROUP, GroupVO} from '../'
import * as R from 'ramda'
import {projects, users, wells} from '../selectors/'
import {toIndexedArray} from '@local/utils/dist/array'

const store = getBizTestStore()
const getState = store.getState

beforeAll(done => {
    getBizTestStore()
    done()
})

test('Seed state', () => {
    seedBiz(getBizTestStore())
    const state = getState()
})


test('select users in 2 groups, by direct groupId, with new curring', () =>
    expect(users.byGroup(['0', '1']).asList().length).toBeTruthy()
)

test('select users in project', () =>
    expect(users.byProject('1')).toBeDefined()
)
test('select users in project', () =>
    expect(users.byRole('1')).toBeDefined()
)

test('select wells by group ids', () => {
        expect(wells.byGroup(['1', '2']).asList()).toBeDefined()
    }
)

test('projects by user', () => {
    const userId = '1'
    const state = getState()
    const projectKeys = projects.byUser(userId).asKeys(state).sort()

    const user = state.biz.userId[userId]
    const group = GROUP.bySpec(user.groupId)(state) || {} as any as GroupVO
    const result = R.uniq((user.projectIds || []).concat(
        group.projectIds || []
    )).sort()

    expect(projectKeys).toEqual(result)
})

test('select groups with will by wellid', () => {
        const state = getState()
        const selection = wells.byProjectInGroup({projectId: '1', groupId: '1'}).asKeys(state)
        const group = state.biz.groupId['1']
        const excluded = group.excludedWellsInProjects['1'] || []
        const filteredWells = toIndexedArray(state.biz.wellId).filter(
            w => w.projectId === '1' && !excluded.includes(w.wellId)
        )
            .map(w => w.wellId)

        expect(selection.length).toEqual(filteredWells.length)
    }
)

test('select all available wells by userId', () => {
        const state = getState()
        const wellIds = wells.allAvailableIdsByUserId('1')(state)
        expect(wellIds.length).toBeGreaterThan(0)

    }
)