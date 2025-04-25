import {requestJSON, requestText} from '../services/rest/request'

import addMarkdownAlert from './addMarkdownAlert'
import {resolveRelative as resolveRelativeURL} from './url'

const isSakuraUI = (): boolean => window.ReactUI.isSakuraUI

export * from './getDisplayName'
export * from './object'
export * from './queryParams'
export * from './random'
export * from './url'

export {requestJSON, requestText, addMarkdownAlert, resolveRelativeURL, isSakuraUI}
export default {
  requestJSON,
  requestText,
  addMarkdownAlert,
  resolveRelativeURL,
  isSakuraUI,
}
