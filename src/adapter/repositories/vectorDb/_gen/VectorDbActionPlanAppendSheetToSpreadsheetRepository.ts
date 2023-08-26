// This file is generated by scripts/generateVectorDbRepositories.ts
import { ActionPlanAppendSheetToSpreadsheet } from '../../../../domain/entities/ActionPlanAppendSheetToSpreadsheet'
import { QdrantClient } from '../../../_shared/QdrantClient'
import { OpenAiClient } from '../../../_shared/OpenAiClient'
import { VectorDbRepository } from '../_shared/VectorDbRepository'
/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */
import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../../../_shared/error'
import { Ok } from '@sniptt/monads'
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts */

const qdrantCollectionName = 'action_plan_append_sheet_to_spreadsheet'
const isActionPlanAppendSheetToSpreadsheet = (entity: unknown): entity is ActionPlanAppendSheetToSpreadsheet => {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'actionPlanId' in entity &&
    typeof entity.actionPlanId === 'string' &&
    'type' in entity &&
    typeof entity.type === 'string' &&
    'parentSpreadsheetTitle' in entity &&
    typeof entity.parentSpreadsheetTitle === 'string' &&
    'title' in entity &&
    typeof entity.title === 'string' &&
    'collectedDataName' in entity &&
    typeof entity.collectedDataName === 'string'
  )
}

export class VectorDbActionPlanAppendSheetToSpreadsheetRepository extends VectorDbRepository<'actionPlanId', ActionPlanAppendSheetToSpreadsheet> {
  constructor(qdrantClient: QdrantClient, openAiClient: OpenAiClient) {
    super('actionPlanId', qdrantCollectionName, isActionPlanAppendSheetToSpreadsheet, qdrantClient, openAiClient)
  }

  getByActionPlanId = async (actionPlanId: string): PromisedResult<ActionPlanAppendSheetToSpreadsheet | null, UnknownRuntimeError> =>
    this.getByPrimaryKey(actionPlanId)
}
