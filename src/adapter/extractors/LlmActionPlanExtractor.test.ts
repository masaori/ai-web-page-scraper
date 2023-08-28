import { ActionPlanWithAssociation } from '../../domain/entities/_gen/ActionPlanWithAssociation'
import { UserRequestWithAssociation } from '../../domain/entities/_gen/UserRequestWithAssociation'
import { WebPageWithAssociation } from '../../domain/entities/_gen/WebPageWithAssociation'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { amazonPrimeVideoRankingWebPageElements, amazonPrimeVideoRankingWebPageUrl } from '../_shared/fixtures/WebPageElement'
import { LlmActionPlanExtractor } from './LlmActionPlanExtractor'

describe('LlmActionPlanExtractor', () => {
  test(
    'extractFromWebPageAndUserRequestAndActionPlans',
    async () => {
      const openAiClient = new OpenAiClient()

      const actionPlanExtractor = new LlmActionPlanExtractor(openAiClient)

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
        このURLにアクセスし、カテゴリごとにランキング情報を収集してスプレッドシートにまとめてください。シートは今日の日付を入れてください。
        `,
        url: amazonPrimeVideoRankingWebPageUrl,
        requestedAt: new Date().toISOString(),
        actionPlans,
      }

      const result = await actionPlanExtractor.extractFromWebPageAndUserRequestAndActionPlans(webPage, userRequest, actionPlans)

      if (result.isErr()) {
        throw result.unwrapErr()
      }

      console.log(JSON.stringify(result.unwrap(), null, 2))

      expect(result).not.toBeNull()
    },
    10 * 60 * 1000,
  )
})
