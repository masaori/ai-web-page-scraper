// This file is generated by scripts/generateVectorDbRepositories.ts
import { ActionResult } from '../../../../domain/entities/ActionResult'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'action_result'
const isActionResult = (entity: unknown): entity is ActionResult => {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'id' in entity &&
    typeof entity.id === 'string' &&
    'actionPlanId' in entity &&
    typeof entity.actionPlanId === 'string' &&
    'type' in entity &&
    typeof entity.type === 'string'
  )
}

export class VectorDbActionResultRepository extends VectorDbRepository<'id', ActionResult> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('id', qdrantCollectionName, isActionResult, qdrantClient, openAiClient)
  }

  getById = async (id: string): PromisedResult<ActionResult | null, UnknownRuntimeError> => this.getByPrimaryKey(id)

  getByActionPlanId = async (actionPlanId: string): PromisedResult<ActionResult | null, UnknownRuntimeError> => this.getByProperty('actionPlanId', actionPlanId)
}
