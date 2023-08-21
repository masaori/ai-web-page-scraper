import path from 'path'
import fs from 'fs'
import puppeteer, { Browser, Page } from 'puppeteer'
import imageSizeFromBuffer from 'buffer-image-size'

export class PuppeteerClient {
  private browser: Browser | null = null

  private pageByUrl: Record<string, Page> = {}

  private captureResultByUrl: Record<string, { imageFilePath: string; imageWidth: number; imageHeight: number }> = {}

  private absoluteScreenshotDirectoryPath: string

  constructor(screenshotDirectoryPath: string) {
    this.absoluteScreenshotDirectoryPath = path.join(__dirname, screenshotDirectoryPath)

    if (!fs.existsSync(this.absoluteScreenshotDirectoryPath)) {
      fs.mkdirSync(this.absoluteScreenshotDirectoryPath, { recursive: true })
    }
  }

  private launchBrowser = async () => {
    if (this.browser) {
      return
    }
    this.browser = await puppeteer.launch({ headless: false })
  }

  private clickPointWithRetry = async (page: Page, point: { x: number; y: number }, retryCount = 60) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 256))
      await page.mouse.click(point.x, point.y)

      return
    } catch (e) {
      if (retryCount === 0) {
        throw e
      }
      console.log(`Failed to click ${JSON.stringify(point)} ${JSON.stringify(e)}. Retry... ${retryCount}`)
      await new Promise((resolve) => setTimeout(resolve, 256))
      await this.clickPointWithRetry(page, point, retryCount - 1)
    }
  }

  openPageByUrl = async (url: string): Promise<void> => {
    await this.launchBrowser()

    if (!this.browser) {
      throw new Error('[PuppeteerClient]: Failed to launch browser')
    }

    if (this.pageByUrl[url]) {
      return
    }

    const page = await this.browser.newPage()

    this.pageByUrl[url] = page
    await page.goto(url)
    await page.waitForNetworkIdle()

    return
  }

  capturePageByUrl = async (
    url: string,
    options?: {
      fullPage?: boolean
      useCache?: boolean
    },
  ): Promise<{
    imageFilePath: string
    imageWidth: number
    imageHeight: number
  }> => {
    const fullPage = options?.fullPage ?? true
    const useCache = options?.useCache ?? false
    const imageFilePath = path.join(this.absoluteScreenshotDirectoryPath, `${url}.png`)

    if (useCache && this.captureResultByUrl[url]) {
      return this.captureResultByUrl[url]
    }

    await this.launchBrowser()

    if (!this.browser) {
      throw new Error('[PuppeteerClient]: Failed to launch browser')
    }
    await this.openPageByUrl(url)

    const page = this.pageByUrl[url]

    await page.goto(url)
    await page.waitForNetworkIdle()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await page.screenshot({
      fullPage,
      path: imageFilePath,
    })

    const buffer = await fs.promises.readFile(imageFilePath)
    const imageDemension = imageSizeFromBuffer(buffer)

    const result = {
      imageFilePath,
      imageWidth: imageDemension.width,
      imageHeight: imageDemension.height,
    }

    this.captureResultByUrl[url] = result

    return result
  }

  clickPoint = async (url: string, point: { x: number; y: number }) => {
    await this.launchBrowser()

    if (!this.browser) {
      throw new Error('[PuppeteerClient]: Failed to launch browser')
    }
    await this.openPageByUrl(url)

    const page = this.pageByUrl[url]

    await this.clickPointWithRetry(page, point)
  }

  getElementByPoint = async (url: string, point: { x: number; y: number }) => {
    await this.launchBrowser()

    if (!this.browser) {
      throw new Error('[PuppeteerClient]: Failed to launch browser')
    }
    await this.openPageByUrl(url)

    const page = this.pageByUrl[url]

    return await page.evaluate(() => {
      return document.elementFromPoint(point.x, point.y)
    })
  }
}
