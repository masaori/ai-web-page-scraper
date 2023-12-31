// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlan } from '../../../../entities/ActionPlan'

export const checkEntityTypeActionPlan = (entity: unknown): entity is ActionPlan => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('id' in entity) ||
    typeof entity.id !== 'string' ||
    !('userRequestId' in entity) ||
    typeof entity.userRequestId !== 'string' ||
    !('type' in entity) ||
    !(
      entity.type === 'click' ||
      entity.type === 'observeWebPage' ||
      entity.type === 'collectData' ||
      entity.type === 'createSpreadsheet' ||
      entity.type === 'appendSheetToSpreadsheet' ||
      entity.type === 'reportResult'
    )
  ) {
    // console.log(`[checkEntityTypeActionPlan] entity is not ActionPlan: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}
