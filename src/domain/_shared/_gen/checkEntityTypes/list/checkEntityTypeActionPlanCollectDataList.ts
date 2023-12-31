// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanCollectData } from '../../../../entities/ActionPlanCollectData'
import { checkEntityTypeActionPlanCollectData } from '../single/checkEntityTypeActionPlanCollectData'

export const checkEntityTypeActionPlanCollectDataList = (entity: unknown): entity is ActionPlanCollectData[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionPlanCollectData(el)) {
      return false
    }
  }

  return true
}
