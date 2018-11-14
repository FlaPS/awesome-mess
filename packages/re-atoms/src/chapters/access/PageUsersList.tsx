import * as React from 'react'
import Fab from '../../controls/Fab'
import {Library} from '../../styles/SVGLibrary'
import nav from '../../app/nav'
import {USER} from '@local/biz'
import {gridData} from '../../grids/grid/gridHelpers'
import {viewGridHeader} from '../../grids/grid/gridElements'
import {RawUserGrid} from '../adminParts'
import {Pure} from '../../smart/Pure'

const UsersGrid = Pure()
    .of(RawUserGrid)
    .connect(gridData(USER))
    .contramap(viewGridHeader)

const Page = () =>
    <div>
        <UsersGrid
            title='Пользователи'
        />
        <Fab
            link={nav.app.access.addUser.index.path}
        >
            <Library.Add/>
        </Fab>
    </div>

export default Page
