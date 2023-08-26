import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionPlanAppendSheetToSpreadsheet = {
  actionPlanId: Unique<ActionPlan['id']>
  type: 'appendSheetToSpreadsheet'
  parentSpreadsheetTitle: string
  title: string
  collectedDataName: string
}
