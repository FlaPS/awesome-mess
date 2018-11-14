import genericForm from '../../smart/genericForm'
import {JOB} from '@local/biz'
import caseRender from '../../smart/caseRender'
import CenteredCaption from '../../layout/CenteredCaption'


export default caseRender(genericForm(JOB))
    .isNilOrEmpty('model', CenteredCaption('Мероприятие не существует или у вас нет прав доступа'))
