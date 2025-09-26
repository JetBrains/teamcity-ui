import {addActionsToQueue} from './scheduler'
import type {FusEvent} from './statistics.types'

const trackEvents = (fusActions: ReadonlyArray<FusEvent>) => {
  if (fusActions.length === 0) {
    return
  }

  addActionsToQueue(fusActions.map(action => ({...action, time: Date.now()})))
}

export const trackEvent = (fusAction: FusEvent) => {
  trackEvents([fusAction])
}
