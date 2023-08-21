import fs from 'fs'
import path from 'path'

import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { Ok } from '@sniptt/monads'

export class JsonDatabaseClient {
  constructor(private readonly databaseDirectoryPath: string) {}

  read = async <T>(entityName: string): PromisedResult<T[], UnknownRuntimeError> => {
    try {
      const absoluteFilePath = path.join(this.databaseDirectoryPath, `${entityName}.json`)

      if (!fs.existsSync(absoluteFilePath)) {
        return unknownRuntimeError(`Target file does not exist: ${absoluteFilePath}`)
      }

      const fileContent = await fs.promises.readFile(absoluteFilePath, 'utf8')
      const entities = JSON.parse(fileContent) as T[] // eslint-disable-line no-type-assertion/no-type-assertion

      return Ok(entities)
    } catch (e) {
      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  write = async <T>(entityName: string, entities: T[]): PromisedResult<void, UnknownRuntimeError> => {
    try {
      const absoluteFilePath = path.join(this.databaseDirectoryPath, `${entityName}.json`)

      if (!fs.existsSync(absoluteFilePath)) {
        return unknownRuntimeError(`Target file does not exist: ${absoluteFilePath}`)
      }
      await fs.promises.writeFile(absoluteFilePath, JSON.stringify(entities))

      return Ok(undefined)
    } catch (e) {
      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }
}
