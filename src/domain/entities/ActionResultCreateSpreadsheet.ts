import { Unique } from 'ast-to-entity-definitions/bin/domain/entities/Unique'
import { ActionResult } from './ActionResult'

export type ActionResultCreateSpreadsheet = {
  actionResultId: Unique<ActionResult['id']>
  type: 'createSpreadsheet'
  spreadsheetId: string
}
