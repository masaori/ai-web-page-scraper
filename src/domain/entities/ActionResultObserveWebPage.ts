import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionResult } from './ActionResult'

export type ActionResultObserveWebPage = {
  actionResultId: Unique<ActionResult['id']>
  type: 'observeWebPage'
  // TODO
  result: 'done'
}
