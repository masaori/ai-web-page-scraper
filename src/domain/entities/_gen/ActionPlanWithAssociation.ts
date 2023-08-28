// This file is generated by scripts/generateEntityTypeWithAssociations.ts
import { ActionPlan } from '../ActionPlan'
// Import Referred entities
import { ActionResultWithAssociation } from './ActionResultWithAssociation'
// Import Sub type entities
import { ActionPlanAppendSheetToSpreadsheetWithAssociation } from './ActionPlanAppendSheetToSpreadsheetWithAssociation'
import { ActionPlanClickWithAssociation } from './ActionPlanClickWithAssociation'
import { ActionPlanCollectDataWithAssociation } from './ActionPlanCollectDataWithAssociation'
import { ActionPlanCreateSpreadsheetWithAssociation } from './ActionPlanCreateSpreadsheetWithAssociation'
import { ActionPlanObserveWebPageWithAssociation } from './ActionPlanObserveWebPageWithAssociation'
import { ActionPlanReportResultWithAssociation } from './ActionPlanReportResultWithAssociation'

export type ActionPlanWithAssociation = ActionPlan & {
  // Unique Referred entities
  actionResult: ActionResultWithAssociation | null
  // Non-unique Referred entities
} & // Sub type entities
  (| ActionPlanAppendSheetToSpreadsheetWithAssociation
    | ActionPlanClickWithAssociation
    | ActionPlanCollectDataWithAssociation
    | ActionPlanCreateSpreadsheetWithAssociation
    | ActionPlanObserveWebPageWithAssociation
    | ActionPlanReportResultWithAssociation
  )
