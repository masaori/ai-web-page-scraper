// This file is generated by scripts/generateVectorDbRepositories.ts
import { ActionPlanCollectData } from '../../../../domain/entities/ActionPlanCollectData'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'action_plan_collect_data'
const isActionPlanCollectData = (entity: unknown): entity is ActionPlanCollectData => {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'actionPlanId' in entity &&
    typeof entity.actionPlanId === 'string' &&
    'type' in entity &&
    typeof entity.type === 'string' &&
    'name' in entity &&
    typeof entity.name === 'string' &&
    'url' in entity &&
    typeof entity.url === 'string' &&
    'description' in entity &&
    typeof entity.description === 'string'
  )
}

export class VectorDbActionPlanCollectDataRepository extends VectorDbRepository<'actionPlanId', ActionPlanCollectData> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('actionPlanId', qdrantCollectionName, isActionPlanCollectData, qdrantClient, openAiClient)
  }

  getByActionPlanId = async (actionPlanId: string): PromisedResult<ActionPlanCollectData | null, UnknownRuntimeError> => this.getByPrimaryKey(actionPlanId)
}
