import {getLogger} from './index'

let logger = getLogger('other')

logger.debug('default logger debug examples aftertsc')
logger.log('default logger log')
logger.info('default logger info')
logger.warn('default logger warn')
logger.error('default logger error')

logger = getLogger('default')

logger.debug('default logger debug')
logger.log('default logger log')
logger.info('default logger info 5')
logger.warn('default logger warn')
logger.error('default logger error')
