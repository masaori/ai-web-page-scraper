// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionResultWithAssociation } from '../../../../entities/_gen/ActionResultWithAssociation'
import { checkEntityTypeActionResultWithAssociation } from '../withAssociation/checkEntityTypeActionResultWithAssociation'

export const checkEntityTypeActionResultWithAssociationList = (entity: unknown): entity is ActionResultWithAssociation[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionResultWithAssociation(el)) {
      return false
    }
  }

  return true
}