import configurable, {getConfigRepository} from '../index'
import * as fs from 'fs'
import * as path from 'path'

declare const test: any
declare const expect: any
declare const afterAll: any

const defaultTestConfig = {
    test: 'test1',
    test1: 'test2',
}

const secondConfig = {
    updatedCfg: 'test',
}

const expectedCfg = {
    test: 'test1',
    test1: 'test2',
    updatedCfg: 'test',
}

let savedCfg = {}

const testConfigurable = cfg => {
    savedCfg = cfg
}

const writeSecondConfig = () => new Promise(resolve => {
    const filePath = path.join(process.env.HOME, 'renode/slave1', 'config/test.json')
    fs.writeFile(filePath, JSON.stringify(secondConfig), result => resolve())
})

test('get test config repository', () => {
    const test = getConfigRepository('test', defaultTestConfig)
    expect(test['relativePath']).toBe('config/test.json')
    expect(test['defaultData']).toEqual(defaultTestConfig)
})

//
test('change config in file and see result ', async () => {
    expect(savedCfg).toEqual({})

    const test = configurable('test')(testConfigurable)(defaultTestConfig)
    expect(savedCfg).toEqual(defaultTestConfig)
    await writeSecondConfig()
    expect(savedCfg).toEqual(expectedCfg)
})

afterAll(done => {
    fs.unlink(path.join(process.env.HOME, 'renode/slave1', 'config/test.json'), deleted => done())
})
