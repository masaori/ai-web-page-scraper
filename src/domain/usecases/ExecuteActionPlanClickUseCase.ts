import { Ok } from '@sniptt/monads'
import { PromisedResult, UnknownRuntimeError, AlreadyExistsError, NotFoundError, unknownRuntimeError, notFoundError } from '../../_shared/error'
import { ActionPlan } from '../entities/ActionPlan'
import { ActionResultWithAssociation } from '../entities/_gen/ActionResultWithAssociation'
import { ActionPlanClickRepository } from '../interfaces/repositories/_gen/ActionPlanClickRepository'
import { ActionResultRepository } from '../interfaces/repositories/_gen/ActionResultRepository'

export class ExecuteActionPlanClickUseCase {
  constructor(
    private readonly actionPlanClickRepository: ActionPlanClickRepository,
    private readonly actionResultRepository: ActionResultRepository,
  ) {}

  async run(actionPlan: ActionPlan): PromisedResult<ActionResultWithAssociation, UnknownRuntimeError | AlreadyExistsError | NotFoundError> {
    if (actionPlan.type !== 'click') {
      return unknownRuntimeError(`[ExecuteActionPlanClickUseCase] actionPlan.type is not click ${JSON.stringify(actionPlan)}`)
    }

    const getActionPlanClickResult = await this.actionPlanClickRepository.getByActionPlanId(actionPlan.id)

    if (getActionPlanClickResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanClickUseCase] actionPlanClickRepository.getByActionPlanId ${JSON.stringify(getActionPlanClickResult.unwrapErr())}`,
      )
    }

    const actionPlanClick = getActionPlanClickResult.unwrap()

    if (!actionPlanClick) {
      return notFoundError(`[ExecuteActionPlanClickUseCase] actionPlanClickRepository.getByActionPlanId not found by ${actionPlan.id}`)
    }

    // TODO

    const issueActionResultIdResult = await this.actionResultRepository.issueId()

    if (issueActionResultIdResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanAppendSheetToSpreadsheetUseCase] actionResultRepository.issueId ${JSON.stringify(issueActionResultIdResult.unwrapErr())}`,
      )
    }

    const result: ActionResultWithAssociation = {
      id: issueActionResultIdResult.unwrap(),
      actionResultId: issueActionResultIdResult.unwrap(),
      type: 'click',
      actionPlanId: actionPlan.id,
      result: 'done',
    }

    return Ok(result)
  }
}
