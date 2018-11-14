"use strict";
var __assign = (this && this.__assign) || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", {value: true});
var random_1 = require("@local/random");
var moment = require("moment");
var EntityScheme_1 = require("./schemes/EntityScheme");
var BizAction_1 = require("./BizAction");
var utils_1 = require("@local/utils");
var ramda_1 = require("ramda");
var index_1 = require("./index");
var selectors_1 = require("./sel");
// TS does recognize locale property as readonly
exports.defaultSeedConfig = {
    role: {
        amount: 150,
    },
    user: {
        amount: 2000,
    },
    userGroup: {
        amount: 12,
    },
    wellProject: {
        amount: 10,
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
        amount: 10,
    },
    wellLicenseArea: {
        amount: 10,
    },
    incidentKind: {
        amount: 100,
    },
    well: {
        amount: 25,
    },
    drillRig: {
        amount: 30,
    },
    rigWinchType: {
        amount: 30,
    },
};
exports.seedBiz = function (store, config) {
    if (config === void 0) {
        config = exports.defaultSeedConfig;
    }
    random_1.faker['locale'] = 'ru';
    var randomInt = function (max, min) {
        if (max === void 0) {
            max = 10;
        }
        if (min === void 0) {
            min = 1;
        }
        return Math.round(Math.random() * (max - min)) + min;
    };
    var seedCatalog = function (scheme) {
        return function (item) {
            if (item === void 0) {
                item = [];
            }
            ramda_1.map(function (value) {
                return store.dispatch(BizAction_1.actions.create(scheme, value));
            }, utils_1.arrify(item));
        };
    };
    var updateCatalog = function (scheme) {
        return function (item) {
            if (item === void 0) {
                item = [];
            }
            return ramda_1.map(function (value) {
                return store.dispatch(BizAction_1.actions.update(scheme, value[scheme.uniqueProperty], value));
            }, utils_1.arrify(item));
        };
    };
    var mapCatalog = function (scheme) {
        return function (mapper) {
            utils_1.toIndexedArray(EntityScheme_1.schemeLens(scheme).get(store.getState()))
                .forEach(function (i) {
                    return store.dispatch(BizAction_1.actions.update(scheme, i[scheme.uniqueProperty], mapper(i)));
                });
        };
    };
    var getIds = function (scheme) {
        var state = store.getState();
        return Object.keys(EntityScheme_1.schemeLens(scheme).get(state));
    };
    var randomElementIndex = ramda_1.compose(Math.floor, function (length) {
        return Math.random() * length;
    });
    var randomElement = function (array) {
        if (array === void 0) {
            array = [];
        }
        return array[randomElementIndex(array.length)];
    };
    var takeRandomElements = function (array) {
        return ramda_1.compose(ramda_1.uniq, ramda_1.times(function (t) {
            return array[randomElementIndex(array.length)];
        }));
    };
    var randomElements = function (array, count) {
        if (array === void 0) {
            array = [];
        }
        if (count === void 0) {
            count = randomElementIndex(array.length);
        }
        return takeRandomElements(array)(count);
    };
    var fakeItemLink = function (scheme) {
        return random_1.faker.random.arrayElement(Object.keys(EntityScheme_1.schemeLens(scheme).get(store.getState())));
    };
    var fakeListLink = function (store) {
        return function (scheme) {
            return function (max, min) {
                if (max === void 0) {
                    max = 4;
                }
                if (min === void 0) {
                    min = 1;
                }
                var elements = Object.keys(EntityScheme_1.schemeLens(scheme).get(store.getState()));
                var length = randomInt(max, min);
                while (elements.length > length)
                    elements.splice(randomInt(elements.length - 1), 1);
                return elements;
            };
        };
    };
    var fillWithProp = function (prop) {
        return function (generator) {
            return function (source) {
                if (source === void 0) {
                    source = [];
                }
                return source.map(function (s) {
                    return Object.assign({}, s, (_a = {}, _a[prop] = generator(), _a));
                    var _a;
                });
            };
        };
    };
    var seedRoles = function () {
        return seedCatalog(index_1.biz.ROLE)([{
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
        }]);
    };
    var seedAdmin = function () {
        return seedCatalog(index_1.biz.USER)({
            login: 'admin',
            organization: 'Tetra$oft',
            firstName: random_1.faker.name.firstName(),
            patrName: random_1.faker.name.firstName(),
            lastName: random_1.faker.name.lastName(),
            password: '111111',
            roleIds: fakeListLink(store)(index_1.biz.ROLE)(),
            userGroupId: fakeItemLink(index_1.biz.USER_GROUP),
            email: random_1.faker.internet.email(),
            phone: random_1.faker.phone.phoneNumber(),
            position: random_1.faker.name.jobTitle(),
            lastVisitTime: random_1.faker.date.recent(370).getTime(),
        });
    };
    var seedUserGroups = ramda_1.times(function (t) {
        seedCatalog(index_1.biz.USER_GROUP)({
            name: random_1.faker.company.catchPhraseNoun(),
        });
    });
    var userLoginFaker = random_1.uniqueFaker();
    var seedUsers = ramda_1.times(function (t) {
        seedCatalog(index_1.biz.USER)({
            login: random_1.faker.internet.userName(),
            organization: random_1.faker.company.bsNoun(),
            firstName: random_1.faker.name.firstName(),
            patrName: random_1.faker.name.firstName(),
            lastName: random_1.faker.name.lastName(),
            password: '111111',
            roleIds: fakeListLink(store)(index_1.biz.ROLE)(),
            userGroupId: fakeItemLink(index_1.biz.USER_GROUP),
            email: random_1.faker.internet.email(),
            phone: random_1.faker.phone.phoneNumber(),
            position: random_1.faker.name.jobTitle(),
        });
    });
    var fillUserGroups = ramda_1.compose(fillWithProp('creatorUserId')(function () {
        return randomElement(getIds(index_1.biz.USER));
    }));
    var seedUserGroupCreators = function () {
        var originalGroups = EntityScheme_1.schemeLens(index_1.biz.USER_GROUP).get(store.getState());
        var groups = fillUserGroups(utils_1.toIndexedArray(originalGroups));
        updateCatalog(index_1.biz.USER_GROUP)(groups);
    };
    var seedWells = ramda_1.times(function (t) {
        seedCatalog(index_1.biz.WELL)([{
            creatorUserId: randomElement(getIds(index_1.biz.USER)),
            basing: Math.round(Math.random()),
            wellProjectId: Math.random() > 0.4 ? fakeItemLink(index_1.biz.WELL_PROJECT) : undefined,
            wellLicenseAreaId: randomElement(getIds(index_1.biz.WELL_LICENSE_AREA)),
            wellStatusId: randomElement(getIds(index_1.biz.WELL_STATUS)),
            wellPurposeId: randomElement(getIds(index_1.biz.WELL_PURPOSE)),
            wellFieldId: randomElement(getIds(index_1.biz.WELL_FIELD)),
            wellPlaceId: randomElement(getIds(index_1.biz.WELL_PLACE)),
            number: String(Math.floor(Math.random() * 99 + 1)),
            startDate: moment().format(),
        }]);
    });
    var seedDrillRigs = ramda_1.times(function (t) {
        seedCatalog(index_1.biz.DRILL_RIG)([{
            name: random_1.faker.commerce.department(),
            creatorUserId: randomElement(getIds(index_1.biz.USER)),
            serialNumber: random_1.faker.random.uuid(),
            ownerId: randomElement(getIds(index_1.biz.DRILL_RIG_OWNER)),
            typeId: randomElement(getIds(index_1.biz.DRILL_RIG_TYPE)),
            capacity: random_1.faker.random.number().toString(),
            productionYear: moment(random_1.faker.date.past(5)).format('YYYY'),
            manufacturer: random_1.faker.company.companyName(),
        }]);
    });
    var seedReference = function (scheme) {
        return function (_a) {
            var amount = _a.amount;
            var refFaker = random_1.uniqueFaker();
            ramda_1.times(function (t) {
                return seedCatalog(scheme)([{
                    name: refFaker.commerce.department(),
                    creatorUserId: randomElement(getIds(index_1.biz.USER)),
                }]);
            })(amount);
        };
    };
    var incidentFaker = random_1.uniqueFaker();
    var seedIncidentKinds = ramda_1.times(function (t) {
        seedCatalog(index_1.biz.INCIDENT_KIND)({
            name: incidentFaker.commerce.productName(),
            creatorUserId: randomElement(getIds(index_1.biz.USER)),
            parentId: randomElement(getIds(index_1.biz.INCIDENT_TYPE)),
        });
    });
    var fillRoleAdditionalData = function (role) {
        return (__assign({}, role, {
            creatorUserId: fakeItemLink(index_1.biz.USER), comment: random_1.faker.lorem.words(5), rights: {
                users: 0,
                wells: 0,
                refs: 0,
                reports: 0,
                motors: 0,
            }, reportRights: {
                drill: 0,
                survey: 0,
            }
        }));
    };
    var updateUserGroups = function () {
        mapCatalog(index_1.biz.USER_GROUP)(function (userGroup) {
            var wellProjectIds = random_1.takeRandom(3, 0)(selectors_1.sel(index_1.biz.WELL_PROJECT).asMap()());
            var excludedWellsInProjects = ramda_1.map(function (proj) {
                return random_1.takeRandom(7, 0)(selectors_1.sel(index_1.WELL).asList()()
                    .filter(function (w) {
                        return w.wellProjectId === proj.wellProjectId;
                    })
                    .map(function (well) {
                        return well.wellId;
                    }));
            }, wellProjectIds);
            var wellIds = randomElements(getIds(index_1.biz.WELL));
            return (__assign({}, userGroup, {
                wellIds: wellIds, wellProjectIds: Object.keys(ramda_1.map(function (p) {
                    return p.wellProjectId;
                }, wellProjectIds)), excludedWellsInProjects: excludedWellsInProjects
            }));
        });
    };
    store.dispatch(index_1.biz.actions.setStateGUID(String(Math.random())));
    seedAdmin();
    seedRoles();
    seedUserGroups(config.userGroup.amount);
    seedUsers(config.user.amount);
    seedUserGroupCreators();
    seedReference(index_1.biz.WELL_PROJECT)(config.wellProject);
    seedReference(index_1.biz.WELL_PURPOSE)(config.wellPurpose);
    seedReference(index_1.biz.WELL_STATUS)(config.wellStatus);
    seedReference(index_1.biz.WELL_FIELD)(config.wellField);
    seedReference(index_1.biz.WELL_PLACE)(config.wellPlace);
    seedReference(index_1.biz.INCIDENT_TYPE)(config.incidentType);
    seedReference(index_1.biz.DRILL_RIG_OWNER)(config.drillRigOwner);
    seedReference(index_1.biz.DRILL_RIG_TYPE)(config.drillRigType);
    seedReference(index_1.biz.RIG_WINCH_TYPE)(config.rigWinchType);
    seedReference(index_1.biz.WELL_LICENSE_AREA)(config.wellLicenseArea);
    seedIncidentKinds(18);
    seedWells(config.well.amount);
    seedDrillRigs(10);
    mapCatalog(index_1.biz.ROLE)(fillRoleAdditionalData);
    updateUserGroups();
};
