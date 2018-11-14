import * as React from 'react'
import pureGrid from '../../grids/grid/pureGrid'
import {biz} from '@local/biz'
import caseRender from '../../smart/caseRender'
import CenteredCaption from '../../layout/CenteredCaption'


export const RawAllReports = caseRender(pureGrid(biz.REPORT, [
    'rigId',
    'reportFormId',
    'reportDate',
]))

    .isNilOrEmpty('data', CenteredCaption('Не создано ни одного рапорта'))


