import * as React from 'react'
import {connectedInput, PopUpDescriptionInput, PopUpNameInput} from '../inputs/index'
import {AdminItemVO, Scheme, sel, USER} from '@local/biz'
import {FlexSpaceBetween} from '../layout/index'
import {caption, ExtrasoftBlack} from '../styles/font'
import Div from '../layout/Div'
import * as moment from 'moment'
import {HBox, VBox} from '../layout/Box'
import caseRender from '../smart/caseRender'
import RemoveButton from './RemoveButton'
import {colors, restyle} from '../styles'
import props from '../smart/props'

type CreatorProps = {
    creationDate: string
    creatorUserId: string
}

const CreatorHeader = restyle`
    margin-bottom: 10px;
`(caption(ExtrasoftBlack)(Div))

const CreationInfoRaw = ({creationDate, creatorUserId, ...props}: CreatorProps) => (
    <CreatorHeader {...props}>
        {`Созд. ${moment(creationDate).format('DD MMM YYYY')}, ${sel(USER).getShortName(creatorUserId)()}`}
    </CreatorHeader>
)

export const CreationInfo =
    caseRender(CreationInfoRaw)
        .isNil('creatorUserId', null)

const RemoveButtonContainer = restyle`
    padding: 3px 0 3px 24px;
    margin-left: 24px;
    border-left: 1px solid ${colors.DISABLED_GRAY};
    flex: none;
`(Div)

const NameInputContainer = restyle`
    flex: 1 0 auto;
`(Div)

const CenterAligned = restyle`
    justify-content: flex-end;
    flex: none;
    align-items: center;
    flex: 0 1 60%;
`(HBox)

const RightAligned = restyle`
    align-items: flex-end;
`(VBox)

export default function <T extends AdminItemVO>(scheme: Scheme<T>) {

    const NameInput = connectedInput(scheme, 'name', PopUpNameInput)

    const CommentInput = connectedInput(scheme, 'comment', PopUpDescriptionInput)

    const nameTitle = 'Имя'
    const nameLabel = `Введите имя для ${scheme.lang.some}`

    const descriptionTitle = 'Комментарий'
    const descriptionLabel = `Введите комментарий для ${scheme.lang.some}`

    const nameReadonly = scheme.properties['name'] === undefined
    const Comp =
        (props: { value: T, id: string, removeIsHidden?: boolean }) =>
            <FlexSpaceBetween>
                <NameInputContainer>
                    {nameReadonly
                        ? <PopUpNameInput type='name' readonly value={sel(scheme).getFullName(props.value)()}/>
                        : <NameInput idOrSpec={props.id} label={nameLabel} title={nameTitle}/>
                    }
                </NameInputContainer>

                <CenterAligned>
                    <RightAligned>
                        <CreationInfo
                            creatorUserId={props.value.creatorUserId}
                            creationDate={props.value.creationDate}
                        />
                        <CommentInput idOrSpec={props.id} label={descriptionLabel} title={descriptionTitle}/>
                    </RightAligned>
                    {
                        !props.removeIsHidden &&
                        <RemoveButtonContainer>
                            <RemoveButton disabled/>
                        </RemoveButtonContainer>
                    }
                </CenterAligned>
            </FlexSpaceBetween>

    return props(Comp)
        .connectProp('value', props =>
            sel(scheme).byKey(props.id)
        )
}
