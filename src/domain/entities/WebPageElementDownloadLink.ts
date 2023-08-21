import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { WebPageElement } from './WebPageElement'

export type WebPageElementDownloadLink = {
  id: string
  type: 'downloadLink'
  webPageElementId: Unique<WebPageElement['id']>
  url: string
  fileType: string
}
