import { Ok } from '@sniptt/monads'

import { AlreadyExistsError, PromisedResult, UnknownRuntimeError, notFoundError, NotFoundError, unknownRuntimeError } from '../../_shared/error'
import { SpreadsheetRepository } from '../interfaces/repositories/_gen/SpreadsheetRepository'
import { ActionPlanAppendSheetToSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionPlanAppendSheetToSpreadsheetRepository'
import { ActionResultRepository } from '../interfaces/repositories/_gen/ActionResultRepository'
import { CollectedDataRepository } from '../interfaces/repositories/_gen/CollectedDataRepository'
import { SpreadsheetSheetRepository } from '../interfaces/repositories/_gen/SpreadsheetSheetRepository'
import { ActionResultWithAssociation } from '../entities/_gen/ActionResultWithAssociation'
import { ActionPlan } from '../entities/ActionPlan'

export class ExecuteActionPlanAppendSheetToSpreadsheetUseCase {
  constructor(
    private readonly actionPlanAppendSheetToSpreadsheetRepository: ActionPlanAppendSheetToSpreadsheetRepository,
    private readonly actionResultRepository: ActionResultRepository,
    private readonly collectedDataRepository: CollectedDataRepository,
    private readonly spreadsheetRepository: SpreadsheetRepository,
    private readonly spreadsheetSheetRepository: SpreadsheetSheetRepository,
  ) {}

  async run(actionPlan: ActionPlan): PromisedResult<ActionResultWithAssociation, UnknownRuntimeError | AlreadyExistsError | NotFoundError> {
    if (actionPlan.type !== 'appendSheetToSpreadsheet') {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] actionPlan.type is not appendSheetToSpreadsheet ${JSON.stringify(actionPlan)}`,
      )
    }

    const getActionPlanAppendSheetToSpreadsheetResult = await this.actionPlanAppendSheetToSpreadsheetRepository.getByActionPlanId(actionPlan.id)

    if (getActionPlanAppendSheetToSpreadsheetResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] actionPlanAppendSheetToSpreadsheetRepository.getByActionPlanId ${JSON.stringify(
          getActionPlanAppendSheetToSpreadsheetResult.unwrapErr(),
        )}`,
      )
    }

    const actionPlanAppendSheetToSpreadsheet = getActionPlanAppendSheetToSpreadsheetResult.unwrap()

    if (!actionPlanAppendSheetToSpreadsheet) {
      return notFoundError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] actionPlanAppendSheetToSpreadsheetRepository.getByActionPlanId not found by ${actionPlan.id}`,
      )
    }

    const getSpreadsheetRelevantResult = await this.spreadsheetRepository.getRelevant(
      JSON.stringify({
        name: getActionPlanAppendSheetToSpreadsheetResult.unwrap(),
      }),
      1,
    )

    if (getSpreadsheetRelevantResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] spreadsheetRepository.getRelevant ${JSON.stringify(getSpreadsheetRelevantResult.unwrapErr())}`,
      )
    }

    if (getSpreadsheetRelevantResult.unwrap().length === 0) {
      return notFoundError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] spreadsheetRepository.getRelevant not found by ${JSON.stringify({
          name: getActionPlanAppendSheetToSpreadsheetResult.unwrap(),
        })}`,
      )
    }

    const spreadsheetId = getSpreadsheetRelevantResult.unwrap()[0].id

    const getCollectedDataRelevantResult = await this.collectedDataRepository.getRelevant(
      JSON.stringify({
        name: actionPlanAppendSheetToSpreadsheet.collectedDataName,
      }),
      1,
    )

    if (getCollectedDataRelevantResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] collectedDataRepository.getRelevant ${JSON.stringify(getCollectedDataRelevantResult.unwrapErr())}`,
      )
    }

    if (getCollectedDataRelevantResult.unwrap().length === 0) {
      return notFoundError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] collectedDataRepository.getRelevant not found by ${JSON.stringify({
          name: actionPlanAppendSheetToSpreadsheet.collectedDataName,
        })}`,
      )
    }

    const issueSpreadsheetSheetIdResult = await this.spreadsheetSheetRepository.issueId()

    if (issueSpreadsheetSheetIdResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] spreadsheetSheetRepository.issueId ${JSON.stringify(issueSpreadsheetSheetIdResult.unwrapErr())}`,
      )
    }

    const collectedData = getCollectedDataRelevantResult.unwrap()[0]

    const createSpreadsheetSheetResult = await this.spreadsheetSheetRepository.create({
      id: issueSpreadsheetSheetIdResult.unwrap(),
      spreadsheetId,
      name: actionPlanAppendSheetToSpreadsheet.sheetName,
      description: actionPlanAppendSheetToSpreadsheet.sheetDescription,
      collectedDataId: collectedData.id,
      sheetNumber: 0,
    })

    if (createSpreadsheetSheetResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] spreadsheetSheetRepository.create ${JSON.stringify(createSpreadsheetSheetResult.unwrapErr())}`,
      )
    }

    const issueActionResultIdResult = await this.actionResultRepository.issueId()

    if (issueActionResultIdResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] actionResultRepository.issueId ${JSON.stringify(issueActionResultIdResult.unwrapErr())}`,
      )
    }

    const result: ActionResultWithAssociation = {
      id: issueActionResultIdResult.unwrap(),
      actionResultId: issueActionResultIdResult.unwrap(),
      type: 'appendSheetToSpreadsheet',
      actionPlanId: actionPlan.id,
      spreadsheetId,
      collectedDataId: collectedData.id,
      sheetNumber: createSpreadsheetSheetResult.unwrap().sheetNumber,
    }

    return Ok(result)
  }
}
