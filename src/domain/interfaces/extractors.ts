import { PromisedResult, UnknownRuntimeError } from '../../_shared/error'
import { WebPage } from '../entities/WebPage'
import { WebPageElement } from '../entities/WebPageElement'
import { WebPageElementDownloadLink } from '../entities/WebPageElementDownloadLink'
import { WebPageElementPageLink } from '../entities/WebPageElementPageLink'

export type WebPageExtractor = {
  extractByUrl: (url: string) => PromisedResult<
    WebPage & {
      webPageElements: (WebPageElement & (WebPageElementPageLink | WebPageElementDownloadLink))[]
    },
    UnknownRuntimeError
  >
}

type A = WebPageElement & (WebPageElementPageLink | WebPageElementDownloadLink)

const a: A = {
  id: '1',
  webPageId: '1',
  type: 'downloadLink',
  top: 0,
  left: 0,
  width: 0,
  height: 0,
}
