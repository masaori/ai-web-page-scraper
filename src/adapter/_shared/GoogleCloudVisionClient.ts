import * as path from 'path'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import { google } from '@google-cloud/vision/build/protos/protos'

export class GoogleCloudVisionClient {
  private googleCloudVisionClient = new ImageAnnotatorClient({
    keyFilename: path.resolve('./google-service-account.json'),
  })

  private fullTextAnnotationByImagePath: Record<string, google.cloud.vision.v1.IPage> = {}

  getFullTextAnnotation = async (
    imagePath: string,
    options: {
      useCache?: boolean
    },
  ): Promise<google.cloud.vision.v1.IPage> => {
    if (options.useCache && this.fullTextAnnotationByImagePath[imagePath]) {
      return this.fullTextAnnotationByImagePath[imagePath]
    }

    const documentTextDetectionResult = await this.googleCloudVisionClient.documentTextDetection({
      image: {
        source: {
          filename: imagePath,
        },
      },
      imageContext: {
        languageHints: ['ja'],
      },
    })
    const fullTextAnnotation = documentTextDetectionResult[0].fullTextAnnotation

    if (!fullTextAnnotation) {
      throw new Error('[GoogleCloudVisionClient]: Failed to get fullTextAnnotation')
    }

    if (!fullTextAnnotation.pages?.[0]) {
      throw new Error('[GoogleCloudVisionClient]: fullTextAnnotation has no pages')
    }

    this.fullTextAnnotationByImagePath[imagePath] = fullTextAnnotation.pages[0]

    return fullTextAnnotation.pages[0]
  }
}
