import * as React from 'react'
import pureGrid from '../../grids/grid/pureGrid'
import {biz} from '@local/biz'
import caseRender from '../../smart/caseRender'
import CenteredCaption from '../../layout/CenteredCaption'

export const RawAllJobGrid = caseRender(pureGrid(biz.JOB, [
    'rigId',
    'jobTypeId',
    'drillRigId',
    'comment',
]))
    .isNilOrEmpty('data', CenteredCaption('Не создано ни одного мероприятия'))

