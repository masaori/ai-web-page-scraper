import { v4 as uuid } from 'uuid'

import { GoogleApiClient } from '../../_shared/GoogleApiClient'
import { VectorDbCollectedDataRepository } from '../vectorDb/_gen/VectorDbCollectedDataRepository'
import { VectorDbSpreadsheetSheetRepository } from '../vectorDb/_gen/VectorDbSpreadsheetSheetRepository'
import { OpenAiClient } from '../../_shared/OpenAiClient'
import { QdrantClient } from '../../_shared/QdrantClient'
import { GoogleApiSpreadsheetSheetRepository } from './GoogleApiSpreadsheetSheetRepository'
import { initializeVectorDb } from '../vectorDb/_shared/_gen/initializeVectorDb'

beforeAll(async () => {
  try {
    await initializeVectorDb()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})

describe('GoogleApiSpreadsheetSheetRepository', () => {
  test(
    'create',
    async () => {
      const googleApiClient = new GoogleApiClient()
      const qdrantClient = new QdrantClient()
      const openAiClient = new OpenAiClient()
      const vectorDbSpreadsheetSheetRepository = new VectorDbSpreadsheetSheetRepository(qdrantClient, openAiClient)
      const vectorDbCollectDataRepository = new VectorDbCollectedDataRepository(qdrantClient, openAiClient)

      const googleApiSpreadsheetSheetRepository = new GoogleApiSpreadsheetSheetRepository(
        googleApiClient,
        vectorDbSpreadsheetSheetRepository,
        vectorDbCollectDataRepository,
      )

      // precondition
      const collectedDataId = uuid().toString()

      const createCollectedDataResult = await vectorDbCollectDataRepository.create({
        id: collectedDataId,
        name: 'name',
        description: 'description',
        webPageUrl: 'webPageUrl',
        dataJson: JSON.stringify([
          ['a', 'b', 'c'],
          [1, 2, 3],
        ]),
      })

      if (createCollectedDataResult.isErr()) {
        throw new Error(createCollectedDataResult.unwrapErr().message)
      }

      // test

      const issuIdResult = await googleApiSpreadsheetSheetRepository.issueId()

      if (issuIdResult.isErr()) {
        throw new Error(issuIdResult.unwrapErr().message)
      }

      const createResult = await googleApiSpreadsheetSheetRepository.create({
        id: issuIdResult.unwrap(),
        spreadsheetId: '1xS_8rzaBq0RqJsh5qXrdKPnHJbNRpc7Gt0iP2CuK2OA',
        name: 'name',
        sheetNumber: 0,
        collectedDataId,
        description: 'description',
      })

      if (createResult.isErr()) {
        throw new Error(createResult.unwrapErr().message)
      }

      expect(createResult.unwrap()).not.toBeNull()
    },
    10 * 60 * 1000,
  )
})
