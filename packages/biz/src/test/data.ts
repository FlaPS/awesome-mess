import getBizTestStore from './getBizTestStore'

const store = getBizTestStore()
const getState = store.getState
/*
test('Create job and select one', () => {
    const patch = {reportFormIds: ['4', '3'] , jobTypeId: '1' }
    const spec = {jobId: '12', rigId: '0'}
    const action = JOB.create(spec,  patch)

    store.dispatch(action)
    const state = getState()
    const job = JOB.byKey('0/12')(state)

    expect(job.jobTypeId).toEqual(patch.jobTypeId)
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

*/

