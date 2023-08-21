import { Result, Err } from '@sniptt/monads'

export type PromisedResult<TOk, TErr> = Promise<Result<TOk, TErr>>

export type NotFoundError = {
  type: 'NotFoundError'
  message: string
}

export const notFoundError = <T>(message: string) =>
  Err<T, NotFoundError>({
    type: 'NotFoundError',
    message,
  })

export type AlreadyExistsError = {
  type: 'AlreadyExistsError'
  message: string
}

export const alreadyExistsError = <T>(message: string) =>
  Err<T, AlreadyExistsError>({
    type: 'AlreadyExistsError',
    message,
  })

export type UnknownRuntimeError = {
  type: 'UnknownRuntimeError'
  message: string
}

export const unknownRuntimeError = <T>(message: string) =>
  Err<T, UnknownRuntimeError>({
    type: 'UnknownRuntimeError',
    message,
  })
