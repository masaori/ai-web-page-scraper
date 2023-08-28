import { Ok } from '@sniptt/monads'
import { AlreadyExistsError, PromisedResult, UnknownRuntimeError, NotFoundError, unknownRuntimeError } from '../../../_shared/error'
import { Spreadsheet } from '../../../domain/entities/Spreadsheet'
import { SpreadsheetRepository } from '../../../domain/interfaces/repositories/_gen/SpreadsheetRepository'
import { GoogleApiClient } from '../../_shared/GoogleApiClient'
import { VectorDbSpreadsheetRepository } from '../vectorDb/_gen/VectorDbSpreadsheetRepository'

export class GoogleApiSpreadsheetRepository implements SpreadsheetRepository {
  constructor(
    private readonly googleApiClient: GoogleApiClient,
    private readonly vectorDbSpreadsheetRepository: VectorDbSpreadsheetRepository,
  ) {}

  issueId = async (): PromisedResult<string, UnknownRuntimeError> => {
    const createSpreadsheetResult = await this.googleApiClient.createSpreadsheet('untitled')

    return Ok(createSpreadsheetResult.spreadsheetId)
  }

  getById = this.vectorDbSpreadsheetRepository.getById

  getAll = this.vectorDbSpreadsheetRepository.getAll

  getRelevant = this.vectorDbSpreadsheetRepository.getRelevant

  create = async (entity: Spreadsheet): PromisedResult<Spreadsheet, UnknownRuntimeError | AlreadyExistsError> => {
    try {
      await this.googleApiClient.updateSpreadsheet(entity.id, entity.name)

      const createVectorDbRecordResult = await this.vectorDbSpreadsheetRepository.create(entity)

      if (createVectorDbRecordResult.isErr()) {
        return createVectorDbRecordResult
      }
    } catch (e) {
      console.error(`[GoogleApiSpreadsheetRepository] create: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }

    return Ok(entity)
  }

  update = async (entity: Spreadsheet): PromisedResult<Spreadsheet, UnknownRuntimeError | NotFoundError> => {
    try {
      await this.googleApiClient.updateSpreadsheet(entity.id, entity.name)

      const createVectorDbRecordResult = await this.vectorDbSpreadsheetRepository.update(entity)

      if (createVectorDbRecordResult.isErr()) {
        return createVectorDbRecordResult
      }
    } catch (e) {
      console.error(`[GoogleApiSpreadsheetRepository] create: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }

    return Ok(entity)
  }

  delete = this.vectorDbSpreadsheetRepository.delete
}
