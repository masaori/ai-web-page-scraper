import { Ok } from '@sniptt/monads'
import { v4 as uuid } from 'uuid'
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { PuppeteerClient } from '../_shared/PuppeteerClient'
import { WebPageWithAssociation } from '../../domain/entities/_gen/WebPageWithAssociation'
import { GoogleCloudVisionClient } from '../_shared/GoogleCloudVisionClient'
import { WebPageElementWithAssociation } from '../../domain/entities/_gen/WebPageElementWithAssociation'
import { WebPageExtractor } from '../../domain/interfaces/extractors/WebPageExtractor'

export class SimpleOcrWebPageExtractor implements WebPageExtractor {
  constructor(
    private readonly puppeteerClient: PuppeteerClient,
    private readonly googleCloudVisionClient: GoogleCloudVisionClient,
  ) {}

  extractFromUrl = async (url: string): PromisedResult<WebPageWithAssociation, UnknownRuntimeError> => {
    try {
      const capturePageByUrlResult = await this.puppeteerClient.capturePageByUrl(url, { useCache: false })
      const webPageId = uuid().toString()

      const ocrResult = await this.googleCloudVisionClient.getFullTextAnnotation(capturePageByUrlResult.imageFilePath, { useCache: false })

      const webPageElements: WebPageWithAssociation['webPageElements'] = []

      for (const [i, block] of (ocrResult.blocks ?? []).entries()) {
        if (
          !block.boundingBox?.vertices ||
          !block.boundingBox?.vertices?.[0] ||
          !block.boundingBox?.vertices?.[1] ||
          !block.boundingBox?.vertices?.[2] ||
          !block.boundingBox?.vertices?.[3]
        ) {
          console.error(`[WebPageExtractor] extractFromUrl: block.boundingBox is null`)

          continue
        }

        const top = block.boundingBox.vertices[0].y
        const bottom = block.boundingBox.vertices[2].y
        const left = block.boundingBox.vertices[0].x
        const right = block.boundingBox.vertices[2].x

        if (
          top === undefined ||
          top === null ||
          bottom === undefined ||
          bottom === null ||
          left === undefined ||
          left === null ||
          right === undefined ||
          right === null
        ) {
          console.error(`[WebPageExtractor] extractFromUrl: top, bottom, left, right is undefined`)

          continue
        }

        // Extract element via puppeteer
        const getElementsByPointResult = await this.puppeteerClient.getElementsByPoint(url, {
          x: left,
          y: top,
        })

        const webPageElementId = uuid().toString()
        const text =
          block.paragraphs?.map((paragraph) => paragraph.words?.map((word) => word.symbols?.map((symbol) => symbol.text).join('')).join('')).join('') ?? ''

        let webPageElementSubtype: WebPageElementWithAssociation | null = null

        for (const element of getElementsByPointResult) {
          const href = await element.evaluate((el) => {
            return el.getAttribute('href')
          })

          if (href) {
            webPageElementSubtype = {
              id: webPageElementId,
              webPageElementId,
              webPageId,
              type: 'pageLink',
              order: i + 1,
              top,
              left,
              width: right - left,
              height: bottom - top,
              text,
              url: href,
            }
            break
          }
        }

        if (!webPageElementSubtype) {
          webPageElementSubtype = {
            id: webPageElementId,
            webPageElementId,
            webPageId,
            type: 'text',
            order: i + 1,
            top,
            left,
            width: right - left,
            height: bottom - top,
            text,
          }
        }

        webPageElements.push(webPageElementSubtype)
      }

      return Ok({
        id: webPageId,
        url,
        width: capturePageByUrlResult.imageWidth,
        height: capturePageByUrlResult.imageHeight,
        webPageElements,
      })
    } catch (e) {
      console.error(`[WebPageExtractor] extractFromUrl: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(
          JSON.stringify({
            message: e.message,
            stack: e.stack,
          }),
        )
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    } finally {
      await this.puppeteerClient.closePageByUrl(url)
    }
  }
}
