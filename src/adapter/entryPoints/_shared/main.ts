import path from 'path'

import { ExecuteActionPlanAppendSheetToSpreadsheetUseCase } from '../../../domain/usecases/ExecuteActionPlanAppendSheetToSpreadsheetUseCase'
import { ExecuteActionPlanClickUseCase } from '../../../domain/usecases/ExecuteActionPlanClickUseCase'
import { ExecuteActionPlanCollectDataUseCase } from '../../../domain/usecases/ExecuteActionPlanCollectDataUseCase'
import { ExecuteActionPlanCreateSpreadsheetUseCase } from '../../../domain/usecases/ExecuteActionPlanCreateSpreadsheetUseCase'
import { ExecuteActionPlanReportResultUseCase } from '../../../domain/usecases/ExecuteActionPlanReportResultUseCase'
import { ExecuteSimpleDataCollectTaskUseCase } from '../../../domain/usecases/ExecuteSimpleDataCollectTaskUseCase'
import { GoogleApiClient } from '../../_shared/GoogleApiClient'
import { GoogleCloudVisionClient } from '../../_shared/GoogleCloudVisionClient'
import { OpenAiClient } from '../../_shared/OpenAiClient'
import { PuppeteerClient } from '../../_shared/PuppeteerClient'
import { QdrantClient } from '../../_shared/QdrantClient'
import { VectorDbActionPlanAppendSheetToSpreadsheetRepository } from '../../repositories/vectorDb/_gen/VectorDbActionPlanAppendSheetToSpreadsheetRepository'
import { VectorDbActionPlanClickRepository } from '../../repositories/vectorDb/_gen/VectorDbActionPlanClickRepository'
import { VectorDbActionPlanCollectDataRepository } from '../../repositories/vectorDb/_gen/VectorDbActionPlanCollectDataRepository'
import { VectorDbActionPlanCreateSpreadsheetRepository } from '../../repositories/vectorDb/_gen/VectorDbActionPlanCreateSpreadsheetRepository'
import { VectorDbActionPlanReportResultRepository } from '../../repositories/vectorDb/_gen/VectorDbActionPlanReportResultRepository'
import { VectorDbActionPlanRepository } from '../../repositories/vectorDb/_gen/VectorDbActionPlanRepository'
import { VectorDbActionResultAppendSheetToSpreadsheetRepository } from '../../repositories/vectorDb/_gen/VectorDbActionResultAppendSheetToSpreadsheetRepository'
import { VectorDbActionResultClickRepository } from '../../repositories/vectorDb/_gen/VectorDbActionResultClickRepository'
import { VectorDbActionResultCollectDataRepository } from '../../repositories/vectorDb/_gen/VectorDbActionResultCollectDataRepository'
import { VectorDbActionResultCreateSpreadsheetRepository } from '../../repositories/vectorDb/_gen/VectorDbActionResultCreateSpreadsheetRepository'
import { VectorDbActionResultObserveWebPageRepository } from '../../repositories/vectorDb/_gen/VectorDbActionResultObserveWebPageRepository'
import { VectorDbActionResultReportResultRepository } from '../../repositories/vectorDb/_gen/VectorDbActionResultReportResultRepository'
import { VectorDbActionResultRepository } from '../../repositories/vectorDb/_gen/VectorDbActionResultRepository'
import { VectorDbCollectedDataRepository } from '../../repositories/vectorDb/_gen/VectorDbCollectedDataRepository'
import { VectorDbSpreadsheetRepository } from '../../repositories/vectorDb/_gen/VectorDbSpreadsheetRepository'
import { VectorDbSpreadsheetSheetRepository } from '../../repositories/vectorDb/_gen/VectorDbSpreadsheetSheetRepository'
import { GoogleApiSpreadsheetRepository } from '../../repositories/googleApi/GoogleApiSpreadsheetRepository'
import { GoogleApiSpreadsheetSheetRepository } from '../../repositories/googleApi/GoogleApiSpreadsheetSheetRepository'
import { LlmActionPlanExtractor } from '../../extractors/LlmActionPlanExtractor'
import { LlmActionResultReportResultExtractor } from '../../extractors/LlmActionResultReportResultExtractor'
import { LlmCollectedDataExtractor } from '../../extractors/LlmCollectedDataExtractor'
import { LlmUserRequestExtractor } from '../../extractors/LlmUserRequestExtractor'
import { SimpleOcrWebPageExtractor } from '../../extractors/SimpleOcrWebPageExtractor'
import { VectorDbActionPlanObserveWebPageRepository } from '../../repositories/vectorDb/_gen/VectorDbActionPlanObserveWebPageRepository'
import { initializeVectorDb } from '../../repositories/vectorDb/_shared/_gen/initializeVectorDb'
import { VectorDbWebPageElementPageLinkRepository } from '../../repositories/vectorDb/_gen/VectorDbWebPageElementPageLinkRepository'
import { VectorDbWebPageElementRepository } from '../../repositories/vectorDb/_gen/VectorDbWebPageElementRepository'
import { VectorDbWebPageElementTextRepository } from '../../repositories/vectorDb/_gen/VectorDbWebPageElementTextRepository'
import { VectorDbWebPageRepository } from '../../repositories/vectorDb/_gen/VectorDbWebPageRepository'
import { VectorDbUserRequestRepository } from '../../repositories/vectorDb/_gen/VectorDbUserRequestRepository'

export const main = async (userMessage: string) => {
  await initializeVectorDb()

  const absoluteScreenshotDirectoryPath = path.resolve('./tmp')

  console.log({
    absoluteScreenshotDirectoryPath,
  })

  const googleApiClient = new GoogleApiClient()
  const googleCloudVisionClient = new GoogleCloudVisionClient()
  const openAiClient = new OpenAiClient()
  const puppeteerClient = new PuppeteerClient(absoluteScreenshotDirectoryPath)
  const qdrantClient = new QdrantClient()

  const actionPlanAppendSheetToSpreadsheetRepository = new VectorDbActionPlanAppendSheetToSpreadsheetRepository(qdrantClient, openAiClient)
  const actionPlanClickRepository = new VectorDbActionPlanClickRepository(qdrantClient, openAiClient)
  const actionPlanCollectDataRepository = new VectorDbActionPlanCollectDataRepository(qdrantClient, openAiClient)
  const actionPlanCreateSpreadsheetRepository = new VectorDbActionPlanCreateSpreadsheetRepository(qdrantClient, openAiClient)
  const actionPlanObserveWebPageRepository = new VectorDbActionPlanObserveWebPageRepository(qdrantClient, openAiClient)
  const actionPlanReportResultRepository = new VectorDbActionPlanReportResultRepository(qdrantClient, openAiClient)
  const actionPlanRepository = new VectorDbActionPlanRepository(qdrantClient, openAiClient)
  const actionResultAppendSheetToSpreadsheetRepository = new VectorDbActionResultAppendSheetToSpreadsheetRepository(qdrantClient, openAiClient)
  const actionResultClickRepository = new VectorDbActionResultClickRepository(qdrantClient, openAiClient)
  const actionResultCollectDataRepository = new VectorDbActionResultCollectDataRepository(qdrantClient, openAiClient)
  const actionResultCreateSpreadsheetRepository = new VectorDbActionResultCreateSpreadsheetRepository(qdrantClient, openAiClient)
  const actionResultObserveWebPageRepository = new VectorDbActionResultObserveWebPageRepository(qdrantClient, openAiClient)
  const actionResultRepository = new VectorDbActionResultRepository(qdrantClient, openAiClient)
  const collectedDataRepository = new VectorDbCollectedDataRepository(qdrantClient, openAiClient)
  const spreadsheetRepository = new GoogleApiSpreadsheetRepository(googleApiClient, new VectorDbSpreadsheetRepository(qdrantClient, openAiClient))
  const spreadsheetSheetRepository = new GoogleApiSpreadsheetSheetRepository(
    googleApiClient,
    new VectorDbSpreadsheetSheetRepository(qdrantClient, openAiClient),
    collectedDataRepository,
  )
  const userRequestRepository = new VectorDbUserRequestRepository(qdrantClient, openAiClient)
  const actionResultReportResultRepository = new VectorDbActionResultReportResultRepository(qdrantClient, openAiClient)
  const webPageRepository = new VectorDbWebPageRepository(qdrantClient, openAiClient)
  const webPageElementRepository = new VectorDbWebPageElementRepository(qdrantClient, openAiClient)
  const webPageElementPageLinkRepository = new VectorDbWebPageElementPageLinkRepository(qdrantClient, openAiClient)
  const webPageElementTextRepository = new VectorDbWebPageElementTextRepository(qdrantClient, openAiClient)
  const actionPlanExtractor = new LlmActionPlanExtractor(openAiClient)
  const collectedDataExtractor = new LlmCollectedDataExtractor(openAiClient)
  const userRequestExtractor = new LlmUserRequestExtractor(openAiClient)
  const webPageExtractor = new SimpleOcrWebPageExtractor(puppeteerClient, googleCloudVisionClient)
  const actionResultReportResultExtractor = new LlmActionResultReportResultExtractor(openAiClient)

  const executeActionPlanAppendSheetToSpreadsheetUseCase = new ExecuteActionPlanAppendSheetToSpreadsheetUseCase(
    actionPlanAppendSheetToSpreadsheetRepository,
    actionResultRepository,
    collectedDataRepository,
    spreadsheetRepository,
    spreadsheetSheetRepository,
  )
  const executeActionPlanClickUseCase = new ExecuteActionPlanClickUseCase(actionPlanClickRepository, actionResultRepository)
  const executeActionPlanCollectDataUseCase = new ExecuteActionPlanCollectDataUseCase(
    actionPlanCollectDataRepository,
    actionResultRepository,
    collectedDataRepository,
    webPageRepository,
    webPageElementRepository,
    webPageElementTextRepository,
    webPageElementPageLinkRepository,
    collectedDataExtractor,
  )
  const executeActionPlanCreateSpreadsheetUseCase = new ExecuteActionPlanCreateSpreadsheetUseCase(
    actionPlanCreateSpreadsheetRepository,
    actionResultRepository,
    spreadsheetRepository,
  )
  const executeActionPlanReportResultUseCase = new ExecuteActionPlanReportResultUseCase(
    actionPlanReportResultRepository,
    actionPlanRepository,
    actionResultAppendSheetToSpreadsheetRepository,
    actionResultClickRepository,
    actionResultCollectDataRepository,
    actionResultCreateSpreadsheetRepository,
    actionResultObserveWebPageRepository,
    actionResultReportResultRepository,
    actionResultRepository,
    actionResultReportResultExtractor,
  )

  const executeSimpleDataCollectTaskUseCase = new ExecuteSimpleDataCollectTaskUseCase(
    userRequestRepository,
    actionPlanRepository,
    actionPlanAppendSheetToSpreadsheetRepository,
    actionPlanClickRepository,
    actionPlanCollectDataRepository,
    actionPlanCreateSpreadsheetRepository,
    actionPlanObserveWebPageRepository,
    actionPlanReportResultRepository,
    actionResultRepository,
    actionResultAppendSheetToSpreadsheetRepository,
    actionResultClickRepository,
    actionResultCollectDataRepository,
    actionResultCreateSpreadsheetRepository,
    actionResultObserveWebPageRepository,
    actionResultReportResultRepository,
    webPageRepository,
    webPageElementRepository,
    webPageElementTextRepository,
    webPageElementPageLinkRepository,
    actionPlanExtractor,
    userRequestExtractor,
    webPageExtractor,
    executeActionPlanAppendSheetToSpreadsheetUseCase,
    executeActionPlanClickUseCase,
    executeActionPlanCollectDataUseCase,
    executeActionPlanCreateSpreadsheetUseCase,
    executeActionPlanReportResultUseCase,
  )

  const runExecuteSimpleDataCollectTaskUseCaseResult = await executeSimpleDataCollectTaskUseCase.run(userMessage)

  if (runExecuteSimpleDataCollectTaskUseCaseResult.isErr()) {
    console.error(runExecuteSimpleDataCollectTaskUseCaseResult.unwrapErr())

    return
  }
}
