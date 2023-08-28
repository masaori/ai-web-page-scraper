import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'
import { ActionPlanWithAssociation } from '../../entities/_gen/ActionPlanWithAssociation'
import { UserRequestWithAssociation } from '../../entities/_gen/UserRequestWithAssociation'
import { WebPageWithAssociation } from '../../entities/_gen/WebPageWithAssociation'

export type ActionPlanExtractor = {
  extractFromWebPageAndUserRequestAndActionPlans: (
    webPage: WebPageWithAssociation,
    userRequest: UserRequestWithAssociation,
    actionPlans: ActionPlanWithAssociation[],
  ) => PromisedResult<ActionPlanWithAssociation[], UnknownRuntimeError>
}
