import { WebPage } from './WebPage'

export type WebPageElement = {
  id: string
  webPageId: WebPage['id']
  type: 'pageLink' | 'downloadLink' | 'undetermined'
  top: number
  left: number
  width: number
  height: number
}
