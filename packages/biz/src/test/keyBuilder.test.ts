import {WELL} from '../general/Well'
import {USER} from '../general/User'
import {JOB,} from '../rig/Job'

import getBizTestStore from './getBizTestStore'
import * as R from 'ramda'

const store = getBizTestStore()
const getState = store.getState

test('test string to spec key parser', () => {
        const key = '1'
        const spec = WELL.keyBuilder.parseSpec(key)
        expect(spec.wellId).toEqual('1')
    }
)

test('test spec to string key builder', () => {
        const spec = {wellId: '1'}
        const key = WELL.keyBuilder.buildKey(spec)
        expect(key).toEqual('1')
    }
)

test('create job key by spec, and test one', () => {
    const spec = {rigId: '3', jobId: '17'}
    const key = JOB.keyBuilder.buildKey(spec)
    expect(key).toEqual('3/17')
})


test('create job spec by key, and test one', () => {
    const key = '3/17'
    const spec = JOB.keyBuilder.parseSpec(key)
    expect(spec).toEqual({rigId: '3', jobId: '17'})
})


test('KeyBuilder path', () => {
    const key = '3/17'
    const path = JOB.keyBuilder.getPath(key)
    expect(path).toEqual(['biz', 'rigId', '3', 'jobId', '17'])
})

test('KeyBuilder path and back to key', () => {
    const key = '3/17'
    const path = JOB.keyBuilder.parseSpec(key)
    expect(JOB.keyBuilder.buildKey(path)).toEqual(key)
})

test('Simple lens, set user and view one', () => {
    const user = {login: 'hi'}
    const lens = USER.keyBuilder.getLens('1')
    const result = R.over(lens, () => user)(getState())
    const selection = R.view(lens, result)
    expect(selection).toEqual(user)
})