import * as React from 'react'
import {default as RefHeaderTemplate} from './RefHeaderTemplate'
import {default as RefGridTemplate} from './RefGridTemplate'
import {capitalize, toIndexedArray} from '@local/utils'
import {Scheme, UserVO} from '@local/biz'
import {Column} from '../../grids/grid/Grid'
import {restyle} from '../../styles/restyle'
import {omit} from 'ramda'
import {Div, Paper} from '../../layout'
import AddRefItemModal from '../addRefItemModal'

type RefTemplateProps = {
    data: Array<Scheme<any, any>>
    users: Array<UserVO>
    refScheme: Scheme<any, any>
    columns: Array<Column<any, any>>
    dispatch: (action: any) => any
    onSearchClick: () => any
    onShowLogClick: () => any
    onExportClick: () => any
    onAddClick: () => any
    frontState?: any
    fork: () => any
    commit: () => any
    reset: () => any
    history: Array<any>
}

const omitRefTemplateProps = omit(
    [
        'fork',
        'commit',
        'reset',
        'history',
        'dispatch',
        'refScheme',
        'frontState',
    ])

const RefPage = restyle`
    display: flex;
    flex-direction: column;
    align-items: center;
`(Div)

const RefBody = restyle`
    margin-top: 136px;
`(Div)

type RefTemplateState = {
    edit: boolean,
    actual: boolean,
    scrolled: boolean,
    filter: string,
    modalShown: boolean,
}

class RefTemplate extends React.Component<RefTemplateProps, RefTemplateState> {
    private getData = () =>
        toIndexedArray(this.props.data)
            .filter(ref => this.state.edit || !ref.removed === this.state.actual)
            .filter(ref => !this.state.filter || ref.name.toLowerCase().includes(this.state.filter.toLowerCase()))

    /* componentDidMount()  {
         window.addEventListener('scroll', this.HandleScroll)
     }

     componentWillUnmount() {
         window.removeEventListener('scroll', this.HandleScroll)
     }*/
    private showActive = () => this.setState({actual: true})
    private showAll = () => this.setState({actual: false})
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
        this.props.commit()
        this.setState(
            {
                edit: false,
                actual: !this.state.actual || this.refsActiveDataExists(), // Проверяем, был ли включен режим просмотра всех или выставляем в зависимости от существования активных
            })
    }
    private onAddClick = () => this.setState({modalShown: true})
    private hideModal = () => this.setState({modalShown: false})
    private refsDataExists = () => toIndexedArray(this.props.data).length > 0
    private refsActiveDataExists = () => toIndexedArray(this.props.data).filter(ref => !ref['removed']).length > 0
    private refsDeletedExists = () => toIndexedArray(this.props.data).filter(ref => ref['removed']).length > 0

    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            actual: this.refsActiveDataExists(),
            scrolled: false,
            filter: '',
            modalShown: false,
        }
    }

    render() {
        return (
            <RefPage {...omitRefTemplateProps(this.props)}>
                <RefHeaderTemplate
                    edit={this.state.edit}
                    actual={this.state.actual}
                    scrolled={this.state.scrolled}
                    emptyRef={!this.refsDataExists()}
                    label={capitalize(this.props.refScheme.lang.name)}
                    onShowActive={this.showActive}
                    onShowAll={this.showAll}
                    onSearch={this.onSearch}
                    onShowLogClick={this.props.onShowLogClick}
                    onExportClick={this.props.onExportClick}
                    onAddClick={this.onAddClick}
                    onEditClick={this.onEditClick}
                    onSaveClick={this.onSaveClick}
                    onCancelClick={this.onCancelClick}
                    saveAvailable={this.props.localHistory.length > 0}
                    activeAvailable={this.refsActiveDataExists()}
                    width={832}
                    scheme={this.props.refScheme}
                    allAvailable={this.refsDeletedExists()}
                />
                <RefBody>
                    <Paper>
                        <RefGridTemplate
                            data={this.getData()}
                            users={this.props.users}
                            refScheme={this.props.refScheme}
                            columns={this.props.columns}
                            dispatch={this.props.dispatch}
                            actual={this.state.actual}
                            width={832}
                            edit={this.state.edit}
                        />
                    </Paper>
                </RefBody>
                {this.state.modalShown &&
                <AddRefItemModal
                    label={`Добавить ${this.props.refScheme.lang.singular}`}
                    onAdd={this.hideModal}
                    onCancel={this.hideModal}
                    scheme={this.props.refScheme}
                    dispatch={this.props.dispatch}
                    frontState={this.props.frontState}
                />}
            </RefPage>
        )
    }

    /* private HandleScroll = () => {
         if (window.pageYOffset > 0 && !this.state.scrolled)
             this.setState({scrolled: true})

         if (window.pageYOffset === 0 && this.state.scrolled)
             this.setState({scrolled: false})
     }*/

}

export default RefTemplate
