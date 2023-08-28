import { Ok } from '@sniptt/monads'

import { AlreadyExistsError, PromisedResult, UnknownRuntimeError, notFoundError, NotFoundError, unknownRuntimeError } from '../../_shared/error'
import { SpreadsheetRepository } from '../interfaces/repositories/_gen/SpreadsheetRepository'
import { ActionPlanCreateSpreadsheetRepository } from '../interfaces/repositories/_gen/ActionPlanCreateSpreadsheetRepository'
import { ActionResultRepository } from '../interfaces/repositories/_gen/ActionResultRepository'
import { ActionResultWithAssociation } from '../entities/_gen/ActionResultWithAssociation'
import { ActionPlan } from '../entities/ActionPlan'

export class ExecuteActionPlanCreateSpreadsheetUseCase {
  constructor(
    private readonly actionPlanCreateSpreadsheetRepository: ActionPlanCreateSpreadsheetRepository,
    private readonly actionResultRepository: ActionResultRepository,
    private readonly spreadsheetRepository: SpreadsheetRepository,
  ) {}

  async run(actionPlan: ActionPlan): PromisedResult<ActionResultWithAssociation, UnknownRuntimeError | AlreadyExistsError | NotFoundError> {
    if (actionPlan.type !== 'createSpreadsheet') {
      return unknownRuntimeError(`[ExecuteActionPlanCreateSpreadsheetUseCase] actionPlan.type is not createSpreadsheet ${JSON.stringify(actionPlan)}`)
    }

    const getActionPlanCreateSpreadsheetResult = await this.actionPlanCreateSpreadsheetRepository.getByActionPlanId(actionPlan.id)

    if (getActionPlanCreateSpreadsheetResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCreateSpreadsheetUseCase] actionPlanCreateSpreadsheetRepository.getByActionPlanId ${JSON.stringify(
          getActionPlanCreateSpreadsheetResult.unwrapErr(),
        )}`,
      )
    }

    const actionPlanCreateSpreadsheet = getActionPlanCreateSpreadsheetResult.unwrap()

    if (!actionPlanCreateSpreadsheet) {
      return notFoundError(`[ExecuteActionPlanCreateSpreadsheetUseCase] actionPlanCreateSpreadsheetRepository.getByActionPlanId not found by ${actionPlan.id}`)
    }

    const issueSpreadsheetsIdResult = await this.spreadsheetRepository.issueId()

    if (issueSpreadsheetsIdResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCreateSpreadsheetUseCase] spreadsheetRepository.issueId ${JSON.stringify(issueSpreadsheetsIdResult.unwrapErr())}`,
      )
    }

    const createSpreadsheetResult = await this.spreadsheetRepository.create({
      id: issueSpreadsheetsIdResult.unwrap(),
      name: actionPlanCreateSpreadsheet.spreadsheetName,
      description: actionPlanCreateSpreadsheet.spreadsheetDescription,
    })

    if (createSpreadsheetResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCreateSpreadsheetUseCase] spreadsheetRepository.create ${JSON.stringify(createSpreadsheetResult.unwrapErr())}`,
      )
    }

    const spreadsheet = createSpreadsheetResult.unwrap()

    const issueActionResultIdResult = await this.actionResultRepository.issueId()

    if (issueActionResultIdResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCreateSpreadsheetUseCase] actionResultRepository.issueId ${JSON.stringify(issueActionResultIdResult.unwrapErr())}`,
      )
    }

    const result: ActionResultWithAssociation = {
      id: issueActionResultIdResult.unwrap(),
      actionResultId: issueActionResultIdResult.unwrap(),
      type: 'createSpreadsheet',
      actionPlanId: actionPlan.id,
      spreadsheetId: spreadsheet.id,
    }

    return Ok(result)
  }
}
