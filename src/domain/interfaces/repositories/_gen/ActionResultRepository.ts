// This file is generated by scripts/generateInterfaceRepositories.ts
import { ActionPlan } from '../../../entities/ActionPlan'
import { ActionResult } from '../../../entities/ActionResult'
import { PromisedResult, UnknownRuntimeError, AlreadyExistsError, NotFoundError } from '../../../../_shared/error'

export interface ActionResultRepository {
  issueId: () => PromisedResult<string, UnknownRuntimeError>
  getAll: () => PromisedResult<ActionResult[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<ActionResult[], UnknownRuntimeError>
  create: (entity: ActionResult) => PromisedResult<ActionResult, UnknownRuntimeError | AlreadyExistsError>
  update: (entity: ActionResult) => PromisedResult<ActionResult, UnknownRuntimeError | NotFoundError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError | NotFoundError>
  getById: (id: string) => PromisedResult<ActionResult | null, UnknownRuntimeError>
  getByActionPlanId: (ActionPlanId: ActionPlan['id']) => PromisedResult<ActionResult | null, UnknownRuntimeError>
}
