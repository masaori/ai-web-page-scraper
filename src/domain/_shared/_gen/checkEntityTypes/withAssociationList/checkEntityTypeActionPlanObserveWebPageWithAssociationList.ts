// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanObserveWebPageWithAssociation } from '../../../../entities/_gen/ActionPlanObserveWebPageWithAssociation'
import { checkEntityTypeActionPlanObserveWebPageWithAssociation } from '../withAssociation/checkEntityTypeActionPlanObserveWebPageWithAssociation'

export const checkEntityTypeActionPlanObserveWebPageWithAssociationList = (entity: unknown): entity is ActionPlanObserveWebPageWithAssociation[] => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!Array.isArray(entity)) {
    return false
  }

  for (const el of entity) {
    if (!checkEntityTypeActionPlanObserveWebPageWithAssociation(el)) {
      return false
    }
  }

  return true
}
