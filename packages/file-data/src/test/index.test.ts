import fileData, {fileDataRepository} from '../index'
import * as path from 'path'
import {cliArgv} from '@local/cli'
import * as fs from 'fs'

declare const test: any
declare const expect: any
declare const afterAll: any
declare const beforeAll: any
declare const jest: any

const testData = {
    testData: 'testData',
    moreData: 'anotherData',
}

const deleteDir = (pathToDir: string) => new Promise(resolve => {
    fs.rmdir(pathToDir, result => resolve())
})

const deleteTestData = (pathToDir: string) => new Promise(resolve => {
    fs.unlink(path.join(pathToDir, 'test.json'), result => resolve())
})

test('get basePath', () => {
    const mypath = fileData.getBasePath()
    expect(mypath).toBe(process.env.HOME || (process.env.HOMEDRIVE + process.env.HOMEPATH))
})

test('get appDataPath', () => {
    const appDataPath = fileData.getAppDataPath()
    const basePath = fileData.getBasePath()
    expect(appDataPath).toBe(path.join(basePath, 'renode', (cliArgv.data || 'data')))
})

test('test FileData repository', () => {
    const testRep = fileDataRepository(path.join('test', 'test.json'), testData, true)
    const data = testRep.getData()
    expect(data).toEqual(testData)
    /*const newData = {
        testData: 'testnewData',
    }
    testRep.saveData(newData)
    expect(testRep.getData()).toEqual(newData)*/
})

afterAll(async done => {
    const mypath = path.join(fileData.getBasePath(), 'renode', (cliArgv.data || 'data'), 'test')
    await deleteTestData(mypath)
    await deleteDir(mypath)
    done()
})
