import { v4 as uuid } from 'uuid'

import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { VectorDbRepository } from './VectorDbRepository'

const qdrantCollectionName = `test_${uuid().toString().replace(/-/g, '_')}`

type TestEntity = {
  parentId: string
  siblingId: string
  name: string
}
class TestVectorDbRepository extends VectorDbRepository<'parentId', TestEntity> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super(
      'parentId',
      qdrantCollectionName,
      (entity: unknown): entity is TestEntity => {
        return (
          typeof entity === 'object' &&
          entity !== null &&
          'parentId' in entity &&
          typeof entity.parentId === 'string' &&
          'siblingId' in entity &&
          typeof entity.siblingId === 'string' &&
          'name' in entity &&
          typeof entity.name === 'string'
        )
      },
      qdrantClient,
      openAiClient,
    )
  }

  getByParentId = async (parentId: string) => this.getByPrimaryKey(parentId)

  getAllBySiblingId = async (siblingId: string) => this.getAllByProperty('siblingId', siblingId)
}

let testVectorDbRepository: TestVectorDbRepository

beforeAll(async () => {
  const qdrantClient = new QdrantClient()
  const openAiClient = new OpenAiClient()

  await qdrantClient.createCollection(qdrantCollectionName, {
    vectors: {
      size: 1536,
      distance: 'Cosine',
    },
  })
  await qdrantClient.createPayloadIndex(qdrantCollectionName, {
    field_name: 'parentId',
    field_schema: 'keyword',
    wait: true,
  })

  testVectorDbRepository = new TestVectorDbRepository(qdrantClient, openAiClient)
})

describe('VectorDbRepository', () => {
  const testEntity1: TestEntity = {
    parentId: 'parentId1',
    siblingId: 'siblingId1',
    name: 'name1',
  }
  const testEntity2: TestEntity = {
    parentId: 'parentId2',
    siblingId: 'siblingId2',
    name: 'name2',
  }
  const testEntity3: TestEntity = {
    parentId: 'parentId3',
    siblingId: 'siblingId1',
    name: 'name3',
  }

  test('create1', async () => {
    const createResult = await testVectorDbRepository.create(testEntity1)

    if (createResult.isErr()) {
      throw new Error(JSON.stringify(createResult.unwrap()))
    }
    expect(createResult.unwrap()).toEqual(testEntity1)
  })

  test('create2', async () => {
    const createResult = await testVectorDbRepository.create(testEntity2)

    if (createResult.isErr()) {
      throw new Error(JSON.stringify(createResult.unwrap()))
    }
    expect(createResult.unwrap()).toEqual(testEntity2)
  })

  test('create3', async () => {
    const createResult = await testVectorDbRepository.create(testEntity3)

    if (createResult.isErr()) {
      throw new Error(JSON.stringify(createResult.unwrap()))
    }
    expect(createResult.unwrap()).toEqual(testEntity3)
  })

  test('getByParentId', async () => {
    const getByParentIdResult = await testVectorDbRepository.getByParentId(testEntity1.parentId)

    if (getByParentIdResult.isErr()) {
      throw new Error(JSON.stringify(getByParentIdResult.unwrapErr()))
    }
    expect(getByParentIdResult.unwrap()).toEqual(testEntity1)
  })

  test('getAllBySiblingId', async () => {
    const getAllBySiblingIdResult = await testVectorDbRepository.getAllBySiblingId(testEntity1.siblingId)

    if (getAllBySiblingIdResult.isErr()) {
      throw new Error(JSON.stringify(getAllBySiblingIdResult.unwrapErr()))
    }
    expect(getAllBySiblingIdResult.unwrap()).toContainEqual(testEntity1)
    expect(getAllBySiblingIdResult.unwrap()).toContainEqual(testEntity3)
  })

  test('update', async () => {
    const updateResult = await testVectorDbRepository.update({
      ...testEntity1,
      name: 'name1Updated',
    })

    if (updateResult.isErr()) {
      throw new Error(JSON.stringify(updateResult.unwrapErr()))
    }
    expect(updateResult.unwrap()).toEqual({
      ...testEntity1,
      name: 'name1Updated',
    })
  })

  test('delete', async () => {
    const deleteResult = await testVectorDbRepository.delete(testEntity1.parentId)

    if (deleteResult.isErr()) {
      throw new Error(JSON.stringify(deleteResult.unwrapErr()))
    }
    expect(deleteResult.unwrap()).toBeUndefined()
  })

  test('getAll', async () => {
    const getAllResult = await testVectorDbRepository.getAll()

    if (getAllResult.isErr()) {
      throw new Error(JSON.stringify(getAllResult.unwrapErr()))
    }
    expect(getAllResult.unwrap()).not.toContainEqual(testEntity1)
    expect(getAllResult.unwrap()).toContainEqual(testEntity2)
    expect(getAllResult.unwrap()).toContainEqual(testEntity3)
  })
})
