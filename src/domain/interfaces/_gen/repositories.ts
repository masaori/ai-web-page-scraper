// This file is generated by scripts/generateInterfaceRepositories.ts
import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'
import { ActionPlan } from '../../entities/ActionPlan'
import { UserRequest } from '../../entities/UserRequest'
import { WebPage } from '../../entities/WebPage'
import { WebPageElement } from '../../entities/WebPageElement'
import { WebPageElementDownloadLink } from '../../entities/WebPageElementDownloadLink'
import { WebPageElementPageLink } from '../../entities/WebPageElementPageLink'

export interface ActionPlanRepository {
  getAll: () => PromisedResult<ActionPlan[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<ActionPlan[], UnknownRuntimeError>
  create: (entity: ActionPlan) => PromisedResult<ActionPlan, UnknownRuntimeError>
  update: (entity: ActionPlan) => PromisedResult<ActionPlan, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getById: (id: string) => PromisedResult<ActionPlan | null, UnknownRuntimeError>
  getAllByUserRequestId: (UserRequestId: UserRequest['id']) => PromisedResult<ActionPlan[], UnknownRuntimeError>
}

export interface UserRequestRepository {
  getAll: () => PromisedResult<UserRequest[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<UserRequest[], UnknownRuntimeError>
  create: (entity: UserRequest) => PromisedResult<UserRequest, UnknownRuntimeError>
  update: (entity: UserRequest) => PromisedResult<UserRequest, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getById: (id: string) => PromisedResult<UserRequest | null, UnknownRuntimeError>
}

export interface WebPageRepository {
  getAll: () => PromisedResult<WebPage[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<WebPage[], UnknownRuntimeError>
  create: (entity: WebPage) => PromisedResult<WebPage, UnknownRuntimeError>
  update: (entity: WebPage) => PromisedResult<WebPage, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getById: (id: string) => PromisedResult<WebPage | null, UnknownRuntimeError>
}

export interface WebPageElementRepository {
  getAll: () => PromisedResult<WebPageElement[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<WebPageElement[], UnknownRuntimeError>
  create: (entity: WebPageElement) => PromisedResult<WebPageElement, UnknownRuntimeError>
  update: (entity: WebPageElement) => PromisedResult<WebPageElement, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getById: (id: string) => PromisedResult<WebPageElement | null, UnknownRuntimeError>
  getAllByWebPageId: (WebPageId: WebPage['id']) => PromisedResult<WebPageElement[], UnknownRuntimeError>
}

export interface WebPageElementDownloadLinkRepository {
  getAll: () => PromisedResult<WebPageElementDownloadLink[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<WebPageElementDownloadLink[], UnknownRuntimeError>
  create: (entity: WebPageElementDownloadLink) => PromisedResult<WebPageElementDownloadLink, UnknownRuntimeError>
  update: (entity: WebPageElementDownloadLink) => PromisedResult<WebPageElementDownloadLink, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getById: (id: string) => PromisedResult<WebPageElementDownloadLink | null, UnknownRuntimeError>
  getByWebPageElementId: (WebPageElementId: WebPageElement['id']) => PromisedResult<WebPageElementDownloadLink | null, UnknownRuntimeError>
}

export interface WebPageElementPageLinkRepository {
  getAll: () => PromisedResult<WebPageElementPageLink[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<WebPageElementPageLink[], UnknownRuntimeError>
  create: (entity: WebPageElementPageLink) => PromisedResult<WebPageElementPageLink, UnknownRuntimeError>
  update: (entity: WebPageElementPageLink) => PromisedResult<WebPageElementPageLink, UnknownRuntimeError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError>
  getById: (id: string) => PromisedResult<WebPageElementPageLink | null, UnknownRuntimeError>
  getByWebPageElementId: (WebPageElementId: WebPageElement['id']) => PromisedResult<WebPageElementPageLink | null, UnknownRuntimeError>
}
