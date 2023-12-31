// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanCreateSpreadsheet } from '../../../../entities/ActionPlanCreateSpreadsheet'

export const checkEntityTypeActionPlanCreateSpreadsheet = (entity: unknown): entity is ActionPlanCreateSpreadsheet => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('actionPlanId' in entity) ||
    typeof entity.actionPlanId !== 'string' ||
    !('type' in entity) ||
    !(entity.type === 'createSpreadsheet') ||
    !('spreadsheetName' in entity) ||
    typeof entity.spreadsheetName !== 'string' ||
    !('spreadsheetDescription' in entity) ||
    typeof entity.spreadsheetDescription !== 'string'
  ) {
    // console.log(`[checkEntityTypeActionPlanCreateSpreadsheet] entity is not ActionPlanCreateSpreadsheet: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}
