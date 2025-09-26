import {request} from '../../services/rest/request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendData(serverUrl: string, endpoint: string, data: any) {
  return request(serverUrl, `${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
