// This file is generated by scripts/generateVectorDbRepositories.ts
import { ActionResultObserveWebPage } from '../../../../domain/entities/ActionResultObserveWebPage'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'action_result_observe_web_page'
const isActionResultObserveWebPage = (entity: unknown): entity is ActionResultObserveWebPage => {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'actionResultId' in entity &&
    typeof entity.actionResultId === 'string' &&
    'type' in entity &&
    typeof entity.type === 'string' &&
    'result' in entity &&
    typeof entity.result === 'string'
  )
}

export class VectorDbActionResultObserveWebPageRepository extends VectorDbRepository<'actionResultId', ActionResultObserveWebPage> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('actionResultId', qdrantCollectionName, isActionResultObserveWebPage, qdrantClient, openAiClient)
  }

  getByActionResultId = async (actionResultId: string): PromisedResult<ActionResultObserveWebPage | null, UnknownRuntimeError> =>
    this.getByPrimaryKey(actionResultId)
}
