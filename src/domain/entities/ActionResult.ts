import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionResult = {
  id: string
  actionPlanId: Unique<ActionPlan['id']>
  type: 'click' | 'observeWebPage' | 'collectData' | 'createSpreadsheet' | 'appendSheetToSpreadsheet' | 'reportResult'
}
