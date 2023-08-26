// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanObserveWebPageWithAssociation } from '../../../../entities/_gen/ActionPlanObserveWebPageWithAssociation'
import { checkEntityTypeActionPlanObserveWebPage } from '../single/checkEntityTypeActionPlanObserveWebPage'

export const checkEntityTypeActionPlanObserveWebPageWithAssociation = (entity: unknown): entity is ActionPlanObserveWebPageWithAssociation => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!checkEntityTypeActionPlanObserveWebPage(entity)) {
    return false
  }

  return true
}