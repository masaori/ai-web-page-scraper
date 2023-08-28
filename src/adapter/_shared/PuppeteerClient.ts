import path from 'path'
import fs from 'fs'
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer'
import imageSizeFromBuffer from 'buffer-image-size'

import amazonCookiesJson from '../../../read.amazon.co.jp.cookies.json'

export class PuppeteerClient {
  private browser: Browser | null = null

  private pageByUrl: Record<string, Page> = {}

  private captureResultByUrl: Record<string, { imageFilePath: string; imageWidth: number; imageHeight: number }> = {}

  constructor(private absoluteScreenshotDirectoryPath: string) {
    console.log(`[PuppeteerClient]: absoluteScreenshotDirectoryPath: ${absoluteScreenshotDirectoryPath}`)

    if (!fs.existsSync(this.absoluteScreenshotDirectoryPath)) {
      throw new Error(`[PuppeteerClient]: Directory does not exist: ${this.absoluteScreenshotDirectoryPath}`)
    }
  }

  private launchBrowser = async () => {
    if (this.browser) {
      return
    }
    this.browser = await puppeteer.launch({ headless: 'new' })
    // this.browser = await puppeteer.launch({ headless: false })
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

    await page.setCookie(...amazonCookiesJson)
    await page.setViewport({ width: 1600, height: 900 })

    this.pageByUrl[url] = page
    await page.goto(url)
    await page.waitForNetworkIdle()

    return
  }

  closePageByUrl = async (url: string): Promise<void> => {
    await this.launchBrowser()

    if (!this.browser) {
      return
    }

    if (!this.pageByUrl[url]) {
      return
    }

    await this.pageByUrl[url].close()
    delete this.pageByUrl[url]

    if (Object.keys(this.pageByUrl).length === 0) {
      await this.browser.close()
      this.browser = null
    }
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
    const escapedUrl = url.replace(/[^a-zA-Z0-9]/g, '_')
    const imageFilePath = path.join(this.absoluteScreenshotDirectoryPath, `${escapedUrl}.png`)

    if (useCache && this.captureResultByUrl[url]) {
      return this.captureResultByUrl[url]
    }

    await this.launchBrowser()

    if (!this.browser) {
      throw new Error('[PuppeteerClient]: Failed to launch browser')
    }
    await this.openPageByUrl(url)

    const page = this.pageByUrl[url]

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

  getElementsByPoint = async (url: string, point: { x: number; y: number }): Promise<ElementHandle<Element>[]> => {
    await this.launchBrowser()

    if (!this.browser) {
      throw new Error('[PuppeteerClient]: Failed to launch browser')
    }
    await this.openPageByUrl(url)

    const page = this.pageByUrl[url]

    await page.mouse.move(point.x, point.y)

    const hoveredElements = await page.$$(':hover')

    return hoveredElements
  }
}
