declare module '@jetbrains/teamcity-ui' {
  import type {
    ButtonType,
    IconButtonType,
    SvgIconType,
    BuildNumberType,
    ContentPanelType,
    EntityPathType,
    RouterLinkType,
    RouterButtonType,
    ServiceMessageType,
  } from '@jetbrains/teamcity-ui/types/components'

  import type {
    RestServiceType,
    AlertServiceType,
    HintsServiceType,
  } from '@jetbrains/teamcity-ui/types/services'

  import type {
    RequestTextType,
    RequestJSONType,
  } from '@jetbrains/teamcity-ui/types/services/REST'

  import type {
    Alert,
    AlertKey,
    AlertType,
  } from '@jetbrains/teamcity-ui/types/services/AlertService'

  export type {
    ButtonProps,
    BuildNumberProps,
    ContentPanelParams,
    ContentPanelContextValue,
    ContentPanelProps,
    EntityPathProps,
    RouterLinkProps,
    RouterButtonProps,
    ServiceMessageProps,
  } from '@jetbrains/teamcity-ui/types/components'

  type RenderType = <P extends {} | null | undefined>(elementOrId: HTMLElement | string, Type: React.ComponentType<P>, props: P) => void

  type UtilsType = {
    requestText: RequestTextType
    requestJSON: RequestJSONType
    isSakuraUI: () => boolean
    resolveRelativeURL: (relativePath: string, params?: {}, hash?: string) => string
    addMarkdownAlert: (source: string, type?: AlertType, timeout?: number | null, options?: Partial<Alert>) => AlertKey
  }

  type ComponentsType = {
    readonly Button: ButtonType
    readonly IconButton: IconButtonType
    readonly SvgIcon: SvgIconType
    readonly BuildNumber: BuildNumberType
    readonly ContentPanel: ContentPanelType
    readonly EntityPath: EntityPathType
    readonly RouterLink: RouterLinkType
    readonly RouterButton: RouterButtonType
    readonly ServiceMessage: ServiceMessageType
  }

  type ServicesType = {
    readonly AlertService: AlertServiceType
    readonly HintsService: HintsServiceType
    readonly REST: RestServiceType
  }

  export type PlaceIdList = {
    // since 2020.2
    SAKURA_HEADER_NAVIGATION_AFTER: "SAKURA_HEADER_NAVIGATION_AFTER"
    SAKURA_HEADER_USERNAME_BEFORE: "SAKURA_HEADER_USERNAME_BEFORE"
    SAKURA_HEADER_RIGHT: "SAKURA_HEADER_RIGHT"
    SAKURA_FOOTER_RIGHT: "SAKURA_FOOTER_RIGHT"
    SAKURA_BEFORE_CONTENT: "SAKURA_BEFORE_CONTENT"
    SAKURA_SIDEBAR_TOP: "SAKURA_SIDEBAR_TOP"
    SAKURA_PROJECT_TRENDS: "SAKURA_PROJECT_TRENDS"
    SAKURA_BUILD_CONFIGURATION_TREND_CARD: "SAKURA_BUILD_CONFIGURATION_TREND_CARD"
    SAKURA_PROJECT_BUILDS: "SAKURA_PROJECT_BUILDS"
    SAKURA_BUILD_CONFIGURATION_BUILDS: "SAKURA_BUILD_CONFIGURATION_BUILDS"
    SAKURA_BUILD_CONFIGURATION_BRANCHES: "SAKURA_BUILD_CONFIGURATION_BRANCHES"
    SAKURA_BUILD_LINE_EXPANDED: "SAKURA_BUILD_LINE_EXPANDED"
    SAKURA_BUILD_OVERVIEW: 'SAKURA_BUILD_OVERVIEW'
    SAKURA_CUSTOM_AGENTS_COUNTER: 'SAKURA_CUSTOM_AGENTS_COUNTER'
    HEADER_RIGHT: "HEADER_RIGHT"
    BEFORE_CONTENT: "BEFORE_CONTENT"
    PROJECT_FRAGMENT: "PROJECT_FRAGMENT"
    PROJECT_STATS_FRAGMENT: "PROJECT_STATS_FRAGMENT"
    BUILD_CONF_STATISTICS_FRAGMENT: "BUILD_CONF_STATISTICS_FRAGMENT"
    BUILD_RESULTS_FRAGMENT: "BUILD_RESULTS_FRAGMENT"
    BUILD_RESULTS_BUILD_PROBLEM: "BUILD_RESULTS_BUILD_PROBLEM"

    // since 2021.1
    SAKURA_QUEUE_ACTIONS: 'SAKURA_QUEUE_ACTIONS'

    // since 2021.1.1
    SAKURA_TEST_DETAILS_ACTIONS: 'SAKURA_TEST_DETAILS_ACTIONS'

    // since 2021.2
    SAKURA_PROJECT_LINKS: "SAKURA_PROJECT_LINKS"
    SAKURA_GUIDES_OVERVIEW: 'SAKURA_GUIDES_OVERVIEW'
    SAKURA_AGENTS_TOOLBAR: 'SAKURA_AGENTS_TOOLBAR'

    // since 2023.03
    TAB_PLUGIN_CONTAINER: "TAB_PLUGIN_CONTAINER"

    // since 2023.05
    SAKURA_AFTER_AGENT_INFO: 'SAKURA_AFTER_AGENT_INFO'

    // since 2023.07
    SAKURA_AGENT_ACTIONS: 'SAKURA_AGENT_ACTIONS'

    // since 2023.11
    SAKURA_TOOL_PANEL_FOOTER: 'SAKURA_TOOL_PANEL_FOOTER'

    // since 2024.11
    SAKURA_BUILD_CONFIGURATION_CHANGE_LOG: "SAKURA_BUILD_CONFIGURATION_CHANGE_LOG"
    SAKURA_BUILD_CHANGES: "SAKURA_BUILD_CHANGES"

    // since 2025.03
    SAKURA_DEBUG_PANEL: 'SAKURA_DEBUG_PANEL'
  }

  export type PlaceId = keyof PlaceIdList
  export type UnsubscribeFromLifecycle = () => void
  export type PluginCallback = (context: PluginContext) => unknown

  export type PluginOptions = {
    containerTagName?: string
    containerClassNames?: string | Array<string>
    debug?: boolean
    _internal?: boolean
  }

  export type PluginConstructorArguments = {
    readonly name: string
    readonly content: string | HTMLElement | React.ComponentType<any>

    readonly options?: PluginOptions

    readonly onCreate?: () => unknown
    readonly onContentUpdate?: PluginCallback
    readonly onContextUpdate?: PluginCallback
    readonly onMount?: PluginCallback
    readonly onUnmount?: PluginCallback
    readonly onDelete?: PluginCallback
  }

  export type PluginContext = {
    location: {
      readonly projectId?: string | null | undefined
      readonly buildId?: string | null | undefined
      readonly buildTypeId?: string | null | undefined
      readonly agentId?: string | null | undefined
      readonly agentPoolId?: string | null | undefined
      readonly agentTypeId?: string | null | undefined
      readonly testRunId?: string | null | undefined
    }
    contentPanel: ContentPanelContextValue
  }

  interface PluginCommon {
    debug: boolean
    name: string
    placeId: PlaceId

    content: string | HTMLElement | React.ComponentType<any>
  }

  export interface PluginCallbacks extends PluginCommon {
    readonly onCreate: (callback: () => unknown) => () => void
    readonly onMount: (callback: PluginCallback) => UnsubscribeFromLifecycle
    readonly onContextUpdate: (callback: PluginCallback) => UnsubscribeFromLifecycle
    readonly onUnmount: (callback: PluginCallback) => UnsubscribeFromLifecycle
    readonly onDelete: (callback: PluginCallback) => UnsubscribeFromLifecycle
  }

  export interface PluginInterface extends PluginCallbacks {
    options: PluginOptions
    content: string | HTMLElement | React.ComponentType<any>
    container: HTMLElement | void
    readonly mount: () => void
    readonly unmount: () => void
    readonly updateContext: (context: PluginContext) => void
    replaceContent(content: string | HTMLElement | React.ComponentType<any>): void
    registerEventHandler(element: HTMLElement, event: string, callback: () => unknown): void
  }

  type PluginType = {
    new (placeId: PlaceId | Array<PlaceId>, args: PluginConstructorArguments): PluginInterface
    placeIds: PlaceIdList
  }

  type TabPluginType = {
    new (args: PluginConstructorArguments): PluginInterface
    placeIds: PlaceIdList
  }

  export interface PluginRegistry {
    searchByPlaceId(placeId: PlaceId, pluginName?: string): (PluginInterface | null | undefined) | Array<PluginInterface>
    findUniquePlugin(placeId: PlaceId, pluginName: string): PluginInterface | null | undefined
    search(pluginName: string): Array<PluginInterface>
  }

  export type TeamCityAPIType = {
    render: RenderType
    Components: ComponentsType
    Services: ServicesType
    utils: UtilsType
    Plugin: PluginType
    TabPlugin: TabPluginType
    pluginRegistry: PluginRegistry
  }

  export var render: RenderType
  export var utils: UtilsType
  export var pluginRegistry: PluginRegistry
  export var Services: ServicesType
  export var Components: ComponentsType
  export var Plugin: PluginType
  export var TabPlugin: TabPluginType
  import * as React from 'react'
  export {React}
  import * as ReactDOM from 'react-dom'
  export {ReactDOM}
  import * as ReactDOMClient from 'react-dom/client'
  export {ReactDOMClient}

  const TeamCityAPI: TeamCityAPIType
  export default TeamCityAPI
}

declare module '@jetbrains/teamcity-ui/plugin' {
  import {Plugin} from '@jetbrains/teamcity-ui'
  export default Plugin
}

declare module '@jetbrains/teamcity-ui/tab-plugin' {
  import {TabPlugin} from '@jetbrains/teamcity-ui'
  export default TabPlugin
}

declare module '@jetbrains/teamcity-ui/plugin-registry' {
  import {pluginRegistry} from '@jetbrains/teamcity-ui'
  export default pluginRegistry
}

declare module '@jetbrains/teamcity-ui/components' {
  import {Components} from '@jetbrains/teamcity-ui'
  import type {
    BuildNumberType,
    ContentPanelType,
    EntityPathType,
    RouterButtonType,
    RouterLinkType,
    ServiceMessageType,
  } from '@jetbrains/teamcity-ui/types/components'

  export const BuildNumber: BuildNumberType
  export const ContentPanel: ContentPanelType
  export const EntityPath: EntityPathType
  export const RouterButton: RouterButtonType
  export const RouterLink: RouterLinkType
  export const ServiceMessage: ServiceMessageType

  export {
    BuildNumberProps,
    ContentPanelProps,
    EntityPathProps,
    RouterButtonProps,
    RouterLinkProps,
    ServiceMessageProps,
  } from '@jetbrains/teamcity-ui/types/components'
  export default Components
}

declare module '@jetbrains/teamcity-ui/services' {
  import {Services} from '@jetbrains/teamcity-ui'
  import {
    RestServiceType,
    AlertServiceType,
    HintsServiceType,
  } from '@jetbrains/teamcity-ui/types/services'

  export const REST: RestServiceType
  export const AlertService: AlertServiceType
  export const HintsService: HintsServiceType

  export default Services
}

declare module '@jetbrains/teamcity-ui/utils' {
  import {utils} from '@jetbrains/teamcity-ui'
  export default utils
}

declare module '@jetbrains/teamcity-ui/react' {
  import * as module from 'react'
  export default module
}

declare module '@jetbrains/teamcity-ui/react-dom' {
  import * as module from 'react-dom'
  export default module
}

declare module '@jetbrains/teamcity-ui/react-dom/client' {
  import * as module from 'react-dom/client'
  export default module
}
