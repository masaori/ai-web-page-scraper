// This file is generated by scripts/generateVectorDbRepositories.ts
import { ActionResultClick } from '../../../../domain/entities/ActionResultClick'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'action_result_click'
const isActionResultClick = (entity: unknown): entity is ActionResultClick => {
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

export class VectorDbActionResultClickRepository extends VectorDbRepository<'actionResultId', ActionResultClick> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('actionResultId', qdrantCollectionName, isActionResultClick, qdrantClient, openAiClient)
  }

  getByActionResultId = async (actionResultId: string): PromisedResult<ActionResultClick | null, UnknownRuntimeError> => this.getByPrimaryKey(actionResultId)
}
