// This file is generated by scripts/generateCheckEntityTypes.ts
import { WebPageElement } from '../../../../entities/WebPageElement'

export const checkEntityTypeWebPageElement = (entity: unknown): entity is WebPageElement => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('id' in entity) ||
    typeof entity.id !== 'string' ||
    !('webPageId' in entity) ||
    typeof entity.webPageId !== 'string' ||
    !('type' in entity) ||
    (entity.type !== null && !(entity.type === 'pageLink' || entity.type === 'text')) ||
    !('order' in entity) ||
    typeof entity.order !== 'number' ||
    !('top' in entity) ||
    typeof entity.top !== 'number' ||
    !('left' in entity) ||
    typeof entity.left !== 'number' ||
    !('width' in entity) ||
    typeof entity.width !== 'number' ||
    !('height' in entity) ||
    typeof entity.height !== 'number'
  ) {
    // console.log(`[checkEntityTypeWebPageElement] entity is not WebPageElement: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}
