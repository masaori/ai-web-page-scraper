import { Ok } from '@sniptt/monads'
import { v4 as uuid } from 'uuid'
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { WebPageElement } from '../../domain/entities/WebPageElement'
import { Extractor } from '../../domain/interfaces/_shared/extractor'
import { PuppeteerClient } from '../_shared/PuppeteerClient'
import { WebPageRepository } from '../../domain/interfaces/_gen/repositories'
import { GoogleCloudVisionClient } from '../_shared/GoogleCloudVisionClient'

export class WebPageElementExtractor implements Extractor<WebPageElement, undefined, 'webPageId'> {
  constructor(
    private readonly puppeteerClient: PuppeteerClient,
    private readonly googleCloudVisionClient: GoogleCloudVisionClient,
    private readonly webPageRepository: WebPageRepository,
  ) {}

  extractAllByWebPageId = async (webPageId: string): PromisedResult<WebPageElement[], UnknownRuntimeError> => {
    try {
      const webPageResult = await this.webPageRepository.getById(webPageId)

      if (webPageResult.isErr()) {
        return webPageResult.map(() => [])
      }

      const webPage = webPageResult.unwrap()

      if (!webPage) {
        return Ok([])
      }

      const capturePageByUrlResult = await this.puppeteerClient.capturePageByUrl(webPage.url, { useCache: true })

      const getFullTextAnnotationResult = await this.googleCloudVisionClient.getFullTextAnnotation(capturePageByUrlResult.imageFilePath, { useCache: false })

      const result: WebPageElement[] = []

      for (const block of getFullTextAnnotationResult.blocks) {
        const id = uuid().toString()

        result.push({
          id,
          webPageId,
        })
      }
    } catch (e) {
      console.error(`[WebPageElementExtractor] extractByUrl: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }
}
