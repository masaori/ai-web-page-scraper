// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionResultCreateSpreadsheet } from '../../../../entities/ActionResultCreateSpreadsheet'

export const checkEntityTypeActionResultCreateSpreadsheet = (entity: unknown): entity is ActionResultCreateSpreadsheet => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (
    !('actionResultId' in entity) ||
    typeof entity.actionResultId !== 'string' ||
    !('type' in entity) ||
    !(entity.type === 'createSpreadsheet') ||
    !('spreadsheetId' in entity) ||
    typeof entity.spreadsheetId !== 'string'
  ) {
    // console.log(`[checkEntityTypeActionResultCreateSpreadsheet] entity is not ActionResultCreateSpreadsheet: ${JSON.stringify(entity)}`)
    return false
  }

  return true
}