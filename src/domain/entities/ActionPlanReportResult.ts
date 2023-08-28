import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionPlanReportResult = {
  actionPlanId: Unique<ActionPlan['id']>
  type: 'reportResult'
  message: string
}
