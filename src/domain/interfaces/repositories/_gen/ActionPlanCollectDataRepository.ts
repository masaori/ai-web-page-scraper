// This file is generated by scripts/generateInterfaceRepositories.ts
import { ActionPlan } from '../../../entities/ActionPlan'
import { ActionPlanCollectData } from '../../../entities/ActionPlanCollectData'
import { PromisedResult, UnknownRuntimeError } from '../../../../_shared/error'

export interface ActionPlanCollectDataRepository {
  getAll: () => PromisedResult<ActionPlanCollectData[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<ActionPlanCollectData[], UnknownRuntimeError>
  create: (entity: ActionPlanCollectData) => PromisedResult<ActionPlanCollectData, UnknownRuntimeError>
  update: (entity: ActionPlanCollectData) => PromisedResult<ActionPlanCollectData, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getByActionPlanId: (ActionPlanId: ActionPlan['id']) => PromisedResult<ActionPlanCollectData | null, UnknownRuntimeError>
}