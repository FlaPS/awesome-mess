import * as fs from 'fs'
import fileData, {ensureDataDirectories} from '@local/file-data'
import * as path from 'path'
import {AssociativeArray} from '@local/utils'


const fileStreams: AssociativeArray<fs.WriteStream> = {}

const getFileStream = (fileName: string = 'default') => {
    if (!fileStreams[fileName]) {
        const logDirectory = path.join(fileData.getAppDataPath(), 'log')

        ensureDataDirectories(logDirectory)


        if (!fs.existsSync(logDirectory))
            fs.mkdirSync(logDirectory)

        const logFileName = path.join(logDirectory, fileName + '.log')

        if (!fs.existsSync(logFileName))
            fs.writeFileSync(logFileName, 'Start log', {flag: 'w', encoding: 'utf8'})

        fileStreams[fileName] = fs.createWriteStream(logFileName, {flags: 'a+', encoding: 'utf8'})
    }

    return fileStreams[fileName]
}

export const createFileTransport = (fileName: string = 'default') => {

    const getHumanTime = () => {
        const date = new Date()
        return date.getFullYear() + '/' +
            date.getMonth() + '/' +
            date.getDate() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds()
    }

    const fileTransport = {
        debug: (namespace: string, message: string) => {
            getFileStream(namespace).write('DEBUG @ ' + getHumanTime() + ' ' + message + '\r\n')
        },
        log: (namespace: string, message: string) => {
            getFileStream(namespace).write('LOG @ ' + getHumanTime() + ' ' + message + '\r\n')
        },
        info: (namespace: string, message: string) => {
            getFileStream(namespace).write('INFO @ ' + getHumanTime() + ' ' + message + '\r\n')
        },
        warn: (namespace: string, message: string) => {
            getFileStream(namespace).write('WARN @ ' + getHumanTime() + ' ' + message + '\r\n')
        },
        error: (namespace: string, message: string) => {
            getFileStream(namespace).write('ERROR @ ' + getHumanTime() + ' ' + message + '\r\n')
        },
    }

    return fileTransport
}
