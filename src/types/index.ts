export type UrlExtension<Options extends object> = {
  name: string
  kind?: string
  serverUrl?: string
  endpoint: string
  options?: Options
}
