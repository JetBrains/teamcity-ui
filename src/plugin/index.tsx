import type * as React from 'react'
import type {Root} from 'react-dom/client'
import {createRoot} from 'react-dom/client'

import {ContentPanelContext} from '../components/ContentPanel/ContentPanel.context'

import {defaultContext, PluginCallbacks} from './callbacks'
import pluginRegistry from './registry'
import type {
  PlaceIdList,
  PluginConstructorArguments,
  PluginContext,
  PluginInterface,
  PluginOptions,
} from './types'
import {PlaceId} from './types'
import {isValidPluginReactElementType} from './utils'

type EventHandler = {
  callback: () => unknown
  element: HTMLElement
  event: string
}

class Plugin extends PluginCallbacks implements PluginInterface {
  static placeIds: PlaceIdList = PlaceId
  debug = false
  name: string
  placeId: PlaceId
  // there's no better way to type a generic React component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: string | HTMLElement | React.ComponentType<any>
  options: PluginOptions
  container: HTMLElement | undefined = undefined
  reactRoot: Root | undefined = undefined
  eventHandlers: Array<EventHandler> = []
  constructor(placeId: PlaceId | Array<PlaceId>, plugin: PluginConstructorArguments) {
    super(plugin)
    this.placeId = this.pickPlaceId(placeId)
    this.name = plugin.name
    this.content = plugin.content
    this.options = plugin.options || {}

    if (!this.placeId) {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize Plugin. Please, check the Place ID name. ', placeId)
    }

    if (this.options.debug === true) {
      this.debug = true
    }

    try {
      pluginRegistry.add(this.placeId, this)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `Plugin ${this.name} / ${this.placeId}: ${error} If you would like to update the Plugin Content, please, use replaceContent method`,
      )
      return
    }

    this.create()
    this.createContainer()
    this.render()
  }

  isInternalReactPlugin() {
    return isValidPluginReactElementType(this.content) && this.options._internal
  }

  pickPlaceId(placeId: PlaceId | Array<PlaceId>): PlaceId {
    if (Array.isArray(placeId)) {
      return (
        placeId.find(item => {
          const isSakuraItem = /^SAKURA*/.test(item)
          return window.ReactUI.isSakuraUI ? isSakuraItem : !isSakuraItem
        }) || placeId[0]
      )
    } else {
      return placeId
    }
  }

  getPlaceIdContainer(placeId: PlaceId): HTMLElement | null | undefined {
    const place = document.querySelector<HTMLElement>(`#${placeId}`)

    if (!place) {
      // eslint-disable-next-line no-console
      console.warn(`Plugin ${this.name} / ${this.placeId}: Place ID ${placeId} doesn't exist.`)
      return null
    }

    return place
  }

  createContainer() {
    if (this.isInternalReactPlugin()) {
      return
    }

    this.container = document.createElement(
      this.options.containerTagName === 'string' ? this.options.containerTagName : 'div',
    )
    this.container.classList.add('pluginContainer')

    if (this.options.containerClassNames != null) {
      if (Array.isArray(this.options.containerClassNames)) {
        this.container.classList.add(this.options.containerClassNames.join(' '))
      }

      if (typeof this.options.containerClassNames === 'string') {
        this.container.classList.add(this.options.containerClassNames)
      }
    }

    if (isValidPluginReactElementType(this.content)) {
      this.reactRoot = createRoot(this.container)
    }
  }

  remove() {
    this.delete()

    if (this.container != null) {
      this.container.remove()
    }

    pluginRegistry.remove(this.placeId, this)
  }

  // there's no better way to type a generic React component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replaceContent(content: string | HTMLElement | React.ComponentType<any>) {
    this.content = content
    this.renderReactContent()
    this.insertContent()
  }

  renderReactContent() {
    if (
      isValidPluginReactElementType(this.content) &&
      !this.options._internal &&
      this.context !== defaultContext
    ) {
      const {location, contentPanel} = this.context
      this.reactRoot?.render(
        <ContentPanelContext.Provider value={contentPanel}>
          <this.content location={location} />
        </ContentPanelContext.Provider>,
      )
    }
  }

  insertContent() {
    if (!this.isInternalReactPlugin() && this.container != null) {
      if (this.container.hasChildNodes()) {
        this.container.innerHTML = ''
      }

      if (this.content instanceof HTMLElement) {
        this.container.appendChild(this.content)
      } else if (typeof this.content === 'string') {
        this.container.innerHTML = this.content
      }
    }

    this.updateContent()
  }

  registerEventHandler(element: HTMLElement, event: string, callback: () => unknown) {
    if (element instanceof HTMLElement) {
      if (this.debug) {
        // eslint-disable-next-line no-console
        console.debug(
          `Plugin debugging. ${this.name} / ${this.placeId}. Attach event listener`,
          element,
          event,
          callback,
        )
      }

      element.addEventListener(event, callback)
      this.eventHandlers.push({
        element,
        event,
        callback,
      })
    } else if (this.debug) {
      // eslint-disable-next-line no-console
      console.debug(
        `Plugin debugging. ${this.name} / ${this.placeId}. Could not register event handler. Wrong arguments.`,
      )
    }
  }

  removeEventHandlers() {
    this.eventHandlers.forEach(({element, event, callback}) => {
      if (this.debug) {
        // eslint-disable-next-line no-console
        console.debug(
          `Plugin debugging. ${this.name} / ${this.placeId}. Remove event listener`,
          element,
          event,
          callback,
        )
      }

      element.removeEventListener(event, callback)
    })
  }

  unmount() {
    this.removeEventHandlers()
    super.unmount()
  }

  updateContext(context: PluginContext) {
    super.updateContext(context)
    this.renderReactContent()
  }

  mount() {
    super.mount()
  }

  render() {
    this.insertContent()
  }
}

export {PlaceId}
export * from './utils'
export default Plugin
