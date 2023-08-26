import * as path from 'path'
import { GoogleCloudVisionClient } from '../_shared/GoogleCloudVisionClient'
import { PuppeteerClient } from '../_shared/PuppeteerClient'
import { OcrWebPageExtractor } from './OcrWebPageExtractor'

describe('OcrWebPageExtractor', () => {
  test(
    'extractByUrl',
    async () => {
      const puppeteerClient = new PuppeteerClient(path.resolve(path.join(__dirname, '../../../tmp')))
      const googleCloudVisionClient = new GoogleCloudVisionClient()
      const ocrWebPageExtractor = new OcrWebPageExtractor(puppeteerClient, googleCloudVisionClient)

      const result = await ocrWebPageExtractor.extractByUrl('https://www.amazon.co.jp/gp/bestsellers/instant-video/')

      if (result.isErr()) {
        throw result.unwrapErr()
      }

      console.log(JSON.stringify(result.unwrap(), null, 2))

      expect(result).not.toBeNull()
    },
    10 * 60 * 1000,
  )
})
