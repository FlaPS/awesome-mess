import {faker, generateGuid, takeRandom, uniqueFaker,} from '@local/random'
import * as moment from 'moment'
import {Store} from 'redux'
import {Scheme} from './core/Scheme'
import {actions} from './BizActionCreators'
import {RoleVO} from './general/Role'
import {GroupVO} from './general/Group'
import {JOB} from './rig/Job'
import {arrify, AssociativeArray, toIndexedArray} from '@local/utils'
import {compose, keys, map, times, uniq} from 'ramda'
import {BizState} from './BizState'
import {biz, getSchemeByName, WELL} from './index'
import {schemeLens, sel} from './sel'
import {ValueMeta} from './core/valueTypes'
import {APPLICATION} from './data/Application'
import {SIGNATORIES} from './data/Signatories'
import {REPORT} from './rig/Report'


type SchemeSeed = {
    amount: number
}

export const defaultSeedConfig = {
    role: {
        amount: 3,
    },
    user: {
        amount: 25,
    },
    userGroup: {
        amount: 4,
    },
    wellProject: {
        amount: 5,
    },
    wellPurpose: {
        amount: 10,
    },
    wellStatus: {
        amount: 10,
    },
    wellField: {
        amount: 10,
    },
    wellPlace: {
        amount: 10,
    },
    incidentType: {
        amount: 10,
    },
    drillRigOwner: {
        amount: 10,
    },
    drillRigType: {
        amount: 3,
    },
    wellLicenseArea: {
        amount: 10,
    },
    incidentKind: {
        amount: 10,
    },
    well: {
        amount: 12,
    },
    drillRig: {
        amount: 30,
    },
    rigWinchType: {
        amount: 30,
    },
    jobs: {
        amount: 10,
    },
    applications: {
        amount: 20,
    },
    signatories: {
        amount: 20,
    },
    report: {
        amount: 20,
    },
}

const getRandomDate = () =>
    faker.date.past().toISOString().slice(0, 10) + 'T00:00:00.000Z'

const randomizeProperty = <V>(prop: ValueMeta<V>, obj: any = {}): V => {
    if (prop.type === 'itemOf') {
        const scheme = getSchemeByName(prop.schemeName)
        let result

        if (scheme.isCabinet && obj.rigId !== undefined)
            result = scheme.randomKey({rigId: obj.rigId})()
        else
            result = scheme.randomKey()()

        return result as any as V
    }
    switch (prop.type) {
        case 'string':
            return faker.lorem.words(Math.floor(Math.random() * 5)) as any as V
        case 'date':
            return getRandomDate() as any as V
        case 'datetime':
            return faker.date.past().toISOString() as any as V
    }
    return undefined as any as V
}

const randomizeProps = <T>(props: AssociativeArray<ValueMeta>, obj = {} as any as T): T => {

    keys(props).map(k => {
        if (obj[k] === undefined)
            obj[k] = randomizeProperty(props[k], obj)
    })

    return obj
}

export type SeedConfig = typeof defaultSeedConfig

export const seedBiz = (store: Store<{ biz: BizState }>, config: typeof defaultSeedConfig = defaultSeedConfig) => {

    // TS does recognize locale property as readonly
    (faker as any)['locale'] = 'ru'


    const randomInt = (max: number = 10, min: number = 1) =>
        Math.round(Math.random() * (max - min)) + min

    const seedCatalog = <T>(scheme: Scheme<T>) => (item: Partial<T> | Partial<T>[] = []) => {
        map(value =>
                store.dispatch(
                    actions.create(scheme, value)
                )
            ,
            arrify(item)
        )
    }

    const updateCatalog = <T>(scheme: Scheme<T>) => (item: Partial<T> | Array<Partial<T>> = []) =>
        map(value =>
                store.dispatch(
                    actions.update(scheme, value[scheme.uniqueProperty] as any as string, value)
                )
            ,
            arrify(item)
        )

    /**
     * Runs over catalog and updates each item
     */
    type CatalogMapper<T> = (item: Partial<T>) => Partial<T>

    const mapCatalog = <T>(scheme: Scheme<T>) => (mapper: CatalogMapper<T>) => {
        toIndexedArray(schemeLens(scheme).get(store.getState()))
            .forEach((i: T) =>
                store.dispatch(actions.update(scheme, i[scheme.uniqueProperty] as any as string, mapper(i)))
            )
    }

    const getIds = <T>(scheme: Scheme<T>) =>
        scheme.asKeys()()

    const randomElementIndex = compose(
        Math.floor,
        (length: number) => Math.random() * length
    )

    const randomElement =
        <T>(array: T[] = []): T =>
            array[randomElementIndex(array.length)]

    const takeRandomElements = <T>(array: T[]) => compose(
        uniq,
        times(t => array[randomElementIndex(array.length)])
    )

    const randomElements =
        <T>(array: T[] = [], count: number = randomElementIndex(array.length)): T[] =>
            takeRandomElements(array)(count) as any as T[]

    const fakeItemLink = <T>(scheme: Scheme<T>) =>
        faker.random.arrayElement(Object.keys(schemeLens(scheme).get(store.getState())))

    const fakeListLink = (store: Store<any>) =>
        <T>(scheme: Scheme<T>) => (max: number = 4, min: number = 1) => {
            const elements = Object.keys(schemeLens(scheme).get(store.getState()))
            const length = randomInt(max, min)
            while (elements.length > length)
                elements.splice(randomInt(elements.length - 1), 1)

            return elements
        }

    const fillWithProp = <T, K extends string = keyof Partial<T>>(prop: K) =>
        (generator: () => any) =>
            (source: Partial<T>[] = []) =>
                source.map(s => Object.assign({}, s, {[prop]: generator()}))

    const seedRoles = () =>
        seedCatalog(biz.ROLE)(
            [{
                color: '#673AB7',
                name: 'Администратор',
            }, {
                color: '#FF9800',
                name: 'Буровой мастер',
            }, {
                color: '#F44336',
                name: 'Менеджер проектов',
            }, {
                color: '#F44336',
                name: 'Программист',
            }, {
                color: '#FF9800',
                name: 'Специалист',
            }, {
                color: '#673AB7',
                name: 'Senior integrator',
            }]
        )


    const seedAdmin = () =>
        seedCatalog(biz.USER)(
            // @ts-ignore
            {
                login: 'admin',
                organization: '$oft',
                firstName: faker.name.firstName(),
                patrName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: '111111',
                roleIds: fakeListLink(store)(biz.ROLE)(),
                groupId: fakeItemLink(biz.GROUP),
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
                position: faker.name.jobTitle(),
                lastVisitTime: faker.date.recent(370).getTime(),
            }
        )
    const seedGroups = times(t => {
        seedCatalog(biz.GROUP)({
            name: faker.company.catchPhraseNoun(),
        })
    })

    const userLoginFaker = uniqueFaker()

    const seedUsers = times(t => {
        seedCatalog(biz.USER)(
            {
                login: faker.internet.userName(),
                organization: faker.company.bsNoun(),
                firstName: faker.name.firstName(),
                patrName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: '111111',
                roleIds: fakeListLink(store)(biz.ROLE)(),
                groupId: fakeItemLink(biz.GROUP),
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
                position: faker.name.jobTitle(),
            }
        )
    })

    const fillGroups = compose(
        fillWithProp<GroupVO>
        ('creatorUserId')
        (() => randomElement(getIds(biz.USER)))
    )

    const seedGroupCreators = () => {
        const originalGroups = schemeLens(biz.GROUP).get(store.getState())
        const groups = fillGroups(toIndexedArray(originalGroups))

        updateCatalog(biz.GROUP)(groups)
    }

    const seedWells = times(t => {
        seedCatalog(biz.WELL)([{
            creatorUserId: randomElement(getIds(biz.USER)),
            basing: Math.round(Math.random()),
            projectId: Math.random() > 0.4 ? fakeItemLink(biz.PROJECT) : undefined,
            wellLicenseAreaId: randomElement(biz.WELL_LICENSE_AREA.asKeys()()),
            wellStatusId: randomElement(biz.WELL_STATUS.asKeys()()),
            wellPurposeId: randomElement(biz.WELL_PURPOSE.asKeys()()),
            wellFieldId: randomElement(biz.WELL_FIELD.asKeys()()),
            wellPlaceId: randomElement(biz.WELL_PLACE.asKeys()()),
            number: String(Math.floor(Math.random() * 99 + 1)),
            startDate: moment().format(),
        }])
    })

    const seedDrillRigs = times(t => {
        seedCatalog(biz.DRILL_RIG)([{
            name: faker.commerce.department(),
            creatorUserId: randomElement(biz.USER.asKeys()()),
            serialNumber: faker.random.uuid(),
            ownerId: randomElement(biz.DRILL_RIG_OWNER.asKeys()()),
            typeId: randomElement(biz.DRILL_RIG_TYPE.asKeys()()),
            capacity: faker.random.number(),
            productionYear: moment(faker.date.past(5)).format('YYYY'),
            manufacturer: faker.company.companyName(),
        }])
    })

    const seedReference = <T extends Readonly<{ name?: string, creatorUserId?: string }>, S>
    (scheme: Scheme<T, S>) => ({amount}) => {
        const refFaker = uniqueFaker()
        times(t =>
            seedCatalog(scheme)([{
                name: refFaker.commerce.department(),
                creatorUserId: randomElement(getIds(biz.USER)),
            } as T])
        )(amount)
    }

    const incidentFaker = uniqueFaker()
    const seedIncidentKinds = times(t => {

        seedCatalog(biz.INCIDENT_KIND)({
            name: incidentFaker.commerce.productName(),
            creatorUserId: randomElement(biz.USER.asKeys()()),
            incidentTypeId: randomElement(biz.INCIDENT_TYPE.asKeys()()),
        })
    })

    const fillRoleAdditionalData = (role: RoleVO): RoleVO => ({
        ...role,
        creatorUserId: fakeItemLink(biz.USER),
        comment: faker.lorem.words(5),
        rights: {
            users: 0,
            wells: 0,
            refs: 0,
            reports: 0,
            motors: 0,
        },
        reportRights: {
            drill: 0,
            survey: 0,
        },
    })

    const updateGroups = () => {
        mapCatalog(biz.GROUP)(userGroup => {
            const projectIds = takeRandom(3, 0)(biz.PROJECT.asKeys()()) as any as string[]

            const excludedWellsInProjects = projectIds.map(id =>
                takeRandom(7, 0)(
                    sel(WELL).asList()()
                        .filter(w => w.projectId === id)
                        .map(well => well.wellId)
                )
            )

            const wellIds = randomElements(getIds(biz.WELL))

            return ({
                ...userGroup,
                wellIds,
                projectIds,
                excludedWellsInProjects,
            })
        })
    }

    const createRandomItem = <T, Spec>(scheme: Scheme<T, Spec>) => (i?: number) => {
        let item = {} as any
        if (scheme.isCabinet) {
            item.rigId = WELL.randomKey()()
            const subBuilder = scheme.keyBuilder.keys[1]

            let key = ''
            if (subBuilder.type === 'guid')
                key = generateGuid()

            else if (subBuilder.type === 'date')
                key = getRandomDate()
            item[subBuilder.path] = key
        }
        item = randomizeProps(scheme.properties, item)


        const action = actions.create(scheme, item, item as any as Spec)


        store.dispatch(action)
    }

    const seedNestedScheme = <T>(scheme: Scheme<T>, seed: SchemeSeed) =>
        times(createRandomItem(scheme))(seed.amount)


    store.dispatch(biz.actions.setStateGUID(String(Math.random())))
    seedAdmin()
    seedRoles()
    seedGroups(config.userGroup.amount)
    seedUsers(config.user.amount)
    seedGroupCreators()
    seedReference(biz.PROJECT)(config.wellProject)
    seedReference(biz.WELL_PURPOSE)(config.wellPurpose)
    seedReference(biz.WELL_STATUS)(config.wellStatus)
    seedReference(biz.WELL_FIELD)(config.wellField)
    seedReference(biz.WELL_PLACE)(config.wellPlace)
    seedReference(biz.INCIDENT_TYPE)(config.incidentType)
    seedReference(biz.DRILL_RIG_OWNER)(config.drillRigOwner)
    seedReference(biz.DRILL_RIG_TYPE)(config.drillRigType)
    seedReference(biz.RIG_WINCH_TYPE)(config.rigWinchType)
    seedReference(biz.WELL_LICENSE_AREA)(config.wellLicenseArea)
    seedIncidentKinds(18)
    seedWells(config.well.amount)
    seedDrillRigs(10)
    mapCatalog(biz.ROLE)(fillRoleAdditionalData)
    updateGroups()

    seedNestedScheme(JOB, config.jobs)
    seedNestedScheme(APPLICATION, config.applications)
    seedNestedScheme(SIGNATORIES, config.signatories)
    seedNestedScheme(REPORT, config.report)
}
