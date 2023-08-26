import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionPlanCollectData = {
  actionPlanId: Unique<ActionPlan['id']>
  type: 'collectData'
  name: string
  webPageUrl: string
  description: string
}
