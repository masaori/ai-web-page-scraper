import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionResult } from './ActionResult'

export type ActionResultReportResult = {
  actionResultId: Unique<ActionResult['id']>
  type: 'reportResult'
  message: string
}
