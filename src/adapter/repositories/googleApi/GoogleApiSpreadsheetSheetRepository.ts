import { Ok } from '@sniptt/monads'
import { AlreadyExistsError, PromisedResult, UnknownRuntimeError, NotFoundError, unknownRuntimeError } from '../../../_shared/error'
import { SpreadsheetSheet } from '../../../domain/entities/SpreadsheetSheet'
import { SpreadsheetSheetRepository } from '../../../domain/interfaces/repositories/_gen/SpreadsheetSheetRepository'
import { GoogleApiClient } from '../../_shared/GoogleApiClient'
import { VectorDbSpreadsheetSheetRepository } from '../vectorDb/_gen/VectorDbSpreadsheetSheetRepository'
import { check2dArrayOfStringOrNumbers } from '../../../_shared/types'
import { VectorDbCollectedDataRepository } from '../vectorDb/_gen/VectorDbCollectedDataRepository'

export class GoogleApiSpreadsheetSheetRepository implements SpreadsheetSheetRepository {
  constructor(
    private readonly googleApiClient: GoogleApiClient,
    private readonly vectorDbSpreadsheetSheetRepository: VectorDbSpreadsheetSheetRepository,
    private readonly vectorDbCollectDataRepository: VectorDbCollectedDataRepository,
  ) {}

  issueId = this.vectorDbSpreadsheetSheetRepository.issueId

  getById = this.vectorDbSpreadsheetSheetRepository.getById

  getAll = this.vectorDbSpreadsheetSheetRepository.getAll

  getAllBySpreadsheetId = this.vectorDbSpreadsheetSheetRepository.getAllBySpreadsheetId

  getByCollectedDataId = this.vectorDbSpreadsheetSheetRepository.getByCollectedDataId

  getRelevant = this.vectorDbSpreadsheetSheetRepository.getRelevant

  create = async (entity: SpreadsheetSheet): PromisedResult<SpreadsheetSheet, UnknownRuntimeError | AlreadyExistsError> => {
    try {
      if (!entity.collectedDataId) {
        return unknownRuntimeError(`[GoogleApiSpreadsheetSheetRepository] CollectedDataId cannot be null`)
      }

      const getCollectedDataByIdResult = await this.vectorDbCollectDataRepository.getById(entity.collectedDataId)

      if (getCollectedDataByIdResult.isErr()) {
        return unknownRuntimeError(
          `[GoogleApiSpreadsheetSheetRepository] failed to get CollectedData by id: ${entity.collectedDataId} ${
            getCollectedDataByIdResult.unwrapErr().message
          }`,
        )
      }

      if (!getCollectedDataByIdResult.unwrap()) {
        return unknownRuntimeError(`[GoogleApiSpreadsheetSheetRepository] CollectedData cannot be null`)
      }

      const collectedDataJson = getCollectedDataByIdResult.unwrap()?.dataJson

      if (!collectedDataJson) {
        return unknownRuntimeError(`[GoogleApiSpreadsheetSheetRepository] CollectedDataJson cannot be null`)
      }

      const collectedData: unknown = JSON.parse(collectedDataJson)

      if (!check2dArrayOfStringOrNumbers(collectedData)) {
        return unknownRuntimeError(`[GoogleApiSpreadsheetSheetRepository] CollectedData is not valid JSON ${collectedDataJson}`)
      }

      const createSheetResult = await this.googleApiClient.createSheet(entity.spreadsheetId, entity.name, collectedData)

      const entityWithSheetNumber: SpreadsheetSheet = {
        ...entity,
        sheetNumber: createSheetResult.sheetId,
      }
      const createVectorDbRecordResult = await this.vectorDbSpreadsheetSheetRepository.create(entityWithSheetNumber)

      if (createVectorDbRecordResult.isErr()) {
        return createVectorDbRecordResult
      }

      return Ok(entityWithSheetNumber)
    } catch (e) {
      console.error(`[GoogleApiSpreadsheetSheetRepository] create: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  update = async (entity: SpreadsheetSheet): PromisedResult<SpreadsheetSheet, UnknownRuntimeError | NotFoundError> => {
    try {
      if (!entity.collectedDataId) {
        return unknownRuntimeError(`[GoogleApiSpreadsheetSheetRepository] CollectedDataId cannot be null`)
      }

      const getCollectedDataByIdResult = await this.vectorDbCollectDataRepository.getById(entity.collectedDataId)

      if (getCollectedDataByIdResult.isErr()) {
        return unknownRuntimeError(
          `[GoogleApiSpreadsheetSheetRepository] failed to get CollectedData by id: ${entity.collectedDataId} ${
            getCollectedDataByIdResult.unwrapErr().message
          }`,
        )
      }

      const collectedDataJson = getCollectedDataByIdResult.unwrap()?.dataJson

      if (!collectedDataJson) {
        return unknownRuntimeError(`[GoogleApiSpreadsheetSheetRepository] CollectedDataJson cannot be null`)
      }

      const collectedData: unknown = JSON.parse(collectedDataJson)

      if (!check2dArrayOfStringOrNumbers(collectedData)) {
        return unknownRuntimeError(`[GoogleApiSpreadsheetSheetRepository] CollectedData is not valid`)
      }

      await this.googleApiClient.updateSheet(entity.spreadsheetId, entity.sheetNumber, entity.name, collectedData)

      const createVectorDbRecordResult = await this.vectorDbSpreadsheetSheetRepository.update(entity)

      if (createVectorDbRecordResult.isErr()) {
        return createVectorDbRecordResult
      }

      return Ok(entity)
    } catch (e) {
      console.error(`[GoogleApiSpreadsheetSheetRepository] create: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  delete = this.vectorDbSpreadsheetSheetRepository.delete
}
