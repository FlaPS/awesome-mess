import getBizTestStore from './getBizTestStore'
import {WELL} from '../'
import {isNil, merge, over} from 'ramda'

const store = getBizTestStore()
const getState = store.getState

test('Create well and select one', () => {
    const itemLens = WELL.keyBuilder.getLens('0')
    const action = WELL.create({wellId: '0'}, {comment: 'Abc'})
    store.dispatch(action)

    const state = getState()
    const well = WELL.bySpec('0')(state)
    expect(well.comment).toEqual('Abc')
})

