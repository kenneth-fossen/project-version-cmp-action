const { XMLParser } = require('fast-xml-parser')
const fs = require('node:fs/promises')
const path = require('node:path')
const core = require('@actions/core')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function cmp() {
  try {
    const projectsInput = core.getInput('projects', { required: true })
    const projects = parseProjectFilePaths(projectsInput)

    core.debug(`Found ${projects.length} projects ...`)
    const versions = []
    for (const project of projects) {
      core.debug(`Project: ${project}`)
      const file = await getProjectFileContent(project)

      const xmlObject = deserializeToXmlObject(file)

      const version = xmlObject.Project?.PropertyGroup?.Version
      if (version === undefined || version === null) {
        core.warning('Unable to find <Version> tag, skipping')
      } else {
        core.debug(`Version: ${version}`)
        versions.push(version)
      }
    }

    const result = versions.every(v => v === versions[0])

    if (!result) {
      core.setFailed('All versions should be equal')
    }

    core.setOutput('equal', result)
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function getProjectFileContent(project) {
  const p = path.resolve(project)
  try {
    return await fs.readFile(p, { encoding: 'utf8' })
  } catch (err) {
    throw new Error(`IO: no such file or directory ${project}`)
  }
}

function deserializeToXmlObject(file) {
  const xmlParser = new XMLParser()
  return xmlParser.parse(file)
}

function parseProjectFilePaths(input) {
  const projects = []
  for (const line of input.split(/\r|\n/)) {
    projects.push(line)
  }
  return projects
}

module.exports = {
  cmp
}
