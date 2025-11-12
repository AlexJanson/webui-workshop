const assert = require('node:assert')
const sinon = require('sinon')
const { ApplicationService } = require('../lib/ApplicationService.js')
const { afterEach, beforeEach, it } = require('node:test')

const VERSION = '1.0.0-rc1'
const DATE = new Date('2025-11-12T15:05:08.000Z')

let clock

describe('ApplicationService', () => {
    it('should initialize the service correctly', () => {
        const service = new ApplicationService(VERSION)

        assert.ok(service, 'Service instance should be defined')
        assert.ok(service instanceof ApplicationService, 'Service should be an instance of ApplicationService')
        assert.strictEqual(service.version, VERSION, 'Service version should be equal to the expected version')
    })

    describe('getDetails()', () => {
        beforeEach(() => {
            clock = sinon.useFakeTimers(DATE.getTime())
        })

        afterEach(() => {
            clock.restore()
        })

        it('should return the expected version and a correctly formatted date using the mocked time', () => {
            const service = new ApplicationService(VERSION)

            const expectedDateString = DATE.toLocaleDateString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZoneName: 'short'
            })

            const expectedJson = {
                'date': expectedDateString,
                'version': VERSION
            }

            const result = service.getDetails()

            assert.deepStrictEqual(result, expectedJson, 'The returned JSON structure must match the expected output')
            assert.strictEqual(result.date, expectedJson.date, 'Date string should match the expected formatted output')
            assert.strictEqual(result.version, expectedJson.version, 'Version should match the expected output')
        })
    })
})
