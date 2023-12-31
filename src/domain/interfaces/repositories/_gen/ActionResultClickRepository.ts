// This file is generated by scripts/generateInterfaceRepositories.ts
import { ActionResult } from '../../../entities/ActionResult'
import { ActionResultClick } from '../../../entities/ActionResultClick'
import { PromisedResult, UnknownRuntimeError, AlreadyExistsError, NotFoundError } from '../../../../_shared/error'

export interface ActionResultClickRepository {
  issueId: () => PromisedResult<string, UnknownRuntimeError>
  getAll: () => PromisedResult<ActionResultClick[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<ActionResultClick[], UnknownRuntimeError>
  create: (entity: ActionResultClick) => PromisedResult<ActionResultClick, UnknownRuntimeError | AlreadyExistsError>
  update: (entity: ActionResultClick) => PromisedResult<ActionResultClick, UnknownRuntimeError | NotFoundError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError | NotFoundError>
  getByActionResultId: (ActionResultId: ActionResult['id']) => PromisedResult<ActionResultClick | null, UnknownRuntimeError>
}
