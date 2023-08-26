// This file is generated by scripts/generateInterfaceRepositories.ts
import { ActionPlan } from '../../../entities/ActionPlan'
import { UserRequest } from '../../../entities/UserRequest'
import { PromisedResult, UnknownRuntimeError } from '../../../../_shared/error'

export interface ActionPlanRepository {
  issueId: () => PromisedResult<string, UnknownRuntimeError>
  getAll: () => PromisedResult<ActionPlan[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<ActionPlan[], UnknownRuntimeError>
  create: (entity: ActionPlan) => PromisedResult<ActionPlan, UnknownRuntimeError | AlreadyExistsError>
  update: (entity: ActionPlan) => PromisedResult<ActionPlan, UnknownRuntimeError | NotFoundError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError | NotFoundError>
  getById: (id: string) => PromisedResult<ActionPlan | null, UnknownRuntimeError>
  getAllByUserRequestId: (UserRequestId: UserRequest['id']) => PromisedResult<ActionPlan[], UnknownRuntimeError>
}
