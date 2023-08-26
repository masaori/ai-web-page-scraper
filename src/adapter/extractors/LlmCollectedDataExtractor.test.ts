import path from 'path'

import { LlmCollectedDataExtractor } from './LlmCollectedDataExtractor'
import { amazonPrimeVideoRankingWebPageElements, amazonPrimeVideoRankingWebPageUrl } from '../_shared/fixtures/WebPageElement'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { FileSystemClient } from '../_shared/FileSystemClient'

describe('LlmCollectedDataExtractor', () => {
  test(
    'extractByWebPageElementsAndActionPlanCollectData',
    async () => {
      const openAiClient = new OpenAiClient()
      const fileSystemClient = new FileSystemClient(path.resolve(__dirname, '../../../tmp/collectedData'), true)
      const llmCollectedDataExtractor = new LlmCollectedDataExtractor(openAiClient, fileSystemClient)

      const result = await llmCollectedDataExtractor.extractByWebPageElementsAndActionPlanCollectData(amazonPrimeVideoRankingWebPageElements.slice(0, 100), {
        actionPlanId: 'actionPlanId',
        type: 'collectData',
        name: 'Amazon Prime Video Best Seller Ranking Info',
        description: "Information listed on Amazon Prime Video's ranking page in order of ranking",
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
