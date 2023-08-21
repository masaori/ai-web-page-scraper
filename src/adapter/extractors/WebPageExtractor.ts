import { Ok } from '@sniptt/monads'
import { v4 as uuid } from 'uuid'
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { WebPage } from '../../domain/entities/WebPage'
import { Extractor } from '../../domain/interfaces/_shared/extractor'
import { PuppeteerClient } from '../_shared/PuppeteerClient'

export class WebPageExtractor implements Extractor<WebPage, 'url'> {
  constructor(private readonly puppeteerClient: PuppeteerClient) {}

  extractByUrl = async (url: string): PromisedResult<WebPage, UnknownRuntimeError> => {
    try {
      const capturePageByUrlResult = await this.puppeteerClient.capturePageByUrl(url, { useCache: false })
      const id = uuid().toString()

      return Ok({
        id,
        url,
        width: capturePageByUrlResult.imageWidth,
        height: capturePageByUrlResult.imageHeight,
      })
    } catch (e) {
      console.error(`[WebPageExtractor] extractByUrl: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }
}
