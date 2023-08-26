import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'
import { WebPageWithAssociation } from '../../entities/_gen/WebPageWithAssociation'

export type WebPageExtractor = {
  extractByUrl: (url: string) => PromisedResult<WebPageWithAssociation, UnknownRuntimeError>
}
