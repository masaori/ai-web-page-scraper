import { LlmCollectedDataExtractor } from './LlmCollectedDataExtractor'
import { amazonPrimeVideoRankingWebPageElements, amazonPrimeVideoRankingWebPageUrl } from '../_shared/fixtures/WebPageElement'
import { OpenAiClient } from '../_shared/OpenAiClient'

describe('LlmCollectedDataExtractor', () => {
  test(
    'extractFromWebPageElementsAndActionPlanCollectData',
    async () => {
      const openAiClient = new OpenAiClient()
      const llmCollectedDataExtractor = new LlmCollectedDataExtractor(openAiClient)

      const result = await llmCollectedDataExtractor.extractFromWebPageElementsAndActionPlanCollectData(amazonPrimeVideoRankingWebPageElements.slice(0, 100), {
        actionPlanId: 'actionPlanId',
        type: 'collectData',
        collectedDataName: 'Amazon Prime Video Best Seller Ranking Info',
        whatToCollect: "Information listed on Amazon Prime Video's ranking page in order of ranking",
        webPageUrl: amazonPrimeVideoRankingWebPageUrl,
      })

      if (result.isErr()) {
        throw result.unwrapErr()
      }

      console.log(JSON.stringify(result.unwrap(), null, 2))

      expect(result).not.toBeNull()
    },
    10 * 60 * 1000,
  )
})
