export type UIStatisticsConfig = {
  initialized: boolean
  interval: number
  endpoint?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FusEvent<T = Record<string, any>> = {
  name: string
  groupId: string
  data?: T
  time?: number
}

export type FusEventsQueue = Array<FusEvent>
