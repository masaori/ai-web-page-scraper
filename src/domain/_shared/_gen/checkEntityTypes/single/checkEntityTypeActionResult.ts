// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionResult } from '../../../../entities/ActionResult'

export const checkEntityTypeActionResult = (entity: unknown): entity is ActionResult => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('id' in entity) ||
    typeof entity.id !== 'string' ||
    !('actionPlanId' in entity) ||
    typeof entity.actionPlanId !== 'string' ||
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
    // console.log(`[checkEntityTypeActionResult] entity is not ActionResult: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}
