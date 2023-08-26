// This file is generated by scripts/generateInterfaceRepositories.ts
import { ActionPlan } from '../../../entities/ActionPlan'
import { ActionPlanCreateSpreadsheet } from '../../../entities/ActionPlanCreateSpreadsheet'
import { PromisedResult, UnknownRuntimeError } from '../../../../_shared/error'

export interface ActionPlanCreateSpreadsheetRepository {
  issueId: () => PromisedResult<string, UnknownRuntimeError>
  getAll: () => PromisedResult<ActionPlanCreateSpreadsheet[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<ActionPlanCreateSpreadsheet[], UnknownRuntimeError>
  create: (entity: ActionPlanCreateSpreadsheet) => PromisedResult<ActionPlanCreateSpreadsheet, UnknownRuntimeError | AlreadyExistsError>
  update: (entity: ActionPlanCreateSpreadsheet) => PromisedResult<ActionPlanCreateSpreadsheet, UnknownRuntimeError | NotFoundError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError | NotFoundError>
  getByActionPlanId: (ActionPlanId: ActionPlan['id']) => PromisedResult<ActionPlanCreateSpreadsheet | null, UnknownRuntimeError>
}
