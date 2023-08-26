import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { WebPageElement } from './WebPageElement'

export type WebPageElementText = {
  webPageElementId: Unique<WebPageElement['id']>
  type: 'text'
  text: string
}
