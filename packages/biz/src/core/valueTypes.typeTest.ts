import {valueTypes} from './valueTypes'


const text = valueTypes.string({required: true})
type  StringWithMeta = typeof text


// ok
// const n: StringValue = 5

// VT is string, error
// const s: StringValue = 'l'

const props = {
    /* a: valueTypes.itemOf({
         required: true,
         schemeName: 'WELL_FIELD',
     }),
     b: valueTypes.itemOf({

         schemeName: 'PROJECT',

 }),*/
    b: valueTypes.string(),
    c: valueTypes.array<number>(),
}
/*
type PropsVO = InferredVO<typeof props>

const a: PropsVO = {
    b: '1',
    c: [2],
}
*/
