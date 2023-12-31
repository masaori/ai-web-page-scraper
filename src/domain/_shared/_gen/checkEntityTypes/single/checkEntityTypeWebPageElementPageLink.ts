// This file is generated by scripts/generateCheckEntityTypes.ts
import { WebPageElementPageLink } from '../../../../entities/WebPageElementPageLink'

export const checkEntityTypeWebPageElementPageLink = (entity: unknown): entity is WebPageElementPageLink => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('webPageElementId' in entity) ||
    typeof entity.webPageElementId !== 'string' ||
    !('type' in entity) ||
    !(entity.type === 'pageLink') ||
    !('text' in entity) ||
    typeof entity.text !== 'string' ||
    !('url' in entity) ||
    typeof entity.url !== 'string'
  ) {
    // console.log(`[checkEntityTypeWebPageElementPageLink] entity is not WebPageElementPageLink: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}
