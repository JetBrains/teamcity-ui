import type {ContentPanelContextValue} from '../components/ContentPanel/ContentPanel.context'

export enum PlaceId {
  SAKURA_AGENTS_TOOLBAR = 'SAKURA_AGENTS_TOOLBAR',
  SAKURA_AFTER_AGENT_INFO = 'SAKURA_AFTER_AGENT_INFO',
  SAKURA_AGENT_ACTIONS = 'SAKURA_AGENT_ACTIONS',
  SAKURA_HEADER_NAVIGATION_AFTER = 'SAKURA_HEADER_NAVIGATION_AFTER',
  SAKURA_HEADER_USERNAME_BEFORE = 'SAKURA_HEADER_USERNAME_BEFORE',
  SAKURA_HEADER_RIGHT = 'SAKURA_HEADER_RIGHT', // TODO remove
  SAKURA_FOOTER_RIGHT = 'SAKURA_FOOTER_RIGHT',
  SAKURA_BEFORE_CONTENT = 'SAKURA_BEFORE_CONTENT',
  SAKURA_SIDEBAR_TOP = 'SAKURA_SIDEBAR_TOP',
  SAKURA_PROJECT_LINKS = 'SAKURA_PROJECT_LINKS',
  SAKURA_PROJECT_TRENDS = 'SAKURA_PROJECT_TRENDS',
  SAKURA_PROJECT_BUILDS = 'SAKURA_PROJECT_BUILDS',
  SAKURA_BUILD_CONFIGURATION_TREND_CARD = 'SAKURA_BUILD_CONFIGURATION_TREND_CARD',
  SAKURA_BUILD_CONFIGURATION_BUILDS = 'SAKURA_BUILD_CONFIGURATION_BUILDS',
  SAKURA_BUILD_CONFIGURATION_BRANCHES = 'SAKURA_BUILD_CONFIGURATION_BRANCHES',
  SAKURA_BUILD_CONFIGURATION_CHANGE_LOG = 'SAKURA_BUILD_CONFIGURATION_CHANGE_LOG',
  SAKURA_BUILD_CHANGES = 'SAKURA_BUILD_CHANGES',
  SAKURA_BUILD_LINE_EXPANDED = 'SAKURA_BUILD_LINE_EXPANDED',
  SAKURA_BUILD_OVERVIEW = 'SAKURA_BUILD_OVERVIEW',
  SAKURA_CUSTOM_AGENTS_COUNTER = 'SAKURA_CUSTOM_AGENTS_COUNTER',
  SAKURA_QUEUE_ACTIONS = 'SAKURA_QUEUE_ACTIONS',
  SAKURA_TEST_DETAILS_ACTIONS = 'SAKURA_TEST_DETAILS_ACTIONS',
  SAKURA_GUIDES_OVERVIEW = 'SAKURA_GUIDES_OVERVIEW',
  SAKURA_TOOL_PANEL_FOOTER = 'SAKURA_TOOL_PANEL_FOOTER',
  SAKURA_DEBUG_PANEL = 'SAKURA_DEBUG_PANEL',
  SAKURA_AI_ASSISTANT_CHAT = 'SAKURA_AI_ASSISTANT_CHAT',
  SAKURA_AI_ASSISTANT_CHAT_BUTTON = 'SAKURA_AI_ASSISTANT_CHAT_BUTTON',
  SAKURA_AI_ASSISTANT_ANALYZER_BUTTON = 'SAKURA_AI_ASSISTANT_ANALYZER_BUTTON',

  HEADER_RIGHT = 'HEADER_RIGHT',
  BEFORE_CONTENT = 'BEFORE_CONTENT',
  PROJECT_FRAGMENT = 'PROJECT_FRAGMENT',
  PROJECT_STATS_FRAGMENT = 'PROJECT_STATS_FRAGMENT',
  BUILD_CONF_STATISTICS_FRAGMENT = 'BUILD_CONF_STATISTICS_FRAGMENT',
  BUILD_RESULTS_FRAGMENT = 'BUILD_RESULTS_FRAGMENT',
  BUILD_RESULTS_BUILD_PROBLEM = 'BUILD_RESULTS_BUILD_PROBLEM',
  TAB_PLUGIN_CONTAINER = 'TAB_PLUGIN_CONTAINER',
  AI_ASSISTANT_CHAT_BUTTON = 'AI_ASSISTANT_CHAT_BUTTON',

  PIPELINE_OVERVIEW = 'PIPELINE_OVERVIEW',
  PIPELINE_RESULTS_FRAGMENT = 'PIPELINE_RESULTS_FRAGMENT',
}

export type PlaceIdList = typeof PlaceId

export enum PluginLifecycle {
  ON_CREATE = 'ON_CREATE',
  ON_MOUNT = 'ON_MOUNT',
  ON_CONTENT_UPDATE = 'ON_CONTENT_UPDATE',
  ON_CONTEXT_UPDATE = 'ON_CONTEXT_UPDATE',
  ON_UNMOUNT = 'ON_UNMOUNT',
  ON_DELETE = 'ON_DELETE',
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

export type PluginCallback = (context: PluginContext) => unknown

export type PluginOptions = {
  containerTagName?: string
  containerClassNames?: string | Array<string>
  debug?: boolean
  _internal?: boolean
}

export type PluginConstructorArguments = {
  readonly name: string
  // there's no better way to type a generic React component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly content: string | HTMLElement | React.ComponentType<any>

  readonly options?: PluginOptions

  readonly onCreate?: () => unknown
  readonly onContentUpdate?: PluginCallback
  readonly onContextUpdate?: PluginCallback
  readonly onMount?: PluginCallback
  readonly onUnmount?: PluginCallback
  readonly onDelete?: PluginCallback
}

export type UnsubscribeFromLifecycle = () => void

interface PluginCommon {
  debug: boolean
  name: string
  placeId: PlaceId

  // there's no better way to type a generic React component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // there's no better way to type a generic React component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: string | HTMLElement | React.ComponentType<any>
  container: HTMLElement | void
  readonly mount: () => void
  readonly unmount: () => void
  readonly updateContext: (context: PluginContext) => void
  // there's no better way to type a generic React component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replaceContent(content: string | HTMLElement | React.ComponentType<any>): void
  registerEventHandler(element: HTMLElement, event: string, callback: () => unknown): void
}

export interface PluginRegistry {
  searchByPlaceId(
    placeId: PlaceId,
    pluginName?: string,
  ): (PluginInterface | null | undefined) | Array<PluginInterface>
  findUniquePlugin(placeId: PlaceId, pluginName: string): PluginInterface | null | undefined
  search(pluginName: string): Array<PluginInterface>
}
