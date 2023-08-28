import { OpenAiClient } from '../_shared/OpenAiClient'
import { amazonPrimeVideoRankingWebPageUrl } from '../_shared/fixtures/WebPageElement'
import { LlmUserRequestExtractor } from './LlmUserRequestExtractor'

describe('LlmUserRequestExtractor', () => {
  test(
    'extractFromWebPageAndUserRequestAndActionPlans',
    async () => {
      const openAiClient = new OpenAiClient()

      const userRequestExtractor = new LlmUserRequestExtractor(openAiClient)
      const result = await userRequestExtractor.extractFromUserMessage(
        `このURL(${amazonPrimeVideoRankingWebPageUrl})にアクセスし、ランキング情報を収集してスプレッドシートにまとめてください`,
      )

      if (result.isErr()) {
        throw result.unwrapErr()
      }

      console.log(JSON.stringify(result.unwrap(), null, 2))

      expect(result).not.toBeNull()
    },
    10 * 60 * 1000,
  )
})
