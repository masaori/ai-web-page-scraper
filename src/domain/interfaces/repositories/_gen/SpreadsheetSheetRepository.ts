// This file is generated by scripts/generateInterfaceRepositories.ts
import { CollectedData } from '../../../entities/CollectedData'
import { Spreadsheet } from '../../../entities/Spreadsheet'
import { SpreadsheetSheet } from '../../../entities/SpreadsheetSheet'
import { PromisedResult, UnknownRuntimeError, AlreadyExistsError, NotFoundError } from '../../../../_shared/error'

export interface SpreadsheetSheetRepository {
  issueId: () => PromisedResult<string, UnknownRuntimeError>
  getAll: () => PromisedResult<SpreadsheetSheet[], UnknownRuntimeError>
  getRelevant: (text: string, limit: number) => PromisedResult<SpreadsheetSheet[], UnknownRuntimeError>
  create: (entity: SpreadsheetSheet) => PromisedResult<SpreadsheetSheet, UnknownRuntimeError | AlreadyExistsError>
  update: (entity: SpreadsheetSheet) => PromisedResult<SpreadsheetSheet, UnknownRuntimeError | NotFoundError>
  delete: (id: string) => PromisedResult<void, UnknownRuntimeError | NotFoundError>
  getById: (id: string) => PromisedResult<SpreadsheetSheet | null, UnknownRuntimeError>
  getAllBySpreadsheetId: (SpreadsheetId: Spreadsheet['id']) => PromisedResult<SpreadsheetSheet[], UnknownRuntimeError>
  getByCollectedDataId: (CollectedDataId: CollectedData['id']) => PromisedResult<SpreadsheetSheet | null, UnknownRuntimeError>
}
