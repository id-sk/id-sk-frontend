'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const fm = require('front-matter')

const configPaths = require('../config/paths.json')

const childDirectories = dir => {
  return fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isDirectory())
}

const idskChildDirectories = dir => {
  return fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(configPaths.idsk_components, file)).isDirectory())
}

// Generate component list from source directory, excluding anything that's not
// a directory (for example, .DS_Store files)
exports.allComponents = childDirectories(configPaths.components).filter(function (directory) {
  return directory !== 'idsk' && directory !== 'custom'
})
exports.allIdskComponents = idskChildDirectories(configPaths.idsk_components)

// Read the contents of a file from a given path
const readFileContents = filePath => {
  return fs.readFileSync(filePath, 'utf8')
}

exports.readFileContents = readFileContents

const getComponentData = componentName => {
  try {
    const yamlPath = path.join(configPaths.components, componentName, `${componentName}.yaml`)
    return yaml.safeLoad(
      fs.readFileSync(yamlPath, 'utf8'), { json: true }
    )
  } catch (error) {
    return new Error(error)
  }
}

const getIdskComponentData = componentName => {
  try {
    const yamlPath = path.join(configPaths.idsk_components, componentName, `${componentName}.yaml`)
    return yaml.safeLoad(
      fs.readFileSync(yamlPath, 'utf8'), { json: true }
    )
  } catch (error) {
    return new Error(error)
  }
}

exports.getComponentData = getComponentData
exports.getIdskComponentData = getIdskComponentData

exports.fullPageExamples = () => {
  return childDirectories(path.resolve(configPaths.fullPageExamples))
    .map(folderName => ({
      name: folderName,
      path: folderName,
      ...fm(readFileContents(path.join(configPaths.fullPageExamples, folderName, 'index.njk'))).attributes
    }))
    .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
}
