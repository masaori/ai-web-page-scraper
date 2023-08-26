// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanAppendSheetToSpreadsheetWithAssociation } from '../../../../entities/_gen/ActionPlanAppendSheetToSpreadsheetWithAssociation'
import { checkEntityTypeActionPlanAppendSheetToSpreadsheet } from '../single/checkEntityTypeActionPlanAppendSheetToSpreadsheet'

export const checkEntityTypeActionPlanAppendSheetToSpreadsheetWithAssociation = (
  entity: unknown,
): entity is ActionPlanAppendSheetToSpreadsheetWithAssociation => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!checkEntityTypeActionPlanAppendSheetToSpreadsheet(entity)) {
    return false
  }

  return true
}
