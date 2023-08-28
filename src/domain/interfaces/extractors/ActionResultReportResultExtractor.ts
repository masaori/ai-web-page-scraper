import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'
import { ActionResultReportResult } from '../../entities/ActionResultReportResult'
import { UserRequest } from '../../entities/UserRequest'
import { ActionResultWithAssociation } from '../../entities/_gen/ActionResultWithAssociation'

export type ActionResultReportResultExtractor = {
  extractFromUserRequestAndActionResults: (
    userRequest: UserRequest,
    actionResults: ActionResultWithAssociation[],
  ) => PromisedResult<ActionResultReportResult, UnknownRuntimeError>
}
