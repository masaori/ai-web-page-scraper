import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionResult } from './ActionResult'

export type ActionResultCollectData = {
  actionResultId: Unique<ActionResult['id']>
  type: 'collectData'
  collectedDataId: string
}
