/**
 * Unit tests for the action's entrypoint, src/index.js
 */

const { cmp } = require('../src/main')

// Mock the action's entrypoint
jest.mock('../src/main', () => ({
  cmp: jest.fn()
}))

describe('index', () => {
  it('calls cmp when imported', async () => {
    require('../src/index')

    expect(cmp).toHaveBeenCalled()
  })
})
