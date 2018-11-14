import getBizTestStore from './getBizTestStore'
import {JOB} from '../index'

const store = getBizTestStore()
const getState = store.getState

test('Create job and select one', () => {
    const jobPatch = {reportFormIds: ['4', '3'], jobTypeId: '1'}
    const spec = {jobId: '12', rigId: '0'}
    const action = JOB.create(spec, jobPatch)

    store.dispatch(action)
    const state = getState()
    const job = JOB.byKey('0/12')(state)

    expect(job.jobTypeId).toEqual(jobPatch.jobTypeId)
})


test('select jobs where', () => {
        const jobPatch = {reportFormIds: ['4', '3'], jobTypeId: '1'}
        const spec = {jobId: '12', rigId: '1'}
        const action = JOB.create(spec, jobPatch)


        store.dispatch(action)
        expect(
            JOB
                .where({rigId: '1'}).asList().length
        ).toEqual(1)
    }
)

test('select jobs as List ', () =>

    expect(
        JOB
            .asList()().length
    ).toEqual(2)
)

test('create, update and select job', () => {
    const jobPatch = {reportFormIds: ['4', '3'], jobTypeId: '1'}
    const spec = {jobId: '123', rigId: '2'}
    const action = JOB.create(spec, jobPatch)

    store.dispatch(action)

    const job = JOB.bySpec(spec)()
    job.comment = 'Vasya'

    store.dispatch(JOB.update(job))
    expect(
        JOB
            .bySpec(spec)().comment
    ).toEqual('Vasya')
})

/*
test('', () => {
        const jobPatch = {reportFormIds: ['4', '3'], jobTypeId: '1'}
        const spec = {jobId: '123', rigId: '2'}
        const action = JOB.create(spec, jobPatch)
        if( typeof action.payload.id === 'string') {
            const spec = JOB.keyBuilder.parseSpec(action.payload.id)
            JOB.keyBuilder.terminalKey.param
            spec.jobId
        }
    }
)
*/