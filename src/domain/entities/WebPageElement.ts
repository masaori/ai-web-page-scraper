import { WebPage } from './WebPage'

export type WebPageElement = {
  id: string
  webPageId: WebPage['id']
  type: 'pageLink' | 'text' | null
  order: number
  top: number
  left: number
  width: number
  height: number
}
