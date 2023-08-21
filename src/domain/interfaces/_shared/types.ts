import { PromisedResult, UnknownRuntimeError } from '../../../_shared/error'

export type OperateSingleByKeyMethodName<TVerb extends string, TKeyName extends string> = `${TVerb}By${Capitalize<TKeyName>}`

export type OperateSingleByKeyMethodType<TEntity> = (key: string) => PromisedResult<TEntity, UnknownRuntimeError>

export type OperateMultipleByKeyMethodName<TVerb extends string, TKeyName extends string> = `${TVerb}AllBy${Capitalize<TKeyName>}`

export type OperateMultipleByKeyMethodType<TEntity> = (key: string) => PromisedResult<TEntity[], UnknownRuntimeError>

export type Operator<
  TVerb extends string,
  TEntity extends { id: string } & {
    [key in NonNullable<TUniqueKeysName>]: string | null
  } & {
    [key in NonNullable<TNonUniqueKeysName>]: string | null
  },
  TUniqueKeysName extends string | undefined = undefined,
  TNonUniqueKeysName extends string | undefined = undefined,
> = {
  [key in OperateSingleByKeyMethodName<TVerb, NonNullable<TUniqueKeysName>>]: OperateSingleByKeyMethodType<TEntity>
} & {
  [key in OperateMultipleByKeyMethodName<TVerb, NonNullable<TNonUniqueKeysName>>]: OperateMultipleByKeyMethodType<TEntity>
}
