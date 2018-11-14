const { lstatSync, readdirSync } = require('fs')
const { join, resolve } = require('path')
const { sync: rimrafSync } = require('rimraf')
const { green, bold, red } = require('chalk')

const isDirectory = source =>
  lstatSync(source).isDirectory()

const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)

const deleteDist = packagePath => {
  const tsconfig = resolve(packagePath, 'tsconfig.json')

  try {
    const {compilerOptions: { outDir }} = require(tsconfig)
    const distDirectory = resolve(packagePath, outDir)

    rimrafSync(distDirectory)
    console.info(`${green(packagePath)}: ${bold('ok')}`)
  } catch (e) {
    console.error(`${red(packagePath)}: ${bold('isn\'t ok')}`)
  }
}

getDirectories('packages')
  .forEach(deleteDist)
