import '@jetbrains/ring-ui-built/components/style.css'
import AlertService from '@jetbrains/ring-ui-built/components/alert-service/alert-service.js'
import deprecate from 'util-deprecate'

import type {HintsServiceType} from '../types/legacy'

import {requestJSON, requestText} from './rest/request'

const hintsServiceDeprecationString = 'TeamcityAPI.Services.HintsService is no longer supported'
const categoriesDeprecation = deprecate(
  () => ({}) as HintsServiceType['categories'],
  hintsServiceDeprecationString,
)
/**
 * @deprecated TeamcityAPI.Services.HintsService is no longer supported
 */
const HintsService = {
  registerHint: deprecate(() => {}, hintsServiceDeprecationString),
  unregisterHint: deprecate(() => {}, hintsServiceDeprecationString),
  get categories() {
    return categoriesDeprecation()
  },
}
const REST = {requestJSON, requestText}
export type RestServiceType = typeof REST

export * from './rest/request'
export * from './rest/processResponse'
export * from './rest/errors/HTTPError'

export {
  REST,

  // TODO remove in 2.0
  AlertService,
  HintsService,
}
export default {
  REST,

  // TODO remove in 2.0
  AlertService,
  HintsService,
}
