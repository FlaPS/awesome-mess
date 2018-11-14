const { lstatSync, readdirSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const { green, bold, red, yellow } = require('chalk')

const packageName = process.argv.slice(2).length > 0 ? process.argv[2] : null

if (packageName) {

    const lastDelimiterPosition = packageName.lastIndexOf('@')
    const name = packageName.slice(0, lastDelimiterPosition)
    const version = packageName.slice(lastDelimiterPosition + 1)

    const isDirectory = source =>
        lstatSync(source).isDirectory()

    const getDirectories = source =>
        readdirSync(source)
            .map(name => join(source, name))
            .filter(isDirectory)


    const updateVersion = packagePath => {
        try {

            const packageJsonPath = join(packagePath, 'package.json')
            const packageData = JSON.parse(readFileSync(packageJsonPath))

            const isPackageInDeps = packageData['dependencies'] && packageData['dependencies'][name]
            const isPackageInDevDeps = packageData['devDependencies'] && packageData['devDependencies'][name]

            if (isPackageInDeps)
                packageData['dependencies'][name] = version

            if (isPackageInDevDeps)
                packageData['devDependencies'][name] = version

            if (isPackageInDeps || isPackageInDevDeps) {
                writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2), 'utf8')
                console.info(`${green(packagePath)}: ${bold('ok')}`)
            } else
                console.info(`${yellow(packagePath)}: ${green(name)} not found`)
        } catch (e) {
            console.error(`${red(packagePath)}: ${bold('isn\'t ok')}`)
        }
    }

    getDirectories('packages')
        .forEach(updateVersion)
} else console.error(`no package to update provided`)