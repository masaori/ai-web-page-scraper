import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { WebPageElement } from './WebPageElement'

export type WebPageElementPageLink = {
  webPageElementId: Unique<WebPageElement['id']>
  type: 'pageLink'
  url: string
}
