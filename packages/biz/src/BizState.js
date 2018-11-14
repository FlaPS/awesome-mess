"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.defaultBizState = {
    meta: {},
    users: {},
    roles: {},
    userGroups: {},
    wellProject: {},
    wells: {},
    contractorType: {},
    incidentKind: {},
    incidentType: {},
    rigWinchType: {},
    wellField: {},
    wellLicenseArea: {},
    wellPurpose: {},
    wellPlace: {},
    wellStatus: {},
    drillRigOwner: {},
    drillRigType: {},
    drillRigs: {},
    jobTypes: {
        '0': {
            jobTypeId: '0',
            name: 'Бурение',
        },
        '1': {
            jobTypeId: '1',
            name: 'Крепление',
        },
    },
    reportType: {
        '0': {
            reportTypeId: '0',
            jobTypeId: '0',
            name: 'Буровой рапорт',
        },
        '1': {
            reportTypeId: '1',
            jobTypeId: '0',
            name: 'Рапорт по растворам',
        },
        '2': {
            reportTypeId: '2',
            jobTypeId: '1',
            name: 'Рапорт по расходным материалам',
        },
    },
    reportForm: {
        '0': {
            reportFormId: '0',
            reportTypeId: '0',
            name: 'Полная буровая форма',
        },
        '1': {
            reportFormId: '1',
            reportTypeId: '0',
            name: 'Форма ГГР',
        },
        '2': {
            reportFormId: '2',
            reportTypeId: '1',
            name: 'Только отечественные',
        },
        '3': {
            reportFormId: '3',
            reportTypeId: '1',
            name: 'Только импортные',
        },
        '4': {
            reportFormId: '4',
            reportTypeId: '2',
            name: 'Материалы крепления',
        },
    },
    rigs: {},
};
