import axios from 'axios'
import {ActivationRequest, ActivationResponse} from './activation'

export default ({gateway}) => ({
    activate: async (request: ActivationRequest): Promise<ActivationResponse> => {
        try {
            const url = 'http://' + gateway + '/api/activation/'

            const result = await axios({
                url,
                method: 'post',
                data: request,
            })

            return result.data
        } catch (e) {

            return {
                status: 'error',
                error: (e as Error).message
            }
        }
    },
})
