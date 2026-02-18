import * as config from './config'
import * as network from './network'
import {initializeUnloadListeners} from './listeners'
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

  describe('sendFusData with fetch', () => {
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
  })

  describe('sendFusData with beacon', () => {
    it('clears the queue when beacon send succeeds', async () => {
      jest.spyOn(config, 'getFusConfig').mockReturnValue(getMockPluginConfig())
      jest.spyOn(network, 'sendDataBeacon').mockReturnValue(true)

      const queue = getEventsQueue()

      trackEvent(events[0])
      trackEvent(events[1])

      await sendFusData(true)

      expect(network.sendDataBeacon).toHaveBeenCalledTimes(1)
      expect(queue.length).toBe(0)
    })

    it('restores the events list when beacon send fails', async () => {
      jest.spyOn(config, 'getFusConfig').mockReturnValue(getMockPluginConfig())
      jest.spyOn(network, 'sendDataBeacon').mockReturnValue(false)

      const queue = getEventsQueue()

      trackEvent(events[0])
      trackEvent(events[1])

      await sendFusData(true)

      expect(network.sendDataBeacon).toHaveBeenCalledTimes(1)
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(queue.length).toBe(2)
    })

    it('uses beacon when useBeacon parameter is true', async () => {
      jest.spyOn(config, 'getFusConfig').mockReturnValue(getMockPluginConfig())
      jest.spyOn(network, 'sendDataBeacon').mockReturnValue(true)
      jest.spyOn(network, 'sendData').mockImplementation(() => Promise.resolve(new Response()))

      trackEvent(events[0])

      await sendFusData(true)

      expect(network.sendDataBeacon).toHaveBeenCalledTimes(1)
      expect(network.sendData).not.toHaveBeenCalled()
    })
  })

  describe('unload listeners', () => {
    beforeEach(() => {
      jest.spyOn(document, 'addEventListener')
      jest.spyOn(window, 'addEventListener')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('initializes event listeners for page unload', () => {
      initializeUnloadListeners()

      expect(document.addEventListener).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function),
      )
      expect(window.addEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function))
      expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    })

    it('sends data with beacon when visibilitychange fires with hidden state', async () => {
      jest.spyOn(config, 'getFusConfig').mockReturnValue(getMockPluginConfig())
      jest.spyOn(network, 'sendDataBeacon').mockReturnValue(true)

      trackEvent(events[0])

      initializeUnloadListeners()

      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        configurable: true,
        value: 'hidden',
      })

      const visibilityHandler = (document.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'visibilitychange',
      )?.[1]

      await visibilityHandler()

      expect(network.sendDataBeacon).toHaveBeenCalled()
    })
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
