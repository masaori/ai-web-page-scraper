// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlan } from '../../../../entities/ActionPlan'
import { checkEntityTypeActionPlan } from '../single/checkEntityTypeActionPlan'

export const checkEntityTypeActionPlanList = (entity: unknown): entity is ActionPlan[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionPlan(el)) {
      return false
    }
  }

  return true
}
