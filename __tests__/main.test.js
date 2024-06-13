/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const main = require('../src/main')
const { setOutput } = require('@actions/core')

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
const warningMock = jest.spyOn(core, 'warning').mockImplementation()

// Mock the action's main function
const cmpMock = jest.spyOn(main, 'cmp')

// Other utilities
// const timeRegex = /^\d{2}:\d{2}:\d{2}/

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the project list', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'projects':
          return 'testdata/Client.csproj\ntestdata/Schema.csproj'
        default:
          return ''
      }
    })

    await main.cmp()
    expect(cmpMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Found 2 projects ...')
  })

  it('comapres two projects with equal versions', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'projects':
          return 'testdata/Client.csproj\ntestdata/Schema.csproj'
        default:
          return ''
      }
    })

    await main.cmp()
    expect(cmpMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Found 2 projects ...')

    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'Project: testdata/Client.csproj'
    )
    expect(debugMock).toHaveBeenNthCalledWith(3, 'Version: 1.2.4')
    expect(debugMock).toHaveBeenNthCalledWith(
      4,
      'Project: testdata/Schema.csproj'
    )
    expect(debugMock).toHaveBeenNthCalledWith(5, 'Version: 1.2.4')

    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'equal', true)
  })

  it('compares two projects with unequal versions', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'projects':
          return 'testdata/Client.csproj\ntestdata/Entities.csproj'
        default:
          return ''
      }
    })

    await main.cmp()
    expect(cmpMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Found 2 projects ...')

    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'Project: testdata/Client.csproj'
    )
    expect(debugMock).toHaveBeenNthCalledWith(3, 'Version: 1.2.4')
    expect(debugMock).toHaveBeenNthCalledWith(
      4,
      'Project: testdata/Entities.csproj'
    )
    expect(debugMock).toHaveBeenNthCalledWith(5, 'Version: 1.2.3')
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'All versions should be equal'
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'equal', false)
  })

  it('skips a project when no version', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'projects':
          return 'testdata/NoVersion.csproj'
        default:
          return ''
      }
    })

    await main.cmp()
    expect(cmpMock).toHaveReturned()

    expect(warningMock).toHaveBeenNthCalledWith(
      1,
      `Didn't find <Version>, skipping`
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'equal', true)
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'projects':
          return 'this is not a number'
        default:
          return ''
      }
    })

    await main.cmp()
    expect(cmpMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'IO: no such file or directory this is not a number'
    )
  })

  it('fails if no input is provided', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'projects':
          throw new Error('Input required and not supplied: projects')
        default:
          return ''
      }
    })

    await main.cmp()
    expect(cmpMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Input required and not supplied: projects'
    )
  })
})
