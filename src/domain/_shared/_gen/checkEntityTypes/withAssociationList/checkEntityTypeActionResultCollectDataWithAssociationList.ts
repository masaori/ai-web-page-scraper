// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionResultCollectDataWithAssociation } from '../../../../entities/_gen/ActionResultCollectDataWithAssociation'
import { checkEntityTypeActionResultCollectDataWithAssociation } from '../withAssociation/checkEntityTypeActionResultCollectDataWithAssociation'

export const checkEntityTypeActionResultCollectDataWithAssociationList = (entity: unknown): entity is ActionResultCollectDataWithAssociation[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionResultCollectDataWithAssociation(el)) {
      return false
    }
  }

  return true
}
