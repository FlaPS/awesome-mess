import * as R from 'ramda'
import getBizTestStore from './getBizTestStore'
import {GROUP, PROJECT, ROLE, USER, WELL} from '../index'
import {seedBiz} from '../Seed'

const store = getBizTestStore()
const getState = store.getState

beforeAll(done => {
    getBizTestStore()
    done()
})

test('Seed state', () => {
    seedBiz(getBizTestStore())
})

test('Select user by id', () => {
    const result = USER.byKey('1')()
    expect(result).toBeTruthy()
})

test('Select 2 wells by ids array', () => {
    const result = WELL.byKey(['1', '2'])()
    expect(R.values(result).length).toBe(2)
})

test('Select role by spec', () =>
    expect(ROLE.bySpec({roleId: '2'})()).toBeTruthy()
)

test('Select project by string spec', () =>
    expect(PROJECT.bySpec('1')()).toBeTruthy()
)

test('select 1 user group, by One spec', () =>
    expect(GROUP.bySpec({groupId: '1'})()).toBeTruthy()
)

test('select 2 user groups, by 2 specs', () =>
    expect(R.keys(GROUP.bySpec([{groupId: '0'}, {groupId: '1'}])()).length).toEqual(2)
)

test('select users where sturcture equals', () =>
    expect(USER.where({groupId: '1'}).asList().length > 0).toBeTruthy()
)

test('select users where multiple sturctures equals', () =>
    expect(USER.where([{groupId: '0'}, {creatorUserId: '1'}]).asKeys().length > 0).toBeTruthy()
)

test('select all users', () =>
    expect(USER.asMap()()).toBeTruthy()
)

test('select users where some conds', () =>
    expect(USER.where({
        groupId: '1',
        login: s => s.length > 1,
    })
        .asList().length > 0
    ).toBeTruthy()
)

test('select random well name', () =>
    expect(WELL.getFullName(WELL.bySpec('1')())()).toBeTruthy()
)

test('select whereProp satisfies', () =>
    expect(WELL.whereProp('projectId')(id => id !== undefined).asList()).toBeTruthy()
)

test('create well with id 1000, and select on', () => {
    const key = {wellId: '1000'}

    const action = WELL.create(key, {basing: 1})
    getBizTestStore().dispatch(action)
    const state = getBizTestStore().getState()

    const newWell = WELL.byKey(key)(state)
    expect(newWell.basing).toEqual(1)
})
