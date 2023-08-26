import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionPlanObserveWebPage = {
  actionPlanId: Unique<ActionPlan['id']>
  type: 'observeWebPage'
  url: string
}
