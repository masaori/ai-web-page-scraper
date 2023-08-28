import { AlreadyExistsError, PromisedResult, UnknownRuntimeError, NotFoundError, unknownRuntimeError } from '../../_shared/error'
import { assertNever } from '../../_shared/types'
import { ExecuteActionPlanAppendSheetToSpreadsheetUseCase } from './ExecuteActionPlanAppendSheetToSpreadsheetUseCase'
import { ExecuteActionPlanClickUseCase } from './ExecuteActionPlanClickUseCase'
import { ExecuteActionPlanCollectDataUseCase } from './ExecuteActionPlanCollectDataUseCase'
import { ExecuteActionPlanCreateSpreadsheetUseCase } from './ExecuteActionPlanCreateSpreadsheetUseCase'
import { ActionPlanExtractor } from '../interfaces/extractors/ActionPlanExtractor'
import { UserRequestExtractor } from '../interfaces/extractors/UserRequestExtractor'
import { WebPageExtractor } from '../interfaces/extractors/WebPageExtractor'
import { Err, Ok } from '@sniptt/monads'
import { ActionResultWithAssociation } from '../entities/_gen/ActionResultWithAssociation'
import { ExecuteActionPlanReportResultUseCase } from './ExecuteActionPlanReportResultUseCase'
import { ActionResultReportResult } from '../entities/ActionResultReportResult'
import { ActionResultRepository } from '../interfaces/repositories/_gen/ActionResultRepository'
import { ActionResultAppendSheetToSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionResultAppendSheetToSpreadsheetRepository'
import { ActionResultClickRepository } from '../interfaces/repositories/_gen/ActionResultClickRepository'
import { ActionResultCollectDataRepository } from '../interfaces/repositories/_gen/ActionResultCollectDataRepository'
import { ActionResultCreateSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionResultCreateSpreadsheetRepository'
import { ActionResultObserveWebPageRepository } from '../interfaces/repositories/_gen/ActionResultObserveWebPageRepository'
import { ActionResultReportResultRepository } from '../interfaces/repositories/_gen/ActionResultReportResultRepository'
import { ActionPlanRepository } from '../interfaces/repositories/_gen/ActionPlanRepository'
import { ActionPlanAppendSheetToSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionPlanAppendSheetToSpreadsheetRepository'
import { ActionPlanClickRepository } from '../interfaces/repositories/_gen/ActionPlanClickRepository'
import { ActionPlanCollectDataRepository } from '../interfaces/repositories/_gen/ActionPlanCollectDataRepository'
import { ActionPlanCreateSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionPlanCreateSpreadsheetRepository'
import { ActionPlanObserveWebPageRepository } from '../interfaces/repositories/_gen/ActionPlanObserveWebPageRepository'
import { ActionPlanReportResultRepository } from '../interfaces/repositories/_gen/ActionPlanReportResultRepository'
import { WebPageRepository } from '../interfaces/repositories/_gen/WebPageRepository'
import { WebPageElementRepository } from '../interfaces/repositories/_gen/WebPageElementRepository'
import { WebPageElementPageLinkRepository } from '../interfaces/repositories/_gen/WebPageElementPageLinkRepository'
import { WebPageElementTextRepository } from '../interfaces/repositories/_gen/WebPageElementTextRepository'
import { UserRequestRepository } from '../interfaces/repositories/_gen/UserRequestRepository'

export class ExecuteSimpleDataCollectTaskUseCase {
  constructor(
    private readonly userRequesetRepository: UserRequestRepository,
    private readonly actionPlanRepository: ActionPlanRepository,
    private readonly actionPlanAppendSheetToSpreadsheetRepository: ActionPlanAppendSheetToSpreadsheetRepository,
    private readonly actionPlanClickRepository: ActionPlanClickRepository,
    private readonly actionPlanCollectDataRepository: ActionPlanCollectDataRepository,
    private readonly actionPlanCreateSpreadsheetRepository: ActionPlanCreateSpreadsheetRepository,
    private readonly actionPlanObserveWebPageRepository: ActionPlanObserveWebPageRepository,
    private readonly actionPlanReportResultRepository: ActionPlanReportResultRepository,
    private readonly actionResultRepository: ActionResultRepository,
    private readonly actionResultAppendSheetToSpreadsheetRepository: ActionResultAppendSheetToSpreadsheetRepository,
    private readonly actionResultClickRepository: ActionResultClickRepository,
    private readonly actionResultCollectDataRepository: ActionResultCollectDataRepository,
    private readonly actionResultCreateSpreadsheetRepository: ActionResultCreateSpreadsheetRepository,
    private readonly actionResultObserveWebPageRepository: ActionResultObserveWebPageRepository,
    private readonly actionResultReportResultRepository: ActionResultReportResultRepository,
    private readonly webPageRepository: WebPageRepository,
    private readonly webPageElementRepository: WebPageElementRepository,
    private readonly webPageElementTextRepository: WebPageElementTextRepository,
    private readonly webPageElementPageLinkRepository: WebPageElementPageLinkRepository,
    private readonly actionPlanExtractor: ActionPlanExtractor,
    private readonly userRequestExtractor: UserRequestExtractor,
    private readonly webPageExtractor: WebPageExtractor,
    private readonly executeActionPlanAppendSheetToSpreadsheetUseCase: ExecuteActionPlanAppendSheetToSpreadsheetUseCase,
    private readonly executeActionPlanClickUseCase: ExecuteActionPlanClickUseCase,
    private readonly executeActionPlanCollectDataUseCase: ExecuteActionPlanCollectDataUseCase,
    private readonly executeActionPlanCreateSpreadsheetUseCase: ExecuteActionPlanCreateSpreadsheetUseCase,
    private readonly executeActionPlanReportResultUseCase: ExecuteActionPlanReportResultUseCase,
  ) {}

  async run(userMessage: string): PromisedResult<ActionResultReportResult, UnknownRuntimeError | AlreadyExistsError | NotFoundError> {
    const extractUserRequestResult = await this.userRequestExtractor.extractFromUserMessage(userMessage)

    if (extractUserRequestResult.isErr()) {
      return Err(extractUserRequestResult.unwrapErr())
    }

    const userRequest = extractUserRequestResult.unwrap()

    const createUserRequestResult = await this.userRequesetRepository.create(userRequest)

    if (createUserRequestResult.isErr()) {
      return Err(createUserRequestResult.unwrapErr())
    }

    console.log('==== User Resuest ====')
    console.log(JSON.stringify(userRequest, null, 2))

    const extractWebPageResult = await this.webPageExtractor.extractFromUrl(userRequest.url)

    if (extractWebPageResult.isErr()) {
      return Err(extractWebPageResult.unwrapErr())
    }

    const webPage = extractWebPageResult.unwrap()

    const createWebPageResult = await this.webPageRepository.create({
      id: webPage.id,
      url: webPage.url,
      height: webPage.height,
      width: webPage.width,
    }) // TODO: implemente normalizer which culls unnecessary fields and use it in VectorDbRepository

    if (createWebPageResult.isErr()) {
      return Err(createWebPageResult.unwrapErr())
    }

    await Promise.all(
      webPage.webPageElements.map(async (webPageElement) => {
        const createWebPageElementResult = await this.webPageElementRepository.create({
          id: webPageElement.id,
          webPageId: webPageElement.webPageId,
          type: webPageElement.type,
          order: webPageElement.order,
          top: webPageElement.top,
          left: webPageElement.left,
          height: webPageElement.height,
          width: webPageElement.width,
        }) // TODO: implemente normalizer which culls unnecessary fields and use it in VectorDbRepository

        if (createWebPageElementResult.isErr()) {
          return Err(createWebPageElementResult.unwrapErr())
        }

        switch (webPageElement.type) {
          case 'text': {
            console.log(`create WebPageElementText: ${JSON.stringify(webPageElement.webPageElementId)}`)

            const createWebPageElementTextResult = await this.webPageElementTextRepository.create(webPageElement)

            if (createWebPageElementTextResult.isErr()) {
              return Err(createWebPageElementTextResult.unwrapErr())
            }

            break
          }
          case 'pageLink': {
            const createWebPageElementPageLinkResult = await this.webPageElementPageLinkRepository.create(webPageElement)

            if (createWebPageElementPageLinkResult.isErr()) {
              return Err(createWebPageElementPageLinkResult.unwrapErr())
            }

            break
          }
          case null: {
            break
          }
          default:
            assertNever(webPageElement)

            return unknownRuntimeError(`[ExecuteSimpleDataCollectTaskUseCase] webPageElement.type is not text or pageLink ${JSON.stringify(webPageElement)}`)
        }
      }),
    )

    console.log('==== Web Page ====')
    console.log(JSON.stringify({ ...webPage, webPageElements: webPage.webPageElements, elementCount: webPage.webPageElements.length }, null, 2))

    const extractActionPlansResult = await this.actionPlanExtractor.extractFromWebPageAndUserRequestAndActionPlans(
      webPage,
      { ...userRequest, actionPlans: [] },
      [],
    )

    if (extractActionPlansResult.isErr()) {
      return Err(extractActionPlansResult.unwrapErr())
    }

    const actionPlans = extractActionPlansResult.unwrap()

    await Promise.all(
      actionPlans.map(async (actionPlan) => {
        const createActionPlanResult = await this.actionPlanRepository.create(actionPlan)

        if (createActionPlanResult.isErr()) {
          return Err(createActionPlanResult.unwrapErr())
        }

        switch (actionPlan.type) {
          case 'appendSheetToSpreadsheet': {
            const createResult = await this.actionPlanAppendSheetToSpreadsheetRepository.create(actionPlan)

            if (createResult.isErr()) {
              return Err(createResult.unwrapErr())
            }

            break
          }
          case 'click': {
            const createResult = await this.actionPlanClickRepository.create(actionPlan)

            if (createResult.isErr()) {
              return Err(createResult.unwrapErr())
            }

            break
          }
          case 'collectData': {
            const createResult = await this.actionPlanCollectDataRepository.create(actionPlan)

            if (createResult.isErr()) {
              return Err(createResult.unwrapErr())
            }

            break
          }
          case 'createSpreadsheet': {
            const createResult = await this.actionPlanCreateSpreadsheetRepository.create(actionPlan)

            if (createResult.isErr()) {
              return Err(createResult.unwrapErr())
            }

            break
          }
          case 'observeWebPage': {
            const createResult = await this.actionPlanObserveWebPageRepository.create(actionPlan)

            if (createResult.isErr()) {
              return Err(createResult.unwrapErr())
            }

            break
          }
          case 'reportResult': {
            const createResult = await this.actionPlanReportResultRepository.create(actionPlan)

            if (createResult.isErr()) {
              return Err(createResult.unwrapErr())
            }

            break
          }
          default:
            assertNever(actionPlan)
            throw new Error('Unreachable')
        }
      }),
    )

    console.log('==== Action Plans ====')
    console.log(JSON.stringify(actionPlans, null, 2))

    for (const actionPlan of actionPlans) {
      console.log(`==== Execute Action Plan: ${JSON.stringify(actionPlan)} ====`)

      let actionResult: ActionResultWithAssociation | null = null

      switch (actionPlan.type) {
        case 'appendSheetToSpreadsheet': {
          const runResult = await this.executeActionPlanAppendSheetToSpreadsheetUseCase.run(actionPlan)

          if (runResult.isErr()) {
            return Err(runResult.unwrapErr())
          }

          actionResult = runResult.unwrap()

          if (actionResult.type !== 'appendSheetToSpreadsheet') {
            return unknownRuntimeError(
              `[ExecuteSimpleDataCollectTaskUseCase] actionResult.type is not appendSheetToSpreadsheet ${JSON.stringify(actionResult)}`,
            )
          }

          const createResult = await this.actionResultAppendSheetToSpreadsheetRepository.create(actionResult)

          if (createResult.isErr()) {
            return Err(createResult.unwrapErr())
          }

          break
        }
        case 'click': {
          const runResult = await this.executeActionPlanClickUseCase.run(actionPlan)

          if (runResult.isErr()) {
            return Err(runResult.unwrapErr())
          }

          actionResult = runResult.unwrap()

          if (actionResult.type !== 'click') {
            return unknownRuntimeError(`[ExecuteSimpleDataCollectTaskUseCase] actionResult.type is not click ${JSON.stringify(actionResult)}`)
          }

          const createResult = await this.actionResultClickRepository.create(actionResult)

          if (createResult.isErr()) {
            return Err(createResult.unwrapErr())
          }

          break
        }
        case 'collectData': {
          const runResult = await this.executeActionPlanCollectDataUseCase.run(actionPlan)

          if (runResult.isErr()) {
            return Err(runResult.unwrapErr())
          }
          actionResult = runResult.unwrap()

          if (actionResult.type !== 'collectData') {
            return unknownRuntimeError(`[ExecuteSimpleDataCollectTaskUseCase] actionResult.type is not collectData ${JSON.stringify(actionResult)}`)
          }

          const createResult = await this.actionResultCollectDataRepository.create(actionResult)

          if (createResult.isErr()) {
            return Err(createResult.unwrapErr())
          }

          break
        }
        case 'createSpreadsheet': {
          const runResult = await this.executeActionPlanCreateSpreadsheetUseCase.run(actionPlan)

          if (runResult.isErr()) {
            return Err(runResult.unwrapErr())
          }
          actionResult = runResult.unwrap()

          if (actionResult.type !== 'createSpreadsheet') {
            return unknownRuntimeError(`[ExecuteSimpleDataCollectTaskUseCase] actionResult.type is not createSpreadsheet ${JSON.stringify(actionResult)}`)
          }

          const createResult = await this.actionResultCreateSpreadsheetRepository.create(actionResult)

          if (createResult.isErr()) {
            return Err(createResult.unwrapErr())
          }

          break
        }
        case 'observeWebPage':
          // TODO:
          // return this.executeActionPlanObserveWebPageUseCase.run(actionPlan)
          break
        case 'reportResult':
          // DO NOTHING
          break
        default:
          assertNever(actionPlan)
          throw new Error('Unreachable')
      }

      if (actionResult) {
        const createActionResultResult = await this.actionResultRepository.create(actionResult)

        if (createActionResultResult.isErr()) {
          return Err(createActionResultResult.unwrapErr())
        }
      }

      if (actionPlan.type === 'reportResult') {
        const runResult = await this.executeActionPlanReportResultUseCase.run(actionPlan, {
          ...userRequest,
          actionPlans,
        })

        if (runResult.isErr()) {
          return Err(runResult.unwrapErr())
        }

        const actionResult = runResult.unwrap()

        if (actionResult.type !== 'reportResult') {
          return unknownRuntimeError(`[ExecuteSimpleDataCollectTaskUseCase] actionResult.type is not reportResult ${JSON.stringify(actionResult)}`)
        }

        console.log('')
        console.log('')
        console.log('==== Result ====')
        console.log(actionResult.message)
        console.log('')
        console.log('')

        return Ok(actionResult)
      }
    }

    const result: ActionResultReportResult = {
      actionResultId: '',
      type: 'reportResult',
      message: 'Finished without any output.',
    }

    console.log('')
    console.log('')
    console.log('==== Result ====')
    console.log(result.message)
    console.log('')
    console.log('')

    return Ok(result)
  }
}
