// These types are kept for easier migration from @jetbrains/teamcity-api. TODO remove in 2.0

import type {ButtonProps} from '@jetbrains/ring-ui/components/button/button'

import type {IconType, IconAttrs} from '@jetbrains/ring-ui/components/icon/icon'

type HintId = string
type HintImage = {
  readonly src: string
  readonly alt: string
}
type HintCategoryType = Readonly<{
  tabs: 'Tabs'
  buildLog: 'Build Log'
  sidebar: 'Sidebar'
  dependencyChain: 'Dependencies'
  header: 'Header'
  navigation: 'Navigation'
  miscellaneous: 'Miscellaneous'
  whatsNew: "What's new"
  projectOverview: 'Project'
  buildOverview: 'Build'
  agents: 'Agents'
  administration: 'Administration'
  guide: 'Guide'
}>
type HintCategory = HintCategoryType[keyof HintCategoryType]

export enum Directions {
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  TOP_CENTER = 'TOP_CENTER',
  RIGHT_TOP = 'RIGHT_TOP',
  RIGHT_BOTTOM = 'RIGHT_BOTTOM',
  RIGHT_CENTER = 'RIGHT_CENTER',
  LEFT_TOP = 'LEFT_TOP',
  LEFT_BOTTOM = 'LEFT_BOTTOM',
  LEFT_CENTER = 'LEFT_CENTER',
}

type HintType = {
  readonly id: HintId
  readonly name: string
  readonly text: string
  readonly category?: HintCategory
  readonly className?: string
  readonly directions?: ReadonlyArray<Directions>
  readonly offset?: number
  readonly viewed?: boolean
  readonly lessonId?: string
  readonly highlightTop?: boolean
  readonly helpLink?: string
  readonly selector?: string
  readonly image?: HintImage
}

export type HintsServiceType = {
  registerHint: (hint: HintType) => void
  unregisterHint: (id: string) => void
  categories: HintCategoryType
}

export type AlertKey = string

export enum AlertType {
  ERROR = 'error',
  MESSAGE = 'message',
  SUCCESS = 'success',
  WARNING = 'warning',
  LOADING = 'loading',
}

export type Alert = {
  key: string
  message: string
  timeout?: number
  onCloseRequest?: (event: React.MouseEvent<HTMLElement>) => void
  onClose?: () => void
  isShaking?: boolean
  isClosing?: boolean
  inline?: boolean
  showWithAnimation?: boolean
  closeable?: boolean
  type?: AlertType
  className?: string | null
  captionClassName?: string | null
  closeButtonClassName?: string | null
  'data-test'?: string | null
}

export type AlertServiceType = {
  defaultTimeout: number
  showingAlerts: Alert[]
  containerElement: HTMLElement
  // added for backward compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAlertContainer(alerts: readonly Alert[]): React.ReactElement<any>
  renderAlerts(): void
  findSameAlert(message: string, type: string): Alert
  startAlertClosing(alert: Alert): void
  remove(key: string): void
  removeWithoutAnimation(key: string): void
  stopShakingWhenAnimationDone(shakingAlert: Alert): void
  addAlert: (
    content: React.ReactNode,
    type?: AlertType,
    timeout?: number | null,
    restOptions?: Partial<Alert>,
  ) => AlertKey
  setDefaultTimeout(timeout: number): void
  error(message: string, timeout?: number): string
  message(message: string, timeout?: number): string
  warning(message: string, timeout?: number): string
  successMessage(message: string, timeout?: number): string
  loadingMessage(message: string, timeout?: number): string
}

export type BuildNumberProps = {
  buildId: number | null | undefined
  className?: number
  number?: string
  withLink?: boolean
  hideStar?: boolean
}

export type BuildNumberType = React.ComponentType<BuildNumberProps>

export type {ButtonProps}
export type ButtonType = React.ComponentType<ButtonProps>
export type IconButtonType = React.ComponentType<ButtonProps>

export type EntityPathProps = {
  readonly className?: string
  readonly linkClassName?: string
  readonly withCollapsing?: boolean
  readonly withIcons?: boolean
  readonly withLeafIcon?: boolean
  readonly withLeafStatusIcon?: boolean
  readonly buildId?: string
  readonly hideFilterPath?: boolean
  readonly hideIfSameAsFilter?: boolean
  readonly projectId?: string
  readonly buildTypeId?: string
}

export type EntityPathType = React.ComponentType<EntityPathProps>

export type RouterButtonProps = {
  readonly to: string
  readonly className?: string
  readonly children?: React.ReactNode
}

export type RouterButtonType = React.ComponentType<RouterButtonProps>

export type RouterLinkProps = RouterButtonProps & {
  readonly title?: string
  readonly innerClassName?: string
  readonly innerRef?: React.Ref<HTMLAnchorElement>
}

export type RouterLinkType = React.ComponentType<RouterLinkProps>

type Icon = React.ComponentType<React.JSX.IntrinsicElements['svg']>

export type ServiceMessageProps = {
  readonly icon?: Icon | string
  readonly description?: string
  readonly children?: React.ReactNode
  readonly controls?: React.ReactNode
  readonly titleClassName?: string
  readonly containerClassName?: string
  readonly closeButtonClassName?: string
  readonly captionClassName?: string
  readonly descriptionClassName?: string
  readonly iconClassName?: string
  readonly title?: string
  readonly closeable?: boolean
  readonly onClose?: () => void
  readonly onCloseRequest?: () => void
  readonly type?: AlertType
}

export type ServiceMessageType = React.ComponentType<ServiceMessageProps>
export type SvgIconType = React.ComponentType<
  IconAttrs & {
    icon: IconType | string
  }
>
