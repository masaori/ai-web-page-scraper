// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanObserveWebPage } from '../../../../entities/ActionPlanObserveWebPage'

export const checkEntityTypeActionPlanObserveWebPage = (entity: unknown): entity is ActionPlanObserveWebPage => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('actionPlanId' in entity) ||
    typeof entity.actionPlanId !== 'string' ||
    !('type' in entity) ||
    !(entity.type === 'observeWebPage') ||
    !('url' in entity) ||
    typeof entity.url !== 'string'
  ) {
    // console.log(`[checkEntityTypeActionPlanObserveWebPage] entity is not ActionPlanObserveWebPage: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}