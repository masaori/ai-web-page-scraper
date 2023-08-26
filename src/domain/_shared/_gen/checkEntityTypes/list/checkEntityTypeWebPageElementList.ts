// This file is generated by scripts/generateCheckEntityTypes.ts
import { WebPageElement } from '../../../../entities/WebPageElement'
import { checkEntityTypeWebPageElement } from '../single/checkEntityTypeWebPageElement'

export const checkEntityTypeWebPageElementList = (entity: unknown): entity is WebPageElement[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeWebPageElement(el)) {
      return false
    }
  }

  return true
}
