import * as React from 'react'
import * as moment from 'moment'
import {caption, ExtrasoftBlack} from '../styles/font'
import Div from '../layout/Div'
import {getUserNameWithInitials, UserVO} from '@local/biz'

const CreatorHeader = caption(ExtrasoftBlack)(Div)

type CreatorProps = {
    creationDate: string
    creator: UserVO
}

export const Creator = ({creationDate, creator}: CreatorProps) => (
    <CreatorHeader>
        {`${moment(creationDate).format('DD MMM YYYY')}, ${getUserNameWithInitials(creator)}`}
    </CreatorHeader>
)
