import * as React from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import {Button} from '../../../controls'
import {pure} from 'recompose'
import styled from 'styled-components'
import {Title} from '../../../styles/Typography';

export type SectionProps = {
    rigId: string
    reportFormId: string
    reportDate: string
}

type SectionState = {
    hasErrors: boolean
}


const StyledCard = styled(pure(Card))`
    width: 100%
`
type Empty = {}

export abstract class SectionCard<P = Empty> extends React.Component<SectionProps & P, SectionState> {
    title: string = 'Секция'

    abstract renderChildren(): React.ReactChild

    render() {
        return <StyledCard>
            <Title>{this.title}</Title>
            <CardContent>
                {this.renderChildren()}
            </CardContent>
            <CardActions>
                <Button dense>Раздел готов</Button>
                <Button dense>Следующий раздел</Button>
            </CardActions>
        </StyledCard>
    }
}

