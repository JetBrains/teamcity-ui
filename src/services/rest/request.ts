import 'whatwg-fetch'

import {baseUri} from '../../types/BS_types'
import {objectEntries} from '../../utils/object'

import {HTTPCodesEnum} from './errors/HTTPError'
import NoConnectionError from './errors/NoConnectionError'
import {processResponse, processTextResponse} from './processResponse'

const LIMIT_FOR_NO_CONNECTION_ERROR = 2
const defaultHeaders: Record<string, string> = {
  Accept: 'application/json',
}

const getDefaultAuthHeaders = (): Record<string, string> => ({
  'X-Requested-With': 'XMLHttpRequest',
  'X-TeamCity-Client': window.ReactUI?.isSakuraUI ? 'Experimental UI' : 'Web UI',
})

function getHeadersEntries(headers: HeadersInit | null | undefined): readonly string[][] {
  if (headers == null) {
    return []
  }

  if (Array.isArray(headers)) {
    return headers
  }

  if (headers instanceof Headers) {
    const result = []
    headers.forEach((value, key) => {
      result.push([key, value])
    })
    return result
  }

  return objectEntries(headers)
}

const normalizeHeaders = (headers: HeadersInit | null | undefined): Record<string, string> =>
  Object.fromEntries(getHeadersEntries(headers))

export type RestRequestOptions = RequestInit & {
  essential?: boolean | null | undefined
  skipInTests?: boolean | null | undefined
  keepalive?: boolean | null | undefined
}
export function getHeaders(
  options?: RestRequestOptions | null | undefined,
  withAuth = true,
): Record<string, string> {
  let headers = {...defaultHeaders, ...normalizeHeaders(options?.headers)}

  if (withAuth) {
    headers = {...headers, ...getDefaultAuthHeaders()}
    const csrfToken = window.BS?.CSRF?.getCachedToken()

    if (csrfToken != null) {
      headers['X-TC-CSRF-Token'] = csrfToken
    }
  }

  if (options?.essential === true) {
    headers['X-TeamCity-Essential'] = 'true'
  }

  return headers
}
export function checkRequestPossibility() {
  if ((window.BS?.ServerLink?.getTotalFailuresNum?.() ?? 0) > LIMIT_FOR_NO_CONNECTION_ERROR) {
    throw new NoConnectionError('Connection is not available')
  }
}
type ProcessErrorCodesParams = {
  url: string | null | undefined
  statusCode: number | undefined
  getMessage: () => string | Promise<string>
  retryCallback?: () => unknown
  csrfToken?: string | null | undefined
}
export async function processErrorCodes({
  url,
  statusCode,
  getMessage,
  retryCallback,
  csrfToken,
}: ProcessErrorCodesParams): Promise<boolean> {
  if (url?.startsWith(window.base_uri)) {
    switch (statusCode) {
      case HTTPCodesEnum.UNAUTHORIZED:
        window.BS?.SubscriptionManager?.closeSocket('you are logged out')
        return false

      case HTTPCodesEnum.FORBIDDEN:
        return (
          window.BS?.CSRF?.handleCSRFError(
            {
              status: statusCode,
              responseText: await getMessage(),
            },
            retryCallback,
            csrfToken,
          ) ?? false
        )

      default:
        return false
    }
  }

  return false
}

function checkCSRFExists() {
  return new Promise<void>(resolve => {
    if (window.BS?.CSRF == null || window.BS.CSRF.getCachedToken() != null) {
      resolve()
    } else {
      window.BS.CSRF.refreshCSRFToken(resolve)
    }
  })
}

export async function request(
  serverUrl?: string | null,
  endpoint?: string | null,
  options?: RestRequestOptions | null,
  withAuth?: boolean,
): Promise<Response> {
  checkRequestPossibility()
  const method = options?.method

  if (method != null && method.toUpperCase() !== 'GET') {
    await checkCSRFExists()
  }

  async function doRequest() {
    const headers = getHeaders(options, withAuth)
    return {
      csrfToken: headers['X-TC-CSRF-Token'],
      response: await (options instanceof Request
        ? fetch(options)
        : fetch([serverUrl, endpoint].filter(Boolean).join('/'), {
            credentials: 'include',
            ...options,
            headers,
          })),
    }
  }

  const {response, csrfToken} = await doRequest()
  return new Promise(async resolve => {
    const shouldRetry = await processErrorCodes({
      url: serverUrl,
      statusCode: response.status,
      getMessage: () => response.clone().text(),
      retryCallback: async () => resolve((await doRequest()).response),
      csrfToken,
    })

    if (!shouldRetry) {
      resolve(response)
    }
  })
}

export function requestJSON<T>(endpoint: string, options?: RestRequestOptions): Promise<T> {
  return request(baseUri, endpoint, options).then<T>(processResponse)
}
export type RequestJSONType = typeof requestJSON

export function requestText(endpoint: string, options?: RestRequestOptions): Promise<string> {
  return request(baseUri, endpoint, options).then(processTextResponse)
}
export type RequestTextType = typeof requestText
