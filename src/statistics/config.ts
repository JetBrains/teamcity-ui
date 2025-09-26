import type {UrlExtension} from '../types'

import type {UIStatisticsConfig} from './statistics.types'

const SECOND = 1000
const THROTTLE_SECONDS = 10

const config: UIStatisticsConfig = {
  interval: THROTTLE_SECONDS * SECOND,
  initialized: false,
}

export function initializeStatisticsPlugin(extension: UrlExtension<{interval: number}>) {
  if (!extension || config.initialized) {
    return config
  }

  config.interval = extension.options?.interval
  config.endpoint = extension.endpoint
  config.initialized = true

  return config
}

export const getFusConfig = () => config
