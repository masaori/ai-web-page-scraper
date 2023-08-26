import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionPlanClick = {
  actionPlanId: Unique<ActionPlan['id']>
  type: 'click'
  label: string
  x: number
  y: number
}
