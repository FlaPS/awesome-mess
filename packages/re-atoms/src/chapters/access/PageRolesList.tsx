import * as React from 'react'
import Fab from '../../controls/Fab'
import {ROLE} from '@local/biz'
import {Library} from '../../styles/SVGLibrary'
import {viewGridHeader} from '../../grids/grid/gridElements'
import {RawRolesGrid} from '../adminParts'
import {Pure} from '../../smart/Pure'


const RolesGrid = Pure()
    .of(RawRolesGrid)
    .connect(state => ({
        data: ROLE.asMap()(state),
        scheme: ROLE,
    }))
    .contramap(viewGridHeader)

const Page = () =>
    <div>
        <RolesGrid
            title='Роли'

        />
        <Fab
            onClick={/*() =>
                    getStore().dispatch(
                        push(nav.app.access.createRole.index.path),
                    )*/}
        >
            <Library.Add/>
        </Fab>
    </div>

export default Page