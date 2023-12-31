// This file is generated by scripts/generateCheckEntityTypes.ts
import { ActionPlanWithAssociation } from '../../../../entities/_gen/ActionPlanWithAssociation'
import { checkEntityTypeActionPlan } from '../single/checkEntityTypeActionPlan'
import { checkEntityTypeActionPlanAppendSheetToSpreadsheetWithAssociation } from '../withAssociation/checkEntityTypeActionPlanAppendSheetToSpreadsheetWithAssociation'
import { checkEntityTypeActionPlanClickWithAssociation } from '../withAssociation/checkEntityTypeActionPlanClickWithAssociation'
import { checkEntityTypeActionPlanCollectDataWithAssociation } from '../withAssociation/checkEntityTypeActionPlanCollectDataWithAssociation'
import { checkEntityTypeActionPlanCreateSpreadsheetWithAssociation } from '../withAssociation/checkEntityTypeActionPlanCreateSpreadsheetWithAssociation'
import { checkEntityTypeActionPlanObserveWebPageWithAssociation } from '../withAssociation/checkEntityTypeActionPlanObserveWebPageWithAssociation'
import { checkEntityTypeActionPlanReportResultWithAssociation } from '../withAssociation/checkEntityTypeActionPlanReportResultWithAssociation'

export const checkEntityTypeActionPlanWithAssociation = (entity: unknown): entity is ActionPlanWithAssociation => {
  if (typeof entity !== 'object' || entity === null) {
    return false
  }

  if (!checkEntityTypeActionPlan(entity)) {
    return false
  }

  if (
    !(
      checkEntityTypeActionPlanAppendSheetToSpreadsheetWithAssociation(entity) ||
      checkEntityTypeActionPlanClickWithAssociation(entity) ||
      checkEntityTypeActionPlanCollectDataWithAssociation(entity) ||
      checkEntityTypeActionPlanCreateSpreadsheetWithAssociation(entity) ||
      checkEntityTypeActionPlanObserveWebPageWithAssociation(entity) ||
      checkEntityTypeActionPlanReportResultWithAssociation(entity)
    )
  ) {
    return false
  }

  return true
}
