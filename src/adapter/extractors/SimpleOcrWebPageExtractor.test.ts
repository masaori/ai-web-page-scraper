import * as path from 'path'
import { GoogleCloudVisionClient } from '../_shared/GoogleCloudVisionClient'
import { PuppeteerClient } from '../_shared/PuppeteerClient'
import { SimpleOcrWebPageExtractor } from './SimpleOcrWebPageExtractor'

describe('SimpleOcrWebPageExtractor', () => {
  test(
    'extractFromUrl',
    async () => {
      const puppeteerClient = new PuppeteerClient(path.resolve(path.join(__dirname, '../../../tmp')))
      const googleCloudVisionClient = new GoogleCloudVisionClient()
      const ocrWebPageExtractor = new SimpleOcrWebPageExtractor(puppeteerClient, googleCloudVisionClient)

      const result = await ocrWebPageExtractor.extractFromUrl('https://www.amazon.co.jp/gp/bestsellers/instant-video/')

      if (result.isErr()) {
        throw result.unwrapErr()
      }

      console.log(JSON.stringify(result.unwrap(), null, 2))

      expect(result).not.toBeNull()
    },
    10 * 60 * 1000,
  )
})
