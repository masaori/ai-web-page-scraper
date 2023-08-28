import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionResult } from './ActionResult'

export type ActionResultClick = {
  actionResultId: Unique<ActionResult['id']>
  type: 'click'
  result: 'done'
}
