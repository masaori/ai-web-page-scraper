// This file is generated by scripts/generateCheckEntityTypes.ts
import { WebPageElementPageLink } from '../../../../entities/WebPageElementPageLink'
import { checkEntityTypeWebPageElementPageLink } from '../single/checkEntityTypeWebPageElementPageLink'

export const checkEntityTypeWebPageElementPageLinkList = (entity: unknown): entity is WebPageElementPageLink[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeWebPageElementPageLink(el)) {
      return false
    }
  }

  return true
}
