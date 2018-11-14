import * as React from 'react'
import {connect} from 'react-redux'
import {groupBy, prop} from 'ramda'
import {push} from 'react-router-redux'

import Fab from '../../../controls/Fab'
import {Library} from '../../../styles/SVGLibrary'
import nav from '../../../app/nav'
import PageLayout from '../../../layout/PageLayout'

import {makeGrid} from '../../../grids/grid/Grid'
import {Pure} from '../../../smart/Pure'
import {gridData} from '../../../grids/grid/gridHelpers'
import {wellGridHeader} from '../../../grids/grid/gridElements'

import {dispatch} from '../../../store/'
import {columnsWells} from './ColumnsWells'

import {pluralize, PROJECT, WELL, WELL_FIELD, WELL_LICENSE_AREA, WellVO} from '@local/biz'

import GroupingControl from '../../../controls/GroupingControl'
import styled from 'styled-components'
import Div from '../../../layout/Div'
import {AssociativeArray, toIndexedArray} from '@local/utils'
import colors from '../../../styles/colors'


const WellsGrid = Pure()
    .of(makeGrid(columnsWells))
    .contramap(wellGridHeader())

const Head = styled(Div)`
    background-color: white;
    padding: 15px 0;
    border-bottom: 1px solid ${colors.BORDER_GRAY};
`

type PageWellsListState = {
    currentRuleIndex: string
}

type PageWellsListProps = {
    data: AssociativeArray<WellVO>
}

type Rule = {
    label: string
    key: string
}

class PageWellsList extends React.Component<PageWellsListProps, PageWellsListState> {
    setSortingRule =
        (index: string) =>
            this.setState({currentRuleIndex: index || null})
    renderGrid =
        (title: string = 'Скважины', rule?: Rule) => (data: WellVO[], i: number = 0) => {
            let computedTitle = title
            if (rule) {
                const {key} = rule
                computedTitle = (toIndexedArray(this.props[key])
                    .find(ref => data.some(vo => vo[key] === ref[key])) as { name: string }).name
            }

            return (
                <WellsGrid
                    key={i}
                    headerProps={{title: computedTitle, itemsCount: pluralize(WELL)(data.length)}}
                    data={data}
                    idKey={WELL.uniqueProperty}
                    withPagination={false}
                    onRowClick={well => dispatch(push(nav.app.chapterWells.well.index.get(well)))}
                />
            )
        }
    renderGroupedWells = (rule: Rule) => {
        const {data} = this.props

        const {undefined: unGrouped, ...grouped}: AssociativeArray<WellVO[]> =
            groupBy(prop(rule.key))(toIndexedArray(data))

        const rendered = toIndexedArray(grouped)
            .map(this.renderGrid('', rule))

        if (unGrouped) rendered.push(this.renderGrid('Другие')(unGrouped, rendered.length))

        return rendered
    }
    renderWells = () => {
        const {data} = this.props
        const {currentRuleIndex} = this.state

        const rule = this.sortingRules[currentRuleIndex] as Rule

        return rule
            ? this.renderGroupedWells(rule)
            : this.renderGrid()(toIndexedArray(data))
    }
    private sortingRules: Rule[]

    constructor(props) {
        super(props)

        this.sortingRules = [
            {key: 'wellFieldId', label: 'Месторождения'},
            {key: 'wellLicenseAreaId', label: 'Лицензионные участки'},
        ]
        this.state = {currentRuleIndex: '0'}
    }

    render() {
        return (
            <div>
                <Head>
                    <PageLayout style={{padding: 0}}>
                        <GroupingControl
                            value={this.state.currentRuleIndex}
                            data={this.sortingRules.map(rule => rule.label)}
                            onChange={this.setSortingRule}
                        />
                    </PageLayout>
                </Head>
                <PageLayout>

                    {this.renderWells()}

                    <Fab
                        link={nav.app.chapterWells.addWell.index.path}
                    >
                        <Library.Add/>
                    </Fab>
                </PageLayout>
            </div>
        )
    }
}

export default connect(state => ({
    wellLicenseAreaId: WELL_LICENSE_AREA.asMap()(state),
    wellFieldId: WELL_FIELD.asMap()(state),
    projectId: PROJECT.asMap()(state),
    ...gridData(WELL)(state),
}))(PageWellsList)
