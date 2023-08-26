import { QdrantClient as Client } from '@qdrant/js-client-rest'

export class QdrantClient {
  private client = new Client({
    url: 'http://localhost:6333',
  })

  getCollections: typeof this.client.getCollections = (...args) => this.client.getCollections(...args)

  createCollection: typeof this.client.createCollection = (...args) => this.client.createCollection(...args)

  deleteCollection: typeof this.client.deleteCollection = (...args) => this.client.deleteCollection(...args)

  createPayloadIndex: typeof this.client.createPayloadIndex = (...args) => this.client.createPayloadIndex(...args)

  search: typeof this.client.search = (...args) => this.client.search(...args)

  scroll: typeof this.client.scroll = (...args) => this.client.scroll(...args)

  upsert: typeof this.client.upsert = (...args) => this.client.upsert(...args)

  delete: typeof this.client.delete = (...args) => this.client.delete(...args)
}
