// This file is generated by scripts/generateCheckEntityTypes.ts
import { WebPage } from '../../../../entities/WebPage'

export const checkEntityTypeWebPage = (entity: unknown): entity is WebPage => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('id' in entity) ||
    typeof entity.id !== 'string' ||
    !('url' in entity) ||
    typeof entity.url !== 'string' ||
    !('width' in entity) ||
    typeof entity.width !== 'number' ||
    !('height' in entity) ||
    typeof entity.height !== 'number'
  ) {
    // console.log(`[checkEntityTypeWebPage] entity is not WebPage: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}
