// This file is generated by scripts/generateInterfaceRepositories.ts
import { WebPage } from '../../../entities/WebPage'
import { WebPageElement } from '../../../entities/WebPageElement'
import { PromisedResult, UnknownRuntimeError, AlreadyExistsError, NotFoundError } from '../../../../_shared/error'

export interface WebPageElementRepository {
  issueId: () => PromisedResult<string, UnknownRuntimeError>
  getAll: () => PromisedResult<WebPageElement[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<WebPageElement[], UnknownRuntimeError>
  create: (entity: WebPageElement) => PromisedResult<WebPageElement, UnknownRuntimeError | AlreadyExistsError>
  update: (entity: WebPageElement) => PromisedResult<WebPageElement, UnknownRuntimeError | NotFoundError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError | NotFoundError>
  getById: (id: string) => PromisedResult<WebPageElement | null, UnknownRuntimeError>
  getAllByWebPageId: (WebPageId: WebPage['id']) => PromisedResult<WebPageElement[], UnknownRuntimeError>
}
