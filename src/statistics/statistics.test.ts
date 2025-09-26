import * as config from './config'
import * as network from './network'
import {clearEventsQueue, getEventsQueue, sendFusData} from './scheduler'
import type {FusEvent} from './statistics.types'
import {trackEvent} from './tracking'

const getMockPluginConfig = (initialized = true) => ({
  initialized,
  endpoint: '/',
  interval: 100,
})

const events: ReadonlyArray<FusEvent> = [
  {
    name: 'page.open',
    groupId: 'page.events.group',
  },
  {
    name: 'page.close',
    groupId: 'page.events.group',
  },
]

describe('statistics', () => {
  beforeEach(() => {
    clearEventsQueue()
  })

  it('clears the queue once the send succeded', async () => {
    jest.spyOn(config, 'getFusConfig').mockReturnValue(getMockPluginConfig())
    jest.spyOn(config, 'initializeStatisticsPlugin').mockReturnValue(getMockPluginConfig())
    jest.spyOn(network, 'sendData').mockImplementation(() => Promise.resolve(new Response()))

    const queue = getEventsQueue()

    trackEvent(events[0])
    trackEvent(events[1])

    await sendFusData()

    expect(queue.length).toBe(0)
  })

  it('restores the events list if the send fails', async () => {
    jest.spyOn(config, 'getFusConfig').mockReturnValue(getMockPluginConfig())
    jest.spyOn(config, 'initializeStatisticsPlugin').mockReturnValue(getMockPluginConfig())
    jest.spyOn(network, 'sendData').mockImplementation(() => Promise.reject())

    const queue = getEventsQueue()

    trackEvent(events[0])
    trackEvent(events[1])

    await sendFusData()

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect(queue.length).toBe(2)
  })

  it('events in bulk requests enriched with `time` field ', () => {
    trackEvent(events[0])
    trackEvent(events[1])

    const queue = getEventsQueue()
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect(queue.length).toBe(2)
    expect(queue.every(i => i.time)).toBe(true)
  })
})
