import memoize from 'memoize-one'

import type {UrlExtension} from '../types'

import type {FusEvent} from './statistics.types'

const loadStatisticsChunk = memoize(
  () =>
    import(
      /* webpackChunkName: "Statistics", webpackPrefetch: true */
      './statistics'
    ),
)

export const initializeStatistics = (extension: UrlExtension<{interval: number}>) => {
  loadStatisticsChunk().then(
    ({initializeStatisticsPlugin, scheduleEventsSending, initializeUnloadListeners}) => {
      const config = initializeStatisticsPlugin(extension)

      if (config.initialized) {
        initializeUnloadListeners()
        scheduleEventsSending()
      }
    },
  )
}

export const trackEvent = (fusAction: FusEvent) => {
  loadStatisticsChunk().then(({trackEvent: track}) => track(fusAction))
}
