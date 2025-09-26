import {baseUri} from '../types/BS_types'

import {getFusConfig} from './config'
import {sendData} from './network'
import type {FusEvent, FusEventsQueue} from './statistics.types'
import {generateBatchPayload} from './utils'

const MAX_QUEUE_LENGTH = 1000
const eventsQueue: FusEventsQueue = []

export function scheduleEventsSending() {
  sendFusData()
  window.setTimeout(scheduleEventsSending, getFusConfig().interval)
}

export async function sendFusData() {
  const config = getFusConfig()

  if (!config.initialized || !config.endpoint || eventsQueue.length === 0) {
    return
  }

  const payload = generateBatchPayload([...eventsQueue])
  eventsQueue.splice(0, eventsQueue.length)

  try {
    await sendData(baseUri, config.endpoint, payload)
  } catch (error) {
    window.BS?.Log?.error(error)
    eventsQueue.push(...payload.events)
  }
}

export function addActionsToQueue(actions: ReadonlyArray<FusEvent>) {
  eventsQueue.push(...actions)

  if (eventsQueue.length > MAX_QUEUE_LENGTH) {
    eventsQueue.splice(0, eventsQueue.length - MAX_QUEUE_LENGTH)
  }
}

export const getEventsQueue = () => eventsQueue
export const clearEventsQueue = () => eventsQueue.splice(0, eventsQueue.length)
