// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanObserveWebPage } from '../../../../entities/ActionPlanObserveWebPage'
import { checkEntityTypeActionPlanObserveWebPage } from '../single/checkEntityTypeActionPlanObserveWebPage'

export const checkEntityTypeActionPlanObserveWebPageList = (entity: unknown): entity is ActionPlanObserveWebPage[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionPlanObserveWebPage(el)) {
      return false
    }
  }

  return true
}
