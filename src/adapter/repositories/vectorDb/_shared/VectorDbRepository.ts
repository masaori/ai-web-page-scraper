import { NotFoundError } from 'openai/error'
import { PromisedResult, UnknownRuntimeError, AlreadyExistsError, unknownRuntimeError } from '../../../../_shared/error'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { excludeNull } from '../../../../_shared/array'
import { Ok } from '@sniptt/monads'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { pascalCase } from 'change-case'

export class VectorDbRepository<TPrimaryKey extends string, T extends Record<TPrimaryKey, string>> {
  constructor(
    protected readonly primaryKeyName: TPrimaryKey,
    protected readonly qdrantCollectionName: string,
    protected readonly isEntityType: (entity: unknown) => entity is T,
    protected readonly qdrantClient: QdrantClient,
    protected readonly openAiClient: OpenAiClient,
  ) {}

  getByPrimaryKey = async (primaryKey: string): PromisedResult<T | null, UnknownRuntimeError> => {
    try {
      const scrollResult = await this.qdrantClient.scroll(this.qdrantCollectionName)
      const entities = scrollResult.points
        .map((point) => {
          if (!point.payload) {
            console.error(`[VectorDbTRepository] getBy${pascalCase(this.primaryKeyName)}: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        })
        .filter((entity): entity is T => !!entity && entity[this.primaryKeyName] === primaryKey)

      return Ok(entities[0] ?? null)
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
            console.error(`[QdrantTRepository] getAll: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        }),
      )

      return Ok(entities)
    } catch (e) {
      console.error(`[QdrantTRepository] getAll: ${JSON.stringify(e)}`)

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
      })
      const entities: T[] = excludeNull(
        searchResult.map((point) => {
          if (!point.payload) {
            console.error(`[QdrantTRepository] getRelevant: point.payload is null. Ignored ${point.id}`)

            return null
          }

          return this.isEntityType(point.payload) ? point.payload : null
        }),
      )

      return Ok(entities)
    } catch (e) {
      console.error(`[QdrantTRepository] getRelevant: ${JSON.stringify(e)}`)

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
            id: entity[this.primaryKeyName],
            vector: createEmbeddingResult[0].embedding,
            payload: entity,
          },
        ],
      })

      return Ok(entity)
    } catch (e) {
      console.error(`[QdrantTRepository] create: ${JSON.stringify(e)}`)

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
            id: entity[this.primaryKeyName],
            vector: createEmbeddingResult[0].embedding,
            payload: entity,
          },
        ],
      })

      return Ok(entity)
    } catch (e) {
      console.error(`[QdrantTRepository] update: ${JSON.stringify(e)}`)

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
        points: [primaryKey],
      })

      return Ok(undefined)
    } catch (e) {
      console.error(`[QdrantTRepository] delete: ${JSON.stringify(e)}`)

      if (e instanceof Error) {
        return unknownRuntimeError(e.message)
      } else {
        return unknownRuntimeError(JSON.stringify(e))
      }
    }
  }
}
