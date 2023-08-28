// This file is generated by scripts/generateVectorDbRepositories.ts
import { ActionPlanReportResult } from '../../../../domain/entities/ActionPlanReportResult'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'action_plan_report_result'
const isActionPlanReportResult = (entity: unknown): entity is ActionPlanReportResult => {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'actionPlanId' in entity &&
    typeof entity.actionPlanId === 'string' &&
    'type' in entity &&
    typeof entity.type === 'string' &&
    'message' in entity &&
    typeof entity.message === 'string'
  )
}

export class VectorDbActionPlanReportResultRepository extends VectorDbRepository<'actionPlanId', ActionPlanReportResult> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('actionPlanId', qdrantCollectionName, isActionPlanReportResult, qdrantClient, openAiClient)
  }

  getByActionPlanId = async (actionPlanId: string): PromisedResult<ActionPlanReportResult | null, UnknownRuntimeError> => this.getByPrimaryKey(actionPlanId)
}