import {HTTPError} from './errors/HTTPError'

export async function processErrors(response: Response) {
  if (!response.ok) {
    const message = await response.clone().text()
    throw new HTTPError(message, response.status, response.url, response)
  }
}

export async function processResponse<T>(response: Response): Promise<T> {
  await processErrors(response)

  return response.json()
}

export async function processTextResponse(response: Response): Promise<string> {
  await processErrors(response)

  return response.text()
}
