import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionPlanCreateSpreadsheet = {
  actionPlanId: Unique<ActionPlan['id']>
  type: 'createSpreadsheet'
  spreadsheetName: string
  spreadsheetDescription: string
}
