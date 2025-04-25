declare global {
  interface SubscriptionManager {
    closeSocket(message: string | null | undefined): unknown
  }

  interface ServerLink {
    getTotalFailuresNum?: () => number
  }

  interface BS {
    SubscriptionManager?: SubscriptionManager
    ServerLink?: ServerLink
    CSRF?: {
      getCachedToken: () => string | null | undefined
      handleCSRFError: (
        request: {
          status: number
          responseText: string
        },
        retryCallback: (() => unknown) | null | undefined,
        csrfToken: string | null | undefined,
      ) => boolean
      refreshCSRFToken: (callback?: () => unknown, force?: boolean) => unknown
    }
  }

  interface ReactUI {
    isSakuraUI?: boolean
  }

  interface Window {
    base_uri: string
    ReactUI: ReactUI
    BS: BS
  }
}

export const baseUri = window.base_uri
