import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'
import { UserRequest } from '../../entities/UserRequest'
import { ActionPlanWithAssociation } from '../../entities/_gen/ActionPlanWithAssociation'
import { WebPageWithAssociation } from '../../entities/_gen/WebPageWithAssociation'

export type ActionPlanPredictor = {
  predictByWebPageAndUserRequestAndActionPlans: (
    webPage: WebPageWithAssociation,
    userRequest: UserRequest,
    actionPlans: ActionPlanWithAssociation[],
  ) => PromisedResult<ActionPlanWithAssociation[], UnknownRuntimeError>
}
