// This file is generated by scripts/generateInterfaceRepositories.ts
import { WebPageElement } from '../../../entities/WebPageElement'
import { WebPageElementPageLink } from '../../../entities/WebPageElementPageLink'
import { PromisedResult, UnknownRuntimeError } from '../../../../_shared/error'

export interface WebPageElementPageLinkRepository {
  getAll: () => PromisedResult<WebPageElementPageLink[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<WebPageElementPageLink[], UnknownRuntimeError>
  create: (entity: WebPageElementPageLink) => PromisedResult<WebPageElementPageLink, UnknownRuntimeError>
  update: (entity: WebPageElementPageLink) => PromisedResult<WebPageElementPageLink, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getByWebPageElementId: (WebPageElementId: WebPageElement['id']) => PromisedResult<WebPageElementPageLink | null, UnknownRuntimeError>
}