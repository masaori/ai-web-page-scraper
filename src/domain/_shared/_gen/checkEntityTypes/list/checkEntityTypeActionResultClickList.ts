// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionResultClick } from '../../../../entities/ActionResultClick'
import { checkEntityTypeActionResultClick } from '../single/checkEntityTypeActionResultClick'

export const checkEntityTypeActionResultClickList = (entity: unknown): entity is ActionResultClick[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionResultClick(el)) {
      return false
    }
  }

  return true
}
