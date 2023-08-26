// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanClick } from '../../../../entities/ActionPlanClick'

export const checkEntityTypeActionPlanClick = (entity: unknown): entity is ActionPlanClick => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('actionPlanId' in entity) ||
    typeof entity.actionPlanId !== 'string' ||
    !('type' in entity) ||
    !(entity.type === 'click') ||
    !('label' in entity) ||
    typeof entity.label !== 'string' ||
    !('x' in entity) ||
    typeof entity.x !== 'number' ||
    !('y' in entity) ||
    typeof entity.y !== 'number'
  ) {
    // console.log(`[checkEntityTypeActionPlanClick] entity is not ActionPlanClick: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}