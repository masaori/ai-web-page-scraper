import { ActionPlanWithAssociation } from '../../domain/entities/_gen/ActionPlanWithAssociation'
import { UserRequestWithAssociation } from '../../domain/entities/_gen/UserRequestWithAssociation'
import { WebPageWithAssociation } from '../../domain/entities/_gen/WebPageWithAssociation'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { amazonPrimeVideoRankingWebPageElements, amazonPrimeVideoRankingWebPageUrl } from '../_shared/fixtures/WebPageElement'
import { LlmActionPlanPredictor } from './LlmActionPlanPredictor'

describe('LlmActionPlanPredictor', () => {
  test(
    'predictByWebPageAndUserRequestAndActionPlans',
    async () => {
      const openAiClient = new OpenAiClient()

      const actionPlanPredictor = new LlmActionPlanPredictor(openAiClient)

      const webPage: WebPageWithAssociation = {
        id: 'webPageId',
        url: amazonPrimeVideoRankingWebPageUrl,
        width: 100,
        height: 100,
        webPageElements: amazonPrimeVideoRankingWebPageElements.filter((el) => el.type === 'pageLink'),
      }
      const actionPlans: ActionPlanWithAssociation[] = []
      const userRequest: UserRequestWithAssociation = {
        id: 'userRequestId',
        prompt: `
          Please do the following tasks:
          1. Create spread sheet.
          2. Collect ranking info.
          3. Add sheet to the spread sheet with ranking info.
          4. Click next category and move to the category page.
          5. Repeat 1-4 until all categories are done.
        `,
        url: amazonPrimeVideoRankingWebPageUrl,
        actionPlans,
      }

      const result = await actionPlanPredictor.predictByWebPageAndUserRequestAndActionPlans(webPage, userRequest, actionPlans)

      if (result.isErr()) {
        throw result.unwrapErr()
      }

      console.log(JSON.stringify(result.unwrap(), null, 2))

      expect(result).not.toBeNull()
    },
    10 * 60 * 1000,
  )
})
