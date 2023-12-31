// This file is generated by scripts/generateVectorDbRepositories.ts
import { ActionResultReportResult } from '../../../../domain/entities/ActionResultReportResult'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'action_result_report_result'
const isActionResultReportResult = (entity: unknown): entity is ActionResultReportResult => {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'actionResultId' in entity &&
    typeof entity.actionResultId === 'string' &&
    'type' in entity &&
    typeof entity.type === 'string' &&
    'message' in entity &&
    typeof entity.message === 'string'
  )
}

export class VectorDbActionResultReportResultRepository extends VectorDbRepository<'actionResultId', ActionResultReportResult> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('actionResultId', qdrantCollectionName, isActionResultReportResult, qdrantClient, openAiClient)
  }

  getByActionResultId = async (actionResultId: string): PromisedResult<ActionResultReportResult | null, UnknownRuntimeError> =>
    this.getByPrimaryKey(actionResultId)
}
