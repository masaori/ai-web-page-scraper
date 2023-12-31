// This file is generated by scripts/generateCheckEntityTypes.ts
import { WebPageElementText } from '../../../../entities/WebPageElementText'
import { checkEntityTypeWebPageElementText } from '../single/checkEntityTypeWebPageElementText'

export const checkEntityTypeWebPageElementTextList = (entity: unknown): entity is WebPageElementText[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeWebPageElementText(el)) {
      return false
    }
  }

  return true
}
