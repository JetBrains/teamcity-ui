import {sendFusData} from './scheduler'

export function initializeUnloadListeners() {
  const sendBeforeUnloadHandler = () => sendFusData(true)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendBeforeUnloadHandler()
    }
  })

  window.addEventListener('pagehide', sendBeforeUnloadHandler)
  window.addEventListener('beforeunload', sendBeforeUnloadHandler)
}
