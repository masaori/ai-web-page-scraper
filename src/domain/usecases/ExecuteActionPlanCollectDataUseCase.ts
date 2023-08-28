import { Ok } from '@sniptt/monads'

import { AlreadyExistsError, PromisedResult, UnknownRuntimeError, notFoundError, NotFoundError, unknownRuntimeError } from '../../_shared/error'
import { CollectedDataExtractor } from '../interfaces/extractors/CollectedDataExtractor'
import { ActionPlanCollectDataRepository } from '../interfaces/repositories/_gen/ActionPlanCollectDataRepository'
import { ActionResultRepository } from '../interfaces/repositories/_gen/ActionResultRepository'
import { CollectedDataRepository } from '../interfaces/repositories/_gen/CollectedDataRepository'
import { ActionResultWithAssociation } from '../entities/_gen/ActionResultWithAssociation'
import { ActionPlan } from '../entities/ActionPlan'
import { WebPageElementRepository } from '../interfaces/repositories/_gen/WebPageElementRepository'
import { WebPageElementTextRepository } from '../interfaces/repositories/_gen/WebPageElementTextRepository'
import { WebPageElementPageLinkRepository } from '../interfaces/repositories/_gen/WebPageElementPageLinkRepository'
import { assertNever } from '../../_shared/types'
import { WebPageElementWithAssociation } from '../entities/_gen/WebPageElementWithAssociation'
import { WebPageRepository } from '../interfaces/repositories/_gen/WebPageRepository'

export class ExecuteActionPlanCollectDataUseCase {
  constructor(
    private readonly actionPlanCollectDataRepository: ActionPlanCollectDataRepository,
    private readonly actionResultRepository: ActionResultRepository,
    private readonly collectedDataRepository: CollectedDataRepository,
    private readonly webPageRepository: WebPageRepository,
    private readonly webPageElementRepository: WebPageElementRepository,
    private readonly webPageElementTextRepository: WebPageElementTextRepository,
    private readonly webPageElementPageLinkRepository: WebPageElementPageLinkRepository,
    private readonly collectedDataExtractor: CollectedDataExtractor,
  ) {}

  async run(actionPlan: ActionPlan): PromisedResult<ActionResultWithAssociation, UnknownRuntimeError | AlreadyExistsError | NotFoundError> {
    if (actionPlan.type !== 'collectData') {
      return unknownRuntimeError(`[ExecuteActionPlanCollectDataUseCase] actionPlan.type is not collectData ${JSON.stringify(actionPlan)}`)
    }

    const getActionPlanCollectDataResult = await this.actionPlanCollectDataRepository.getByActionPlanId(actionPlan.id)

    if (getActionPlanCollectDataResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCollectDataUseCase] actionPlanCollectDataRepository.getByActionPlanId ${JSON.stringify(getActionPlanCollectDataResult.unwrapErr())}`,
      )
    }

    const actionPlanCollectData = getActionPlanCollectDataResult.unwrap()

    if (!actionPlanCollectData) {
      return notFoundError(`[ExecuteActionPlanCollectDataUseCase] actionPlanCollectDataRepository.getByActionPlanId not found by ${actionPlan.id}`)
    }

    const getWebPageResult = await this.webPageRepository.getRelevant(
      JSON.stringify({
        url: actionPlanCollectData.webPageUrl,
      }),
      1,
    )

    if (getWebPageResult.isErr()) {
      return unknownRuntimeError(`[ExecuteActionPlanCollectDataUseCase] webPageRepository.getRelevant ${JSON.stringify(getWebPageResult.unwrapErr())}`)
    }

    const webPage = getWebPageResult.unwrap()[0]

    const getWebPageElementsResult = await this.webPageElementRepository.getAllByWebPageId(webPage.id)

    if (getWebPageElementsResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCollectDataUseCase] webPageElementRepository.getRelevant ${JSON.stringify(getWebPageElementsResult.unwrapErr())}`,
      )
    }

    const webPageElements = getWebPageElementsResult.unwrap()

    const webPageElementWithAssociations: WebPageElementWithAssociation[] = []

    for (const webPageElement of webPageElements) {
      switch (webPageElement.type) {
        case 'text': {
          const getWebPageElementTextResult = await this.webPageElementTextRepository.getByWebPageElementId(webPageElement.id)

          if (getWebPageElementTextResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanCollectDataUseCase] webPageElementTextRepository.getByWebPageElementId ${JSON.stringify(
                getWebPageElementTextResult.unwrapErr(),
              )}`,
            )
          }

          const webPageElementText = getWebPageElementTextResult.unwrap()

          if (!webPageElementText) {
            return notFoundError(`[ExecuteActionPlanCollectDataUseCase] webPageElementTextRepository.getByWebPageElementId not found by ${webPageElement.id}`)
          }

          webPageElementWithAssociations.push({
            ...webPageElement,
            ...webPageElementText,
          })

          break
        }
        case 'pageLink': {
          const getWebPageElementPageLinkResult = await this.webPageElementPageLinkRepository.getByWebPageElementId(webPageElement.id)

          if (getWebPageElementPageLinkResult.isErr()) {
            return unknownRuntimeError(
              `[ExecuteActionPlanCollectDataUseCase] webPageElementPageLinkRepository.getByWebPageElementId ${JSON.stringify(
                getWebPageElementPageLinkResult.unwrapErr(),
              )}`,
            )
          }

          const webPageElementPageLink = getWebPageElementPageLinkResult.unwrap()

          if (!webPageElementPageLink) {
            return notFoundError(
              `[ExecuteActionPlanCollectDataUseCase] webPageElementPageLinkRepository.getByWebPageElementId not found by ${webPageElement.id}`,
            )
          }

          webPageElementWithAssociations.push({
            ...webPageElement,
            ...webPageElementPageLink,
          })

          break
        }
        case null: {
          break
        }
        default:
          assertNever(webPageElement.type)

          return unknownRuntimeError(`[ExecuteActionPlanCollectDataUseCase] assertNever(webPageElement) ${JSON.stringify(webPageElement)}`)
      }
    }

    const extractCollectedDataResult = await this.collectedDataExtractor.extractFromWebPageElementsAndActionPlanCollectData(
      webPageElementWithAssociations.sort((a, b) => {
        // sort by order ascending
        return a.order - b.order
      }),
      actionPlanCollectData,
    )

    if (extractCollectedDataResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCollectDataUseCase] collectedDataExtractor.extractFromWebPageElementsAndActionPlanCollectData ${JSON.stringify(
          extractCollectedDataResult.unwrapErr(),
        )}`,
      )
    }

    const collectedData = extractCollectedDataResult.unwrap()

    const createCollectedDataResult = await this.collectedDataRepository.create(collectedData)

    if (createCollectedDataResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCollectDataUseCase] collectedDataRepository.create ${JSON.stringify(createCollectedDataResult.unwrapErr())}`,
      )
    }

    const issueActionResultIdResult = await this.actionResultRepository.issueId()

    if (issueActionResultIdResult.isErr()) {
      return unknownRuntimeError(
        `[ExecuteActionPlanCollectDataUseCase] actionResultRepository.issueId ${JSON.stringify(issueActionResultIdResult.unwrapErr())}`,
      )
    }

    const result: ActionResultWithAssociation = {
      id: issueActionResultIdResult.unwrap(),
      actionResultId: issueActionResultIdResult.unwrap(),
      type: 'collectData',
      actionPlanId: actionPlan.id,
      collectedDataId: collectedData.id,
    }

    return Ok(result)
  }
}
