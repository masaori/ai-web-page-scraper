import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'
import { UserRequest } from '../../entities/UserRequest'

export type UserRequestExtractor = {
  extractFromUserMessage: (promptFromUser: string) => PromisedResult<UserRequest, UnknownRuntimeError>
}
