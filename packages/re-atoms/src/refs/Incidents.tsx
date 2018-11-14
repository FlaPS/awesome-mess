import * as React from 'react'
import {
    actions,
    INCIDENT_KIND,
    INCIDENT_TYPE,
    IncidentKindVO,
    IncidentTypeVO,
    schemeLens,
    USER,
    UserVO
} from '@local/biz'
import {Library} from '../styles/SVGLibrary'
import {AssociativeArray, toIndexedArray} from '@local/utils'
import {omit, T} from 'ramda'
import {default as Div, DivProps} from '../layout/Div'
import Grid, {Column} from '../grids/grid/Grid'
import styled from 'styled-components'
import RefNameInput from './RefNameInput'
import RefHeaderTemplate from './RefTemplate/RefHeaderTemplate'
import RefGridTemplate from './RefTemplate/RefGridTemplate'
import forkConnect from '../smart/forkConnect'
import {restyle} from '../styles/restyle'
import ExpansionButton from '../controls/ExpansionButton'
import {defaultProps} from 'recompose'
import Button from 'material-ui/Button'
import {InputProvider} from '../InputProvider'
import AddRefItemModal from './addRefItemModal'
import {getUserName} from './refUtils'

const omitIncidentRefProps = omit(['incidentTypes', 'incidentKinds', 'user', 'dispatch'])

type IncidentRefProps = {
    incidentTypes: AssociativeArray<IncidentTypeVO>
    incidentKinds: AssociativeArray<IncidentKindVO>
    user: AssociativeArray<UserVO>
    onShowLog: () => any
    onExport: () => any
    fork: any
    forked: any
    reset: any
    commit: any
    history: any
    dispatch: any
}

type IncidentRefState = {
    expanded: string[]
    actual: boolean
    edit: boolean
    filter: string
    showModal: boolean
    addingScheme: INCIDENT_TYPE | INCIDENT_KIND | null
    addingKindTypeId: string
}

type KindsCountCellProps = DivProps & {
    count: string,
    isExpanded: boolean
    onClick: () => any
}

const omitKindsCountCellProps = omit(['count', 'isExpanded'])

const CellWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    float: right;
`

const RefPage = restyle`
    display: flex;
    flex-direction: column;
    align-items: center;
`(Div)

const RefBody = restyle`
    margin-top: 136px;
`(Div)

const SubRefBody = restyle`
    margin-top: 24px;
    margin-bottom: 24px;
`(Div)

const CollapsePane = restyle`
    background-color: rgba(245,245,246,0.56);
    display: flex;
    flex-direction: row-reverse;
    padding-right: 8px;
    padding-left: 8px;
    border-top: 1px solid rgba(0,0,0,0.12);
    height: 56px;
    justify-content: space-between;
    align-items: center;
`(Div)


const AddButton = restyle`
    height: 36px;
    color: #40C4FF!important;
    padding: 0 16px 0 8px!important;
    font-family: Roboto!important;
    font-size: 14px!important;
    font-weight: 500!important;
`(Button)

const CollapseButton = restyle`
    color: rgba(0,0,0,0.54)!important;
    font-family: Roboto;
    font-size: 14px;
    display: flex;
    height: 36px;
    padding: 0 0 0 16px!important;
    align-items: center;
`(Button)

const CollapseIcon = restyle`
    color: rgba(0,0,0,0.54)!important;
    margin-left: 8px;
    margin-right: 8px;
`(Library.DropdownUp)

const KindCountCell = (props: KindsCountCellProps) =>
    <CellWrapper {...omitKindsCountCellProps(props)}>
        {props.count}
        <ExpansionButton value={props.isExpanded} onChange={props.onClick}/>
    </CellWrapper>

const IncidentTypeNameInput = RefNameInput(INCIDENT_TYPE)

const IncidentKindNameInput = RefNameInput(INCIDENT_KIND)

const ShadowDiv = restyle`
    position: relative;
    left: -5px;
    height: 24px;
    width: 115%;
    background-color: #f5f5f6;
`(Div)

const PaperLikeGrid = restyle`
    background-color: #FFFFFF; 
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);  
`(RefGridTemplate)

class IncidentsRef extends React.Component<IncidentRefProps, IncidentRefState> {

    static defaultProps: Partial<IncidentRefProps> = {
        history: [],
    }
    private renderHeader = () =>
        (
            <RefHeaderTemplate
                edit={this.state.edit}
                actual={this.state.actual}
                scrolled={false}
                label={INCIDENT_TYPE.lang.name}
                onShowActive={this.showActive}
                onShowAll={this.showAll}
                onSearch={this.onSearch}
                onShowLogClick={this.props.onShowLog}
                onExportClick={this.props.onExport}
                onAddClick={this.onAddClick}
                onEditClick={this.onEditClick}
                onSaveClick={this.onSaveClick}
                onCancelClick={this.onCancelClick}
                scheme={INCIDENT_TYPE}
                activeAvailable={this.anyActualRefTypeExists()}
                width={832}
                saveAvailable={this.props.localHistory.length > 0}
                allAvailable={this.allAvailable()}
            />
        )
    private renderBody =
        () =>
            <PaperLikeGrid
                data={this.getIncidentsTypesData()}
                users={this.props.user}
                refScheme={INCIDENT_TYPE}
                columns={this.getIncidentsTypesColumns()}
                dispatch={this.props.dispatch}
                edit={this.state.edit}
                width={832}
                onToggleVisible={this.handleKindsVisibilityOnTypeChange}
                expandedRowRender={this.renderExpandedRow}
                gridRowsClassname={(record, index) =>
                    [this.state.expanded.indexOf(record.incidentTypeId) !== -1 ? Grid.rowClasses.expandedRaw : '']}
                onExpandChange={this.handleExpanded}
                expandAll={this.state.filter.length > 0}
                expandedValues={this.state.expanded}
            />
    private renderTableBar = (vo: IncidentTypeVO) => (
        <CollapsePane>
            <CollapseButton id={'c' + vo.incidentTypeId} onClick={this.collapse}>
                Свернуть
                <CollapseIcon/>
            </CollapseButton>
            {this.state.edit && <AddButton id={'a' + vo.incidentTypeId} onClick={this.onAddKindClick}>
                <Library.Add style={{marginRight: '9px'}}/>
                {`Добавить ${INCIDENT_KIND.lang.singular}`}
            </AddButton>}
        </CollapsePane>
    )
    private renderExpandedRow = (vo, owner) => <tr>
        <td colSpan={99}>
            <ShadowDiv/>
            <RefGridTemplate
                data={this.getIncidentKindsData(vo)}
                users={this.props.user}
                refScheme={INCIDENT_KIND}
                columns={this.getIncidentKindsColumns()}
                dispatch={this.props.dispatch}
                edit={this.state.edit}
                nested={true}
                onToggleVisible={this.handleTypeVisibilityOnKindChange}
                gridRowsClassname={(record, index) => [Grid.rowClasses.expandedRaw, Grid.cellClasses.noCellPadding]}
                headRowsClassname={() => [Grid.rowClasses.expandedRaw, Grid.cellClasses.noCellPadding]}
                tableBar={this.renderTableBar(vo)}
                emptyLabel={this.getEmptyLabel()}
            />
            <ShadowDiv/>
        </td>
    </tr>
    private getIncidentsTypesColumns = (): Array<Column<IncidentTypeVO>> => [
        {
            title: <span style={{float: 'left'}}>Название</span>,
            dataIndex: 'incidentTypeId',
            classNames: [Grid.cellClasses.noCellPadding],
            render: (value, item, owner) =>
                IncidentTypeNameInput(item, owner.props.dispatch),
        },
        {
            title: <span style={{marginRight: '17px'}}>Подвид</span>,
            dataIndex: INCIDENT_TYPE.uniqueProperty,
            classNames: [Grid.cellClasses.noCellPadding],
            render: (value, vo, owner) => {

                const comparator = !this.state.edit && this.state.actual
                    ? ref => !ref.removed
                    : T

                const count = toIndexedArray(this.props.incidentKinds)
                    .filter(kind => kind.incidentTypeId === value)
                    .filter(comparator).length

                return (
                    <KindCountCell
                        count={count.toString()}
                        isExpanded={owner.state.expandedKeys.includes(value)}
                        id={value}
                        onClick={() => {
                            owner.toggleRowExpand(vo)
                        }}
                    />
                )
            },
        },
        {
            title: 'Создал',
            classNames: [Grid.cellClasses.noCellPadding],
            dataIndex: 'creatorUserId',
            render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
        },
    ]
    private getEmptyLabel = () => ''// this.areKindExistDeleted() ? 'Нет актуальных подвидов' : ''
    private getIncidentKindsColumns = () => [
        {
            title: <span style={{float: 'left'}}>Название</span>,
            dataIndex: 'incidentKindId',
            classNames: [Grid.cellClasses.noCellPadding],
            render: (value, item, owner) => (
                IncidentKindNameInput(item, owner.props.dispatch)
            ),
        },
        {
            title: 'Создал',
            dataIndex: 'creatorUserId',
            classNames: [Grid.cellClasses.noCellPadding],
            render: userId => <div style={{float: 'right'}}>{getUserName(userId)}</div>,
        },
    ]
    private allAvailable = () => toIndexedArray(this.props.incidentKinds).filter(kind => kind.removed).length > 0 ||
        toIndexedArray(this.props.incidentTypes).filter(type => type.removed).length > 0
    private handleExpanded = (values: string[]) => this.setState({expanded: values})
    private handleKindsVisibilityOnTypeChange = (typeId: string) => {
        const refElement = this.findTypeById(typeId)
        const newState = !refElement['removed']
        const kindIds = this.getKindIdsOfType(typeId)
        kindIds.forEach(id => this.props.dispatch(actions.update(INCIDENT_KIND, id, {removed: newState})))
    }
    private handleTypeVisibilityOnKindChange = (kindId: string) => {
        const kind = this.findKindById(kindId)
        const type = this.findTypeById(kind.incidentTypeId)
        const newState = !kind['removed']

        if (kind.removed && type.removed)
            this.props.dispatch(actions.update(INCIDENT_TYPE, type.incidentTypeId, {removed: newState}))
    }
    private findKindById = (kindId: string) =>
        toIndexedArray(this.props.incidentKinds)
            .filter(kind => kind.incidentKindId === kindId)[0]
    private findTypeById = (typeId: string) =>
        toIndexedArray(this.props.incidentTypes)
            .filter(ref => ref.incidentTypeId === typeId)[0]
    private getIncidentsTypesData = () => {
        const comparator = !this.state.edit && this.state.actual
            ? ref => !ref.removed
            : T
        return toIndexedArray(this.props.incidentTypes)
            .filter(comparator)
            .filter(type => !this.state.filter ||
                type.name.toLowerCase().includes(this.state.filter.toLowerCase()) ||
                this.isIncidentKindInFilter(type.incidentTypeId)
            )
    }
    private isIncidentKindInFilter = (typeId: string) =>
        toIndexedArray(this.props.incidentKinds)
            .filter(kind => kind.incidentTypeId === typeId)
            .filter(kind => !this.state.filter || kind.name.toLowerCase().includes(this.state.filter.toLowerCase()))
            .length > 0
    private collapse = e => {
        const incTypeId = e.currentTarget.id.substring(1)
        this.setState({expanded: this.state.expanded.filter(id => id !== incTypeId)})
    }
    private getIncidentKindsData = vo => {
        const comparator = !this.state.edit && this.state.actual
            ? ref => !ref.removed
            : T

        return toIndexedArray(this.props.incidentKinds)
            .filter(kind => kind.incidentTypeId === vo.incidentTypeId)
            .filter(comparator)
            .filter(kind => !this.state.filter || kind.name.toLowerCase().includes(this.state.filter.toLowerCase()))
    }
    private getKindIdsOfType = (typeId: string) =>
        toIndexedArray(this.props.incidentKinds)
            .filter(incidentKind => typeId === incidentKind.incidentTypeId)
            .map(incidentKind => incidentKind.incidentKindId)
    private onAddClick = () => this.setState({showModal: true, addingScheme: INCIDENT_TYPE})
    private onAddKindClick = e =>
        this.setState({
            showModal: true,
            addingScheme: INCIDENT_KIND,
            addingKindTypeId: e.currentTarget.id.substring(1),
        })
    private hidePopup = () => this.setState({showModal: false})
    private anyRefTypeExists = () => toIndexedArray(this.props.incidentTypes).length > 0
    private getExpandedItemDeletedOnSave = () => {
        const {expanded} = this.state
        const expandedType =
            expanded &&
            expanded
                .map(id => this.findTypeById(id))
                .filter(type => this.state.actual && type.removed)
        return expandedType
    }
    private anyActualRefTypeExists = () =>
        toIndexedArray(this.props.incidentTypes).filter(type => !type.removed).length > 0
    private showActive = () => this.setState({actual: true, expanded: ''})
    private showAll = () => this.setState({actual: false, expanded: ''})
    private onEditClick = () => {
        this.props.fork()
        this.setState({edit: true})
    }
    private onSearch = value => {
        if (typeof value === 'string')
            this.setState({filter: value})
    }
    private onCancelClick = () => {
        this.props.reset()
        this.setState({edit: false})
    }
    private onSaveClick = () => {
        const newExpanded = this.getExpandedItemDeletedOnSave()
        this.props.commit()
        this.setState(
            {
                edit: false,
                actual: this.state.actual && this.anyActualRefTypeExists() || !this.allAvailable(), // Проверяем, был ли включен режим просмотра всех или выставляем в зависимости от существования активных
                expanded: newExpanded,
            })
    }

    constructor(props) {
        super(props)
        this.state = {
            actual: this.anyActualRefTypeExists(),
            expanded: [],
            edit: !this.anyRefTypeExists(),
            filter: '',
            showModal: false,
            addingScheme: INCIDENT_TYPE,
            addingKindTypeId: null,
        }
    }

    render() {
        return <RefPage
            {...omitIncidentRefProps(this.props)}
        >
            {this.renderHeader()}
            <InputProvider readonly={!this.state.edit}>
                <RefBody>
                    {this.renderBody()}
                    {this.state.showModal &&
                    <AddRefItemModal
                        dispatch={this.props.dispatch}
                        frontState={this.props.frontState}
                        label={`Добавить ${this.state.addingScheme.lang.singular}`}
                        onAdd={this.hidePopup}
                        onCancel={this.hidePopup}
                        scheme={this.state.addingScheme}
                        itemParentKey={this.state.addingScheme === INCIDENT_KIND && 'incidentTypeId'}
                        itemParentId={this.state.addingKindTypeId}
                    />}
                </RefBody>
            </InputProvider>
        </RefPage>
    }
}

const ConnectedIncidentsRef = forkConnect(state => ({
    incidentTypes: schemeLens(INCIDENT_TYPE).get(state) || {},
    incidentKinds: schemeLens(INCIDENT_KIND).get(state) || {},
    users: schemeLens(USER).get(state) || {},
}))(IncidentsRef)

export default defaultProps({forkDisabled: false})(ConnectedIncidentsRef)
