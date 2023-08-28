import { v4 as uuidv4, validate as validateUUID } from 'uuid'
import { createHash } from 'crypto'

import { PromisedResult, UnknownRuntimeError, NotFoundError, AlreadyExistsError, unknownRuntimeError } from '../../../../_shared/error'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { excludeNull } from '../../../../_shared/array'
import { Err, Ok } from '@sniptt/monads'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { pascalCase } from 'change-case'

const stringToUUID = (s: string): string => {
  const hash = createHash('sha256').update(s).digest('hex')
  const trimmedHash = hash.slice(0, 32)
  const parts = [trimmedHash.slice(0, 8), trimmedHash.slice(8, 12), trimmedHash.slice(12, 16), trimmedHash.slice(16, 20), trimmedHash.slice(20, 32)]

  return parts.join('-')
}

const uuidPrimaryKey = (primaryKey: string): string => (validateUUID(primaryKey) ? primaryKey : stringToUUID(primaryKey))

export class VectorDbRepository<TPrimaryKey extends string, T extends Record<TPrimaryKey, string>> {
  constructor(
    protected readonly primaryKeyName: TPrimaryKey,
    protected readonly qdrantCollectionName: string,
    protected readonly isEntityType: (entity: unknown) => entity is T,
    protected readonly qdrantClient: QdrantClient,
    protected readonly openAiClient: OpenAiClient,
  ) {}

  issueId = async (): PromisedResult<string, UnknownRuntimeError> => Ok(uuidv4().toString())

  getByPrimaryKey = async (primaryKey: string): PromisedResult<T | null, UnknownRuntimeError> => {
    try {
      const retrieveResult = await this.qdrantClient.retrieve(this.qdrantCollectionName, {
        ids: [uuidPrimaryKey(primaryKey)],
      })
      const candidate = retrieveResult[0]

      if (!candidate) {
        return Ok(null)
      }

      if (!this.isEntityType(candidate.payload)) {
        return unknownRuntimeError(`[VectorDbRepository] getByPrimaryKey: !this.isEntityType(candidate.payload) ${JSON.stringify(candidate)}`)
      }

      return Ok(candidate.payload)
    } catch (e) {
      console.error(`[VectorDbActionPlanRepository] getBy${pascalCase(this.primaryKeyName)}: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  getAll = async (): PromisedResult<T[], UnknownRuntimeError> => {
    try {
      const scrollResult = await this.qdrantClient.scroll(this.qdrantCollectionName)
      const entities: T[] = excludeNull(
        scrollResult.points.map((point) => {
          if (!point.payload) {
            console.error(`[VectorDbRepository] getAll: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        }),
      )

      return Ok(entities)
    } catch (e) {
      console.error(`[VectorDbRepository] getAll: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  getByProperty = async (propertyName: string, value: string): PromisedResult<T | null, UnknownRuntimeError> => {
    const getAllByPropertyResult = await this.getAllByProperty(propertyName, value)

    if (getAllByPropertyResult.isErr()) {
      return Err(getAllByPropertyResult.unwrapErr())
    }

    const entities = getAllByPropertyResult.unwrap()

    return Ok(entities.length > 0 ? entities[0] : null)
  }

  getAllByProperty = async (propertyName: string, value: string): PromisedResult<T[], UnknownRuntimeError> => {
    try {
      const scrollResult = await this.qdrantClient.scroll(this.qdrantCollectionName, {
        filter: {
          must: [
            {
              key: propertyName,
              match: {
                value,
              },
            },
          ],
        },
        limit: 100000,
      })
      const entities: T[] = excludeNull(
        scrollResult.points.map((point) => {
          if (!point.payload) {
            console.error(`[VectorDbRepository] getByProperty: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        }),
      )

      return Ok(entities)
    } catch (e) {
      console.error(`[VectorDbRepository] getByProperty: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  getRelevant = async (text: string, limit: number): PromisedResult<T[], UnknownRuntimeError> => {
    try {
      const createEmbeddingResult = await this.openAiClient.createEmbedding(text)

      if (createEmbeddingResult.length === 0) {
        return Ok([])
      }

      const searchResult = await this.qdrantClient.search(this.qdrantCollectionName, {
        vector: createEmbeddingResult[0].embedding,
        limit,
        score_threshold: 0.0,
      })
      const entities: T[] = excludeNull(
        searchResult.map((point) => {
          if (!point.payload) {
            console.error(`[VectorDbRepository] getRelevant: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        }),
      )

      return Ok(entities)
    } catch (e) {
      console.error(`[VectorDbRepository] getRelevant: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  create = async (entity: T): PromisedResult<T, UnknownRuntimeError | AlreadyExistsError> => {
    try {
      const createEmbeddingResult = await this.openAiClient.createEmbedding(JSON.stringify(entity))

      if (createEmbeddingResult.length === 0) {
        return unknownRuntimeError('createEmbeddingResult.length === 0')
      }

      await this.qdrantClient.upsert(this.qdrantCollectionName, {
        points: [
          {
            id: uuidPrimaryKey(entity[this.primaryKeyName]),
            vector: createEmbeddingResult[0].embedding,
            payload: entity,
          },
        ],
      })

      return Ok(entity)
    } catch (e) {
      console.error(`[VectorDbRepository] create: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  update = async (entity: T): PromisedResult<T, UnknownRuntimeError | NotFoundError> => {
    try {
      const createEmbeddingResult = await this.openAiClient.createEmbedding(JSON.stringify(entity))

      if (createEmbeddingResult.length === 0) {
        return unknownRuntimeError('createEmbeddingResult.length === 0')
      }

      await this.qdrantClient.upsert(this.qdrantCollectionName, {
        points: [
          {
            id: uuidPrimaryKey(entity[this.primaryKeyName]),
            vector: createEmbeddingResult[0].embedding,
            payload: entity,
          },
        ],
      })

      return Ok(entity)
    } catch (e) {
      console.error(`[VectorDbRepository] update: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }

  delete = async (primaryKey: string): PromisedResult<void, UnknownRuntimeError | NotFoundError> => {
    try {
      await this.qdrantClient.delete(this.qdrantCollectionName, {
        points: [uuidPrimaryKey(primaryKey)],
      })

      return Ok(undefined)
    } catch (e) {
      console.error(`[VectorDbRepository] delete: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }
}
