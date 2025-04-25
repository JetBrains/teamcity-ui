import deprecate from 'util-deprecate'

import Components from './components'
import Plugin from './plugin'
import pluginRegistry from './plugin/registry'
import Services from './services'
import TabPlugin from './tab-plugin'
import utils from './utils'

/**
 * @deprecated TeamcityAPI.render is no longer supported
 */
const render = deprecate(() => {}, 'TeamcityAPI.render is no longer supported')

export {Components, Services, render, utils, pluginRegistry, Plugin, TabPlugin}
const TeamCityUI = {
  Components,
  Services,
  render,
  utils,
  pluginRegistry,
  Plugin,
  TabPlugin,
}
export default TeamCityUI
export type TeamCityAPIType = typeof TeamCityUI

export type * from './components/ContentPanel/ContentPanel.context'
export type * from './components/ContentPanel/ContentPanel'
export type * from './components/Markdown/Markdown'
export type * from './plugin/types'
export type * from './services'
export type * from './services/rest/request'
export type * from './types/legacy'

export * from './types/BS_types'
