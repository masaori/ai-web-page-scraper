// This file is generated by scripts/generateVectorDbRepositories.ts
import { SpreadsheetSheet } from '../../../../domain/entities/SpreadsheetSheet'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'spreadsheet_sheet'
const isSpreadsheetSheet = (entity: unknown): entity is SpreadsheetSheet => {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'id' in entity &&
    typeof entity.id === 'string' &&
    'spreadsheetId' in entity &&
    typeof entity.spreadsheetId === 'string' &&
    'collectedDataId' in entity &&
    (typeof entity.collectedDataId === 'string' || entity.collectedDataId === null) &&
    'sheetNumber' in entity &&
    typeof entity.sheetNumber === 'number' &&
    'name' in entity &&
    typeof entity.name === 'string' &&
    'description' in entity &&
    typeof entity.description === 'string'
  )
}

export class VectorDbSpreadsheetSheetRepository extends VectorDbRepository<'id', SpreadsheetSheet> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('id', qdrantCollectionName, isSpreadsheetSheet, qdrantClient, openAiClient)
  }

  getById = async (id: string): PromisedResult<SpreadsheetSheet | null, UnknownRuntimeError> => this.getByPrimaryKey(id)

  getAllBySpreadsheetId = async (spreadsheetId: string): PromisedResult<SpreadsheetSheet[], UnknownRuntimeError> => {
    try {
      const scrollResult = await this.qdrantClient.scroll(this.qdrantCollectionName)
      const entities = scrollResult.points
        .map((point) => {
          if (!point.payload) {
            console.error(`[VectorDbSpreadsheetSheetRepository] getAllBySpreadsheetId: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        })
        .filter((entity): entity is SpreadsheetSheet => !!entity && entity.spreadsheetId === spreadsheetId)

      return Ok(entities)
    } catch (e) {
      console.error(`[VectorDbSpreadsheetSheetRepository] getAllBySpreadsheetId: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  getByCollectedDataId = async (collectedDataId: string): PromisedResult<SpreadsheetSheet | null, UnknownRuntimeError> => {
    try {
      const scrollResult = await this.qdrantClient.scroll(this.qdrantCollectionName)
      const entities = scrollResult.points
        .map((point) => {
          if (!point.payload) {
            console.error(`[VectorDbSpreadsheetSheetRepository] getByCollectedDataId: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        })
        .filter((entity): entity is SpreadsheetSheet => !!entity && entity.collectedDataId === collectedDataId)

      return Ok(entities[0] ?? null)
    } catch (e) {
      console.error(`[VectorDbSpreadsheetSheetRepository] getByCollectedDataId: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }
}