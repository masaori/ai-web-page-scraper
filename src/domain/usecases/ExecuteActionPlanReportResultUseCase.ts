import { Ok } from '@sniptt/monads'

import { AlreadyExistsError, PromisedResult, UnknownRuntimeError, notFoundError, NotFoundError, unknownRuntimeError } from '../../_shared/error'
import { ActionPlanReportResultRepository } from '../interfaces/repositories/_gen/ActionPlanReportResultRepository'
import { ActionPlanRepository } from '../interfaces/repositories/_gen/ActionPlanRepository'
import { ActionResultClickRepository } from '../interfaces/repositories/_gen/ActionResultClickRepository'
import { ActionResultCollectDataRepository } from '../interfaces/repositories/_gen/ActionResultCollectDataRepository'
import { ActionResultCreateSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionResultCreateSpreadsheetRepository'
import { ActionResultObserveWebPageRepository } from '../interfaces/repositories/_gen/ActionResultObserveWebPageRepository'
import { ActionResultRepository } from '../interfaces/repositories/_gen/ActionResultRepository'
import { ActionResultWithAssociation } from '../entities/_gen/ActionResultWithAssociation'
import { ActionPlan } from '../entities/ActionPlan'
import { ActionResultReportResultExtractor } from '../interfaces/extractors/ActionResultReportResultExtractor'
import { UserRequestWithAssociation } from '../entities/_gen/UserRequestWithAssociation'
import { assertNever } from '../../_shared/types'
import { ActionResultAppendSheetToSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionResultAppendSheetToSpreadsheetRepository'
import { ActionResultReportResultRepository } from '../interfaces/repositories/_gen/ActionResultReportResultRepository'

export class ExecuteActionPlanReportResultUseCase {
  constructor(
    private readonly actionPlanReportResultRepository: ActionPlanReportResultRepository,
    private readonly actionPlanRepository: ActionPlanRepository,
    private readonly actionResultAppendSheetToSpreadsheetRepository: ActionResultAppendSheetToSpreadsheetRepository,
    private readonly actionResultClickRepository: ActionResultClickRepository,
    private readonly actionResultCollectDataRepository: ActionResultCollectDataRepository,
    private readonly actionResultCreateSpreadsheetRepository: ActionResultCreateSpreadsheetRepository,
    private readonly actionResultObserveWebPageRepository: ActionResultObserveWebPageRepository,
    private readonly actionResultReportResultRepository: ActionResultReportResultRepository,
    private readonly actionResultRepository: ActionResultRepository,
    private readonly actionResultReportResultExtractor: ActionResultReportResultExtractor,
  ) {}

  async run(
    actionPlan: ActionPlan,
    userRequest: UserRequestWithAssociation,
  ): PromisedResult<ActionResultWithAssociation, UnknownRuntimeError | AlreadyExistsError | NotFoundError> {
    if (actionPlan.type !== 'reportResult') {
      return unknownRuntimeError(`[ExecuteActionPlanReportResultUseCase] actionPlan.type is not reportResult ${JSON.stringify(actionPlan)}`)
    }

    const getActionPlanReportResultResult = await this.actionPlanReportResultRepository.getByActionPlanId(actionPlan.id)

    if (getActionPlanReportResultResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanReportResultUseCase] actionPlanCreateSpreadsheetRepository.getByActionPlanId ${JSON.stringify(
          getActionPlanReportResultResult.unwrapErr(),
        )}`,
      )
    }

    const actionPlanCreateSpreadsheet = getActionPlanReportResultResult.unwrap()

    if (!actionPlanCreateSpreadsheet) {
      return notFoundError(`[ExecuteActionPlanReportResultUseCase] actionPlanCreateSpreadsheetRepository.getByActionPlanId not found by ${actionPlan.id}`)
    }

    const getAllActionPlanResult = await this.actionPlanRepository.getAllByUserRequestId(userRequest.id)

    if (getAllActionPlanResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanReportResultUseCase] actionPlanRepository.getAllByUserRequestId ${JSON.stringify(getAllActionPlanResult.unwrapErr())}`,
      )
    }

    const actionPlans = getAllActionPlanResult.unwrap()

    const actionResults: ActionResultWithAssociation[] = []

    for (const actionPlan of actionPlans) {
      const getActionResultResult = await this.actionResultRepository.getByActionPlanId(actionPlan.id)

      if (getActionResultResult.isErr()) {
        return unknownRuntimeError(
          `[ExecuteActionPlanReportResultUseCase] actionResultRepository.getByActionPlanId ${JSON.stringify(getActionResultResult.unwrapErr())}`,
        )
      }

      const actionResult = getActionResultResult.unwrap()

      if (!actionResult) {
        continue
      }

      switch (actionResult.type) {
        case 'click': {
          const getActionResultClickResult = await this.actionResultClickRepository.getByActionResultId(actionResult.id)

          if (getActionResultClickResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanReportResultUseCase] actionResultClickRepository.getByActionResultId ${JSON.stringify(
                getActionResultClickResult.unwrapErr(),
              )}`,
            )
          }

          const actionResultClick = getActionResultClickResult.unwrap()

          if (!actionResultClick) {
            return notFoundError(`[ExecuteActionPlanReportResultUseCase] actionResultClickRepository.getByActionResultId not found by ${actionResult.id}`)
          }

          actionResults.push({
            ...actionResult,
            ...actionResultClick,
          })

          break
        }
        case 'collectData': {
          const getActionResultCollectDataResult = await this.actionResultCollectDataRepository.getByActionResultId(actionResult.id)

          if (getActionResultCollectDataResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanReportResultUseCase] actionResultCollectDataRepository.getByActionResultId ${JSON.stringify(
                getActionResultCollectDataResult.unwrapErr(),
              )}`,
            )
          }

          const actionResultCollectData = getActionResultCollectDataResult.unwrap()

          if (!actionResultCollectData) {
            return notFoundError(`[ExecuteActionPlanReportResultUseCase] actionResultCollectDataRepository.getByActionResultId not found by ${actionResult.id}`)
          }

          actionResults.push({
            ...actionResult,
            ...actionResultCollectData,
          })

          break
        }
        case 'createSpreadsheet': {
          const getActionResultCreateSpreadsheetResult = await this.actionResultCreateSpreadsheetRepository.getByActionResultId(actionResult.id)

          if (getActionResultCreateSpreadsheetResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanReportResultUseCase] actionResultCreateSpreadsheetRepository.getByActionResultId ${JSON.stringify(
                getActionResultCreateSpreadsheetResult.unwrapErr(),
              )}`,
            )
          }

          const actionResultCreateSpreadsheet = getActionResultCreateSpreadsheetResult.unwrap()

          if (!actionResultCreateSpreadsheet) {
            return notFoundError(
              `[ExecuteActionPlanReportResultUseCase] actionResultCreateSpreadsheetRepository.getByActionResultId not found by ${actionResult.id}`,
            )
          }

          actionResults.push({
            ...actionResult,
            ...actionResultCreateSpreadsheet,
          })

          break
        }
        case 'appendSheetToSpreadsheet': {
          const getActionResultAppendSheetToSpreadsheetResult = await this.actionResultAppendSheetToSpreadsheetRepository.getByActionResultId(actionResult.id)

          if (getActionResultAppendSheetToSpreadsheetResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanReportResultUseCase] actionResultAppendSheetToSpreadsheetRepository.getByActionResultId ${JSON.stringify(
                getActionResultAppendSheetToSpreadsheetResult.unwrapErr(),
              )}`,
            )
          }

          const actionResultAppendSheetToSpreadsheet = getActionResultAppendSheetToSpreadsheetResult.unwrap()

          if (!actionResultAppendSheetToSpreadsheet) {
            return notFoundError(
              `[ExecuteActionPlanReportResultUseCase] actionResultAppendSheetToSpreadsheetRepository.getByActionResultId not found by ${actionResult.id}`,
            )
          }

          actionResults.push({
            ...actionResult,
            ...actionResultAppendSheetToSpreadsheet,
          })

          break
        }
        case 'observeWebPage': {
          const getActionResultObserveWebPageResult = await this.actionResultObserveWebPageRepository.getByActionResultId(actionResult.id)

          if (getActionResultObserveWebPageResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanReportResultUseCase] actionResultObserveWebPageRepository.getByActionResultId ${JSON.stringify(
                getActionResultObserveWebPageResult.unwrapErr(),
              )}`,
            )
          }

          const actionResultObserveWebPage = getActionResultObserveWebPageResult.unwrap()

          if (!actionResultObserveWebPage) {
            return notFoundError(
              `[ExecuteActionPlanReportResultUseCase] actionResultObserveWebPageRepository.getByActionResultId not found by ${actionResult.id}`,
            )
          }

          actionResults.push({
            ...actionResult,
            ...actionResultObserveWebPage,
          })

          break
        }
        case 'reportResult': {
          const getActionResultReportResultResult = await this.actionResultReportResultRepository.getByActionResultId(actionResult.id)

          if (getActionResultReportResultResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanReportResultUseCase] actionResultReportResultRepository.getByActionResultId ${JSON.stringify(
                getActionResultReportResultResult.unwrapErr(),
              )}`,
            )
          }

          const actionResultReportResult = getActionResultReportResultResult.unwrap()

          if (!actionResultReportResult) {
            return notFoundError(
              `[ExecuteActionPlanReportResultUseCase] actionResultReportResultRepository.getByActionResultId not found by ${actionResult.id}`,
            )
          }

          actionResults.push({
            ...actionResult,
            ...actionResultReportResult,
          })

          break
        }
        default:
          assertNever(actionResult.type)
          throw new Error('Unreachable')
      }
    }

    const extractActionResultReportResultResult = await this.actionResultReportResultExtractor.extractFromUserRequestAndActionResults(
      userRequest,
      actionResults,
    )

    if (extractActionResultReportResultResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanReportResultUseCase] actionResultReportResultExtractor.extractFromUserRequestAndActionResults ${JSON.stringify(
          extractActionResultReportResultResult.unwrapErr(),
        )}`,
      )
    }

    const issueActionResultIdResult = await this.actionResultRepository.issueId()

    if (issueActionResultIdResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanReportResultUseCase] actionResultRepository.issueId ${JSON.stringify(issueActionResultIdResult.unwrapErr())}`,
      )
    }

    const result: ActionResultWithAssociation = {
      id: issueActionResultIdResult.unwrap(),
      actionResultId: issueActionResultIdResult.unwrap(),
      type: 'reportResult',
      actionPlanId: actionPlan.id,
      message: extractActionResultReportResultResult.unwrap().message,
    }

    return Ok(result)
  }
}
