import {request} from './request'

describe('request', () => {
  const originalFetch = window.fetch
  const originalBaseUri = window['base_uri']
  const originalBS = window.BS

  afterEach(() => {
    window.fetch = originalFetch
    window['base_uri'] = originalBaseUri
    window.BS = originalBS
  })

  it('retries a Request with a fresh body and refreshed headers', async () => {
    const requests: Array<{body: string; csrfToken: string | null}> = []
    let csrfToken = 'old-token'

    window['base_uri'] = 'http://localhost'
    window.BS = {
      CSRF: {
        getCachedToken: jest.fn(() => csrfToken),
        handleCSRFError: jest.fn((_request, retryCallback) => {
          csrfToken = 'new-token'
          retryCallback?.()

          return true
        }),
        refreshCSRFToken: jest.fn(callback => callback?.()),
      },
      ServerLink: {
        getTotalFailuresNum: jest.fn(() => 0),
      },
    }
    window.fetch = jest.fn(async input => {
      const requestInput = input as Request
      requests.push({
        body: await requestInput.text(),
        csrfToken: requestInput.headers.get('X-TC-CSRF-Token'),
      })

      return requests.length === 1
        ? new Response('CSRF token error', {status: 403})
        : new Response('ok')
    })

    const response = await request(
      window['base_uri'],
      null,
      new Request('http://localhost/app/rest/test', {
        method: 'POST',
        body: 'payload',
      }),
    )

    await expect(response.text()).resolves.toBe('ok')
    expect(requests).toEqual([
      {body: 'payload', csrfToken: 'old-token'},
      {body: 'payload', csrfToken: 'new-token'},
    ])
  })
})
