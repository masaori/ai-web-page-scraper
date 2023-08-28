import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionPlan } from './ActionPlan'

export type ActionPlanCollectData = {
  actionPlanId: Unique<ActionPlan['id']>
  type: 'collectData'
  collectedDataName: string
  webPageUrl: string
  whatToCollect: string
}
