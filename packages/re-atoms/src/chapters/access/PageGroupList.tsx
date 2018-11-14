import * as React from 'react'
import {GROUP, UserVO} from '@local/biz'
import Span from '../../layout/Span'
import {caption} from '../../styles/font'
import Fab from '../../controls/Fab'
import {Library} from '../../styles/SVGLibrary'
import {getStore} from '../../store/'
import {viewGridHeader} from '../../grids/grid/gridElements'
import {compose, head, toUpper} from 'ramda'
import {AssociativeArray} from '@local/utils'
import {restyle} from '../../styles/restyle'
import Div from '../../layout/Div'
import pureTree from '../../grids/pureTree'
import {RawUserGroupGrid} from '../adminParts'
import props from '../../smart/props'


const GrayItem = caption()(Span)
const upperHeadWithDot = compose(char => `${char}.`, toUpper, head)
const getUsersInGroup =
    (groupId: string, users: AssociativeArray<UserVO>) =>
        Object.keys(users)
            .map(key => users[key])
            .filter((user: UserVO) => user.groupId === groupId)
            .length

const RightAligned = restyle`
    text-align: right;
`(Div)


const UserGroupGrid = pureTree(GROUP)
    .ap(RawUserGroupGrid)
    .contramap(viewGridHeader)

const ConnectedGrid = props(UserGroupGrid)
    .connectProp(
        'data',
        GROUP.asMap
    )

const Page = () =>
    <div>
        <ConnectedGrid/>
        <Fab
            onClick={() => {
            }
                /*getStore().dispatch(
                    push(nav.app.access.addUserGroup.index.path)
                )*/}
        >
            <Library.Add/>
        </Fab>
    </div>

export default Page

