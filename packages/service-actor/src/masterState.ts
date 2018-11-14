import * as fd from '@local/file-data'
import * as biz from '@local/biz'

export default fd.fileDataRepository<{ biz: biz.BizState }>('masterState.json')
