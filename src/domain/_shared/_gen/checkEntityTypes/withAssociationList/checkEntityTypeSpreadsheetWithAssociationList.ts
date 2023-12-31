// This file is generated by scripts/generateCheckEntityTypes.ts
import { SpreadsheetWithAssociation } from '../../../../entities/_gen/SpreadsheetWithAssociation'
import { checkEntityTypeSpreadsheetWithAssociation } from '../withAssociation/checkEntityTypeSpreadsheetWithAssociation'

export const checkEntityTypeSpreadsheetWithAssociationList = (entity: unknown): entity is SpreadsheetWithAssociation[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeSpreadsheetWithAssociation(el)) {
      return false
    }
  }

  return true
}
