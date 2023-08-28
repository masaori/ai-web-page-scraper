import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'
import { ActionPlanCollectDataWithAssociation } from '../../entities/_gen/ActionPlanCollectDataWithAssociation'
import { CollectedDataWithAssociation } from '../../entities/_gen/CollectedDataWithAssociation'
import { WebPageElementWithAssociation } from '../../entities/_gen/WebPageElementWithAssociation'

export type CollectedDataExtractor = {
  extractFromWebPageElementsAndActionPlanCollectData: (
    webPageElements: WebPageElementWithAssociation[],
    actionPlanCollectData: ActionPlanCollectDataWithAssociation,
  ) => PromisedResult<CollectedDataWithAssociation, UnknownRuntimeError>
}
